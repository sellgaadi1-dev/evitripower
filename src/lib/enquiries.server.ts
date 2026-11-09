import { neon } from "@neondatabase/serverless";

import type { Enquiry } from "./enquiry";

// Created on first use so there is no migration step to run. Vercel's Neon integration
// sets DATABASE_URL; without it (local dev, Lovable preview) enquiries are not stored.
let tableReady: Promise<unknown> | undefined;

export function databaseUrl(): string | undefined {
  return globalThis.process?.env?.["DATABASE_URL"] || undefined;
}

export async function storeEnquiry(enquiry: Enquiry): Promise<{ stored: boolean }> {
  const url = databaseUrl();
  if (!url) return { stored: false };

  const sql = neon(url);

  tableReady ??= sql`
    CREATE TABLE IF NOT EXISTS enquiries (
      id          BIGSERIAL PRIMARY KEY,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      name        TEXT NOT NULL,
      company     TEXT NOT NULL DEFAULT '',
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL DEFAULT '',
      type        TEXT NOT NULL DEFAULT '',
      interest    TEXT NOT NULL DEFAULT '',
      details     TEXT NOT NULL DEFAULT ''
    )
  `.catch((error: unknown) => {
    tableReady = undefined;
    throw error;
  });
  await tableReady;

  await sql`
    INSERT INTO enquiries (name, company, email, phone, type, interest, details)
    VALUES (${enquiry.name}, ${enquiry.company}, ${enquiry.email}, ${enquiry.phone},
            ${enquiry.type}, ${enquiry.interest}, ${enquiry.details})
  `;
  return { stored: true };
}

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import type { Enquiry } from "./enquiry";

type Env = Record<string, string | undefined>;

const URL_KEYS = ["DATABASE_URL", "POSTGRES_URL", "NEON_DATABASE_URL"];

// Vercel's Neon integration sets DATABASE_URL, or PREFIX_DATABASE_URL when the store was
// connected with a custom environment-variable prefix.
export function databaseUrl(env: Env = globalThis.process?.env ?? {}): string | undefined {
  for (const key of URL_KEYS) {
    if (env[key]) return env[key];
  }
  const prefixed = Object.keys(env)
    .sort()
    .find((key) => /_(DATABASE_URL|POSTGRES_URL)$/.test(key) && env[key]);
  return prefixed ? env[prefixed] : undefined;
}

// Created on first use so there is no migration step to run.
let tableReady: Promise<unknown> | undefined;

function ensureTable(sql: NeonQueryFunction<false, false>) {
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
  return tableReady;
}

export type StoreResult = { stored: true } | { stored: false; reason: "not_configured" | "error" };

export async function storeEnquiry(enquiry: Enquiry): Promise<StoreResult> {
  const url = databaseUrl();
  if (!url) {
    console.error(
      "Enquiry not stored: no DATABASE_URL (connect a Neon database in Vercel → Storage).",
    );
    return { stored: false, reason: "not_configured" };
  }
  try {
    const sql = neon(url);
    await ensureTable(sql);
    await sql`
      INSERT INTO enquiries (name, company, email, phone, type, interest, details)
      VALUES (${enquiry.name}, ${enquiry.company}, ${enquiry.email}, ${enquiry.phone},
              ${enquiry.type}, ${enquiry.interest}, ${enquiry.details})
    `;
    return { stored: true };
  } catch (error) {
    console.error("Enquiry not stored: database error", error);
    return { stored: false, reason: "error" };
  }
}

export type DatabaseStatus = "connected" | "not_configured" | "error";

// Used by /api/health: confirms the connection and that the enquiries table exists,
// without writing an enquiry.
export async function checkDatabase(): Promise<DatabaseStatus> {
  const url = databaseUrl();
  if (!url) return "not_configured";
  try {
    const sql = neon(url);
    await ensureTable(sql);
    await sql`SELECT 1 FROM enquiries LIMIT 1`;
    return "connected";
  } catch (error) {
    console.error("Database health check failed", error);
    return "error";
  }
}

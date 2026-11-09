import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queries: string[] = [];
const values: unknown[][] = [];
let failQueries = false;

vi.mock("@neondatabase/serverless", () => ({
  neon:
    () =>
    async (strings: TemplateStringsArray, ...params: unknown[]) => {
      if (failQueries) throw new Error("connection refused");
      queries.push(strings.join("?").replace(/\s+/g, " ").trim());
      values.push(params);
      return [];
    },
}));

import { enquirySchema, rules, suggestEmail, validateEnquiry } from "@/lib/enquiry";
import { enquiryEmailBody } from "@/lib/enquiry-email";

const valid = {
  name: "Arjun Kale",
  company: "Example Motors",
  email: "arjun@example.com",
  phone: "+91 85305 08016",
  type: "Tier-1 supplier",
  interest: "Homologation",
  details: "Electric buses for India from 2027, need a localization partner.",
};

describe("Field rules", () => {
  it("accepts a complete, valid enquiry", () => {
    expect(validateEnquiry(valid)).toEqual({});
  });

  it("reports every missing field with its own message", () => {
    const errors = validateEnquiry({});
    expect(errors).toEqual({
      name: "Please enter your full name.",
      company: "Please enter your company or group name.",
      email: "Please enter your email address.",
      phone: "Please enter your phone number.",
      type: "Please select what best describes you.",
      interest: "Please select what you need help with.",
      details: "Please tell us briefly what you are planning.",
    });
  });

  it("explains malformed values", () => {
    expect(rules.name("R2D2")).toMatch(/letters only/);
    expect(rules.name("A")).toMatch(/too short/);
    expect(rules.email("arjun")).toMatch(/missing an “@”/);
    expect(rules.email("arjun@gmail")).toMatch(/complete email/);
    expect(rules.email("arjun @gmail.com")).toMatch(/spaces/);
    expect(rules.phone("98765")).toMatch(/too short/);
    expect(rules.phone("98765abc12")).toMatch(/digits only/);
    expect(rules.phone("91+98765 43210")).toMatch(/only go at the start/);
    expect(rules.phone("1234567890123456")).toMatch(/too many digits/);
    expect(rules.type("Astronaut")).toMatch(/one of the options/);
    expect(rules.details("gjfgjhfj")).toBe(
      "Add a little more detail: at least 20 characters (8/20).",
    );
  });

  it("accepts the values from a real test submission, apart from the too-short plans", () => {
    expect(
      validateEnquiry({
        name: "ARJUN KALE",
        company: "jjj",
        email: "arjunkale.in@gmail.com",
        phone: "8530508016",
        type: "Tier-1 supplier",
        interest: "Homologation",
        details: "gjfgjhfj",
      }),
    ).toEqual({ details: "Add a little more detail: at least 20 characters (8/20)." });
  });

  it("accepts international names and phone formats", () => {
    expect(rules.name("José O’Neil-Müller")).toBeUndefined();
    expect(rules.phone("+86 (10) 1234-5678")).toBeUndefined();
    expect(rules.phone("+971 50 123 4567")).toBeUndefined();
  });

  it("trims whitespace before storing", () => {
    const parsed = enquirySchema.parse({ ...valid, name: "  Arjun Kale  " });
    expect(parsed.name).toBe("Arjun Kale");
  });
});

describe("Email suggestions", () => {
  it("suggests a fix for common domain typos", () => {
    expect(suggestEmail("arjun@gmial.com")).toBe("arjun@gmail.com");
    expect(suggestEmail("arjun@hotmial.com")).toBe("arjun@hotmail.com");
    expect(suggestEmail("arjun@company.con")).toBe("arjun@company.com");
  });

  it("leaves correct and company domains alone", () => {
    expect(suggestEmail("arjun@gmail.com")).toBeUndefined();
    expect(suggestEmail("arjun@aol.com")).toBeUndefined();
    expect(suggestEmail("arjun@evtripower.com")).toBeUndefined();
    expect(suggestEmail("arjun@byd.com")).toBeUndefined();
  });
});

describe("Enquiry email fallback", () => {
  it("lists every field in the email body", () => {
    expect(enquiryEmailBody(valid)).toBe(
      [
        "Name: Arjun Kale",
        "Company: Example Motors",
        "Email: arjun@example.com",
        "Phone: +91 85305 08016",
        "Type: Tier-1 supplier",
        "Interest: Homologation",
        "Details: Electric buses for India from 2027, need a localization partner.",
      ].join("\n"),
    );
  });
});

describe("Database connection string", () => {
  it("finds DATABASE_URL, POSTGRES_URL or a prefixed variant", async () => {
    const { databaseUrl } = await import("@/lib/enquiries.server");
    expect(databaseUrl({ DATABASE_URL: "a" })).toBe("a");
    expect(databaseUrl({ POSTGRES_URL: "b" })).toBe("b");
    expect(databaseUrl({ STORAGE_DATABASE_URL: "c" })).toBe("c");
    expect(databaseUrl({ STORAGE_DATABASE_URL_UNPOOLED: "x" })).toBeUndefined();
    expect(databaseUrl({})).toBeUndefined();
  });
});

describe("Enquiry storage", () => {
  const enquiry = enquirySchema.parse(valid);

  beforeEach(() => {
    vi.resetModules();
    queries.length = 0;
    values.length = 0;
    failQueries = false;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reports when no database is configured", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("POSTGRES_URL", "");
    const { storeEnquiry } = await import("@/lib/enquiries.server");
    expect(await storeEnquiry(enquiry)).toEqual({ stored: false, reason: "not_configured" });
    expect(queries).toHaveLength(0);
  });

  it("creates the table once and inserts each enquiry", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@example.neon.tech/db");
    const { storeEnquiry } = await import("@/lib/enquiries.server");

    expect(await storeEnquiry(enquiry)).toEqual({ stored: true });
    expect(await storeEnquiry(enquiry)).toEqual({ stored: true });

    expect(queries.filter((q) => q.startsWith("CREATE TABLE"))).toHaveLength(1);
    expect(queries.filter((q) => q.startsWith("INSERT INTO enquiries"))).toHaveLength(2);
    expect(values.at(-1)).toEqual([
      "Arjun Kale",
      "Example Motors",
      "arjun@example.com",
      "+91 85305 08016",
      "Tier-1 supplier",
      "Homologation",
      "Electric buses for India from 2027, need a localization partner.",
    ]);
  });

  it("reports a database error instead of throwing", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@example.neon.tech/db");
    failQueries = true;
    const { storeEnquiry, checkDatabase } = await import("@/lib/enquiries.server");
    expect(await storeEnquiry(enquiry)).toEqual({ stored: false, reason: "error" });
    expect(await checkDatabase()).toBe("error");
  });

  it("health check connects and creates the table without inserting", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@example.neon.tech/db");
    const { checkDatabase } = await import("@/lib/enquiries.server");
    expect(await checkDatabase()).toBe("connected");
    expect(queries.some((q) => q.startsWith("CREATE TABLE IF NOT EXISTS enquiries"))).toBe(true);
    expect(queries.some((q) => q.startsWith("INSERT"))).toBe(false);
  });
});

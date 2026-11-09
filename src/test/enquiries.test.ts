import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queries: string[] = [];
const values: unknown[][] = [];

vi.mock("@neondatabase/serverless", () => ({
  neon:
    () =>
    async (strings: TemplateStringsArray, ...params: unknown[]) => {
      queries.push(strings.join("?").replace(/\s+/g, " ").trim());
      values.push(params);
      return [];
    },
}));

import { enquiryFromForm, enquirySchema } from "@/lib/enquiry";

const enquiry = enquirySchema.parse({
  name: "Asha",
  company: "Example Motors",
  email: "asha@example.com",
  phone: "",
  type: "Global EV maker",
  interest: "Homologation",
  details: "Buses, 2027",
});

describe("Enquiry storage", () => {
  beforeEach(() => {
    vi.resetModules();
    queries.length = 0;
    values.length = 0;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("skips storage when no database is configured", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const { storeEnquiry } = await import("@/lib/enquiries.server");
    expect(await storeEnquiry(enquiry)).toEqual({ stored: false });
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
      "Asha",
      "Example Motors",
      "asha@example.com",
      "",
      "Global EV maker",
      "Homologation",
      "Buses, 2027",
    ]);
  });
});

describe("Enquiry form mapping", () => {
  it("maps the page's form fields to the schema", () => {
    const form = new FormData();
    form.set("Name", " Asha ");
    form.set("Email", "asha@example.com");
    form.set("Interest", "Homologation");
    const parsed = enquirySchema.parse(enquiryFromForm(form));
    expect(parsed).toMatchObject({
      name: "Asha",
      email: "asha@example.com",
      interest: "Homologation",
      company: "",
    });
  });

  it("rejects an enquiry without a name or valid email", () => {
    expect(enquirySchema.safeParse({ name: "", email: "x@example.com" }).success).toBe(false);
    expect(enquirySchema.safeParse({ name: "Asha", email: "not-an-email" }).success).toBe(false);
  });
});

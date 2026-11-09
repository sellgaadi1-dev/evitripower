import { z } from "zod";

// Browser-safe: shared by the contact form and the server function that stores it.
export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200).default(""),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).default(""),
  type: z.string().trim().max(100).default(""),
  interest: z.string().trim().max(150).default(""),
  details: z.string().trim().max(5000).default(""),
});

export type Enquiry = z.infer<typeof enquirySchema>;

// Form field name (as used in the page's <input name>) → schema key.
export const enquiryFormFields = {
  Name: "name",
  Company: "company",
  Email: "email",
  Phone: "phone",
  Type: "type",
  Interest: "interest",
  Details: "details",
} as const satisfies Record<string, keyof Enquiry>;

export function enquiryFromForm(form: FormData): Record<keyof Enquiry, string> {
  const out = {} as Record<keyof Enquiry, string>;
  for (const [field, key] of Object.entries(enquiryFormFields)) {
    const value = form.get(field);
    out[key] = typeof value === "string" ? value : "";
  }
  return out;
}

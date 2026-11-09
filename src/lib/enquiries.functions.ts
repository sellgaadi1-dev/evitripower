import { createServerFn } from "@tanstack/react-start";

import { enquirySchema, fieldErrorsFrom, type EnquiryInput, type FieldErrors } from "./enquiry";

export type SaveEnquiryResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; fieldErrors: FieldErrors }
  | { ok: false; reason: "unavailable" };

// Public lead form: no sign-in. Input is re-validated here with the same rules the form uses.
export const saveEnquiry = createServerFn({ method: "POST" })
  .validator((input: EnquiryInput) => input)
  .handler(async ({ data }): Promise<SaveEnquiryResult> => {
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, reason: "invalid", fieldErrors: fieldErrorsFrom(parsed.error) };
    }
    // Honeypot filled in: a bot. Report success so it moves on, but store nothing.
    if (parsed.data.website) return { ok: true };

    const { storeEnquiry } = await import("./enquiries.server");
    const result = await storeEnquiry(parsed.data);
    return result.stored ? { ok: true } : { ok: false, reason: "unavailable" };
  });

import { z } from "zod";

// Browser-safe: the contact form validates live with these rules, and the server function
// re-checks the same schema before anything is stored.

export const VISITOR_TYPES = [
  "Indian business / automotive group",
  "Global EV maker",
  "Tier-1 supplier",
  "Dealer group",
  "Other",
] as const;

export const INTERESTS = [
  "Bring an EV brand to India",
  "Localization / plant setup",
  "Homologation",
  "Dealer network & aftersales",
  "Partner brokering (China)",
  "Turnaround / interim leadership",
] as const;

export const ENQUIRY_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "type",
  "interest",
  "details",
] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryValues = Record<EnquiryField, string>;
export type FieldErrors = Partial<Record<EnquiryField, string>>;

export const LIMITS = {
  name: 100,
  company: 150,
  email: 254,
  phone: 20,
  details: 2000,
} as const;
export const DETAILS_MIN = 20;

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// One rule per field, returning the first problem as a sentence the visitor can act on.
export const rules: Record<EnquiryField, (value: string) => string | undefined> = {
  name(v) {
    if (!v) return "Please enter your full name.";
    if (v.length < 2) return "Name looks too short.";
    if (v.length > LIMITS.name) return `Name must be ${LIMITS.name} characters or fewer.`;
    if (!NAME_RE.test(v)) return "Use letters only, with no numbers or symbols.";
    return undefined;
  },
  company(v) {
    if (!v) return "Please enter your company or group name.";
    if (v.length < 2) return "Company name looks too short.";
    if (v.length > LIMITS.company)
      return `Company name must be ${LIMITS.company} characters or fewer.`;
    if (!/[\p{L}\p{N}]/u.test(v)) return "Enter a valid company name.";
    return undefined;
  },
  email(v) {
    if (!v) return "Please enter your email address.";
    if (/\s/.test(v)) return "Email addresses can't contain spaces.";
    if (!v.includes("@")) return "Email is missing an “@”, as in name@company.com.";
    if (v.length > LIMITS.email) return "Email address is too long.";
    if (!EMAIL_RE.test(v)) return "Enter a complete email address, like name@company.com.";
    return undefined;
  },
  phone(v) {
    if (!v) return "Please enter your phone number.";
    if (/[^\d+()\-.\s]/.test(v))
      return "Use digits only. You can include +, spaces, dashes or brackets.";
    if (/.\+/.test(v)) return "“+” can only go at the start, before the country code.";
    const digits = v.replace(/\D/g, "").length;
    if (digits < 8) return "Phone number looks too short. Include the area or country code.";
    if (digits > 15) return "Phone number has too many digits (15 at most).";
    return undefined;
  },
  type(v) {
    if (!v) return "Please select what best describes you.";
    if (!(VISITOR_TYPES as readonly string[]).includes(v))
      return "Please choose one of the options.";
    return undefined;
  },
  interest(v) {
    if (!v) return "Please select what you need help with.";
    if (!(INTERESTS as readonly string[]).includes(v)) return "Please choose one of the options.";
    return undefined;
  },
  details(v) {
    if (!v) return "Please tell us briefly what you are planning.";
    if (v.length < DETAILS_MIN)
      return `Add a little more detail: at least ${DETAILS_MIN} characters (${v.length}/${DETAILS_MIN}).`;
    if (v.length > LIMITS.details)
      return `Please keep this under ${LIMITS.details.toLocaleString("en-IN")} characters.`;
    return undefined;
  },
};

function field(rule: (value: string) => string | undefined) {
  return z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .superRefine((v, ctx) => {
      const message = rule(v);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    });
}

export const enquirySchema = z.object({
  name: field(rules.name),
  company: field(rules.company),
  email: field(rules.email),
  phone: field(rules.phone),
  type: field(rules.type),
  interest: field(rules.interest),
  details: field(rules.details),
  // Honeypot: hidden from people, so only bots fill it in.
  website: z.string().optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && (ENQUIRY_FIELDS as readonly string[]).includes(key)) {
      out[key as EnquiryField] ??= issue.message;
    }
  }
  return out;
}

export function validateEnquiry(values: EnquiryInput): FieldErrors {
  const result = enquirySchema.safeParse(values);
  return result.success ? {} : fieldErrorsFrom(result.error);
}

// Common mistyped email domains → suggested fix. Non-blocking: shown as "Did you mean …?".
const EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "rediffmail.com",
  "live.com",
  "mail.com",
  "protonmail.com",
  // Real domains listed only so they are not "corrected" to a near neighbour above.
  "aol.com",
  "ymail.com",
  "msn.com",
  "me.com",
  "zoho.com",
  "googlemail.com",
];

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length]!;
}

export function suggestEmail(email: string): string | undefined {
  const at = email.trim().lastIndexOf("@");
  if (at < 1) return undefined;
  const local = email.trim().slice(0, at);
  const domain = email
    .trim()
    .slice(at + 1)
    .toLowerCase();
  if (!domain || EMAIL_DOMAINS.includes(domain)) return undefined;

  let best: string | undefined;
  let bestDistance = 3;
  for (const candidate of EMAIL_DOMAINS) {
    const d = editDistance(domain, candidate);
    if (d < bestDistance) [best, bestDistance] = [candidate, d];
  }
  if (best) return `${local}@${best}`;

  const fixedTld = domain.replace(/\.(con|cmo|ocm|comm|coom|cm|vom|xom)$/, ".com");
  return fixedTld !== domain ? `${local}@${fixedTld}` : undefined;
}

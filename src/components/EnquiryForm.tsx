import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ENQUIRY_FIELDS,
  INTERESTS,
  LIMITS,
  VISITOR_TYPES,
  suggestEmail,
  validateEnquiry,
  type EnquiryField,
  type EnquiryValues,
  type FieldErrors,
} from "@/lib/enquiry";
import { enquiryEmailBody, enquiryEmailUrl } from "@/lib/enquiry-email";
import { saveEnquiry } from "@/lib/enquiries.functions";

const EMPTY: EnquiryValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  type: "",
  interest: "",
  details: "",
};

type Status = "idle" | "submitting" | "success" | "error";
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const ALL_TOUCHED = Object.fromEntries(ENQUIRY_FIELDS.map((f) => [f, true])) as Record<
  EnquiryField,
  boolean
>;

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const controls = useRef<Partial<Record<EnquiryField, Control | null>>>({});
  const successHeading = useRef<HTMLHeadingElement>(null);

  const errors = useMemo<FieldErrors>(
    () => ({ ...serverErrors, ...validateEnquiry(values) }),
    [values, serverErrors],
  );
  const errorCount = ENQUIRY_FIELDS.filter((f) => errors[f]).length;
  const emailSuggestion = touched.email && !errors.email ? suggestEmail(values.email) : undefined;

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  function update(field: EnquiryField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    // Feedback starts with the first keystroke and clears as soon as the value is fixed.
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
    setServerErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
    if (status === "error") setStatus("idle");
  }

  function bind(field: EnquiryField) {
    const error = touched[field] ? errors[field] : undefined;
    return {
      id: `enquiry-${field}`,
      name: field,
      value: values[field],
      ref: (el: Control | null) => {
        controls.current[field] = el;
      },
      onChange: (e: ChangeEvent<Control>) => update(field, e.target.value),
      onBlur: () => setTouched((t) => (t[field] ? t : { ...t, [field]: true })),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": `enquiry-${field}-msg`,
      required: true,
    };
  }

  function stateOf(field: EnquiryField) {
    if (!touched[field]) return "pristine" as const;
    return errors[field] ? ("invalid" as const) : ("valid" as const);
  }

  function focusFirst(errs: FieldErrors) {
    const first = ENQUIRY_FIELDS.find((f) => errs[f]);
    if (first) controls.current[first]?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setTouched(ALL_TOUCHED);
    const clientErrors = validateEnquiry(values);
    if (Object.keys(clientErrors).length > 0) {
      setShowSummary(true);
      focusFirst(clientErrors);
      return;
    }

    setShowSummary(false);
    setStatus("submitting");
    try {
      const result = await saveEnquiry({ data: { ...values, website } });
      if (result.ok) {
        setStatus("success");
      } else if (result.reason === "invalid") {
        setServerErrors(result.fieldErrors);
        setShowSummary(true);
        setStatus("idle");
        focusFirst(result.fieldErrors);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  function reset() {
    setValues(EMPTY);
    setTouched({});
    setServerErrors({});
    setShowSummary(false);
    setStatus("idle");
  }

  if (status === "success") {
    const first = values.name.trim().split(/\s+/)[0] ?? "";
    // "ARJUN KALE" → "Arjun"; names typed in mixed case are left as written.
    const firstName =
      first === first.toUpperCase() ? first.charAt(0) + first.slice(1).toLowerCase() : first;
    return (
      <div className="rounded-xl bg-card p-8 text-card-foreground" role="status">
        <CircleCheck className="h-12 w-12 text-primary" aria-hidden />
        <h3 ref={successHeading} tabIndex={-1} className="mt-5 text-2xl outline-none">
          Thank you, {firstName}.
        </h3>
        <p className="mt-3 text-muted-foreground">
          Your enquiry has reached the EVT partners. A partner will respond personally at{" "}
          <strong className="text-foreground">{values.email.trim()}</strong>.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full border border-input px-5 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={submitting}
      className="relative space-y-4 rounded-xl bg-card p-8 text-card-foreground"
    >
      <div>
        <h3 className="text-2xl">Request a diagnostic conversation</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A partner will respond personally. All fields are required.
        </p>
      </div>

      {showSummary && errorCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Please fix {errorCount === 1 ? "the field" : `the ${errorCount} fields`} highlighted
            below.
          </span>
        </div>
      )}

      <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
        <Field label="Full name" field="name" state={stateOf("name")} error={errors.name}>
          <input
            {...bind("name")}
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="e.g. Priya Sharma"
            className={controlClass(stateOf("name"))}
          />
        </Field>
        <Field
          label="Company / group"
          field="company"
          state={stateOf("company")}
          error={errors.company}
        >
          <input
            {...bind("company")}
            autoComplete="organization"
            maxLength={LIMITS.company}
            placeholder="e.g. Sharma Auto Group"
            className={controlClass(stateOf("company"))}
          />
        </Field>
        <Field
          label="Work email"
          field="email"
          state={stateOf("email")}
          error={errors.email}
          hint={
            emailSuggestion && (
              <>
                Did you mean{" "}
                <button
                  type="button"
                  onClick={() => update("email", emailSuggestion)}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  {emailSuggestion}
                </button>
                ?
              </>
            )
          }
        >
          <input
            {...bind("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            placeholder="name@company.com"
            className={controlClass(stateOf("email"))}
          />
        </Field>
        <Field
          label="Phone"
          field="phone"
          state={stateOf("phone")}
          error={errors.phone}
          hint="With country code, e.g. +91 98765 43210"
        >
          <input
            {...bind("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            placeholder="+91 98765 43210"
            className={controlClass(stateOf("phone"))}
          />
        </Field>
        <Field
          label="You are a…"
          field="type"
          kind="select"
          state={stateOf("type")}
          error={errors.type}
        >
          <select {...bind("type")} className={controlClass(stateOf("type"), "select")}>
            <option value="" disabled>
              Select one
            </option>
            {VISITOR_TYPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field
          label="You need help with"
          field="interest"
          kind="select"
          state={stateOf("interest")}
          error={errors.interest}
        >
          <select {...bind("interest")} className={controlClass(stateOf("interest"), "select")}>
            <option value="" disabled>
              Select one
            </option>
            {INTERESTS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Your plans"
        field="details"
        kind="textarea"
        state={stateOf("details")}
        error={errors.details}
        hint="Vehicle category, target market and timeline"
        aside={
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {values.details.trim().length.toLocaleString("en-IN")} /{" "}
            {LIMITS.details.toLocaleString("en-IN")}
          </span>
        }
      >
        <textarea
          {...bind("details")}
          rows={4}
          maxLength={LIMITS.details}
          placeholder="e.g. We plan to bring electric city buses to India from 2027 and need a localization partner."
          className={controlClass(stateOf("details"), "textarea")}
        />
      </Field>

      {/* Honeypot: invisible to people and skipped by keyboard, so only bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-semibold text-destructive">We couldn't send your enquiry just now.</p>
          <p className="mt-1 text-muted-foreground">
            Please try again in a moment, or email it to the partners directly. Your details are
            filled in for you.
          </p>
          <a
            href={enquiryEmailUrl(enquiryEmailBody(values))}
            className="mt-2 inline-block font-semibold text-primary underline underline-offset-2"
          >
            Email it to Team@evtripower.com
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-display font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
            Sending…
          </>
        ) : status === "error" ? (
          "Try again →"
        ) : (
          "Send to the EVT partners →"
        )}
      </button>
    </form>
  );
}

type FieldState = "pristine" | "valid" | "invalid";
type Kind = "input" | "select" | "textarea";

function controlClass(state: FieldState, kind: Kind = "input") {
  const base =
    // scroll-mt keeps a focused field clear of the sticky header.
    "w-full scroll-mt-28 rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2";
  const pad = kind === "select" ? "pr-14" : "pr-9";
  const tone =
    state === "invalid"
      ? "border-destructive focus:ring-destructive/30"
      : state === "valid"
        ? "border-primary/60 focus:ring-ring"
        : "border-input focus:ring-ring";
  return `${base} ${pad} ${tone}`;
}

function Field({
  label,
  field,
  state,
  error,
  hint,
  aside,
  kind = "input",
  children,
}: {
  label: string;
  field: EnquiryField;
  state: FieldState;
  error: string | undefined;
  hint?: ReactNode;
  aside?: ReactNode;
  kind?: Kind;
  children: ReactNode;
}) {
  const shownError = state === "invalid" ? error : undefined;
  const iconPos = `${kind === "select" ? "right-8" : "right-3"} ${kind === "textarea" ? "top-3" : "top-1/2 -translate-y-1/2"}`;
  return (
    <div>
      <label htmlFor={`enquiry-${field}`} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        {children}
        {state === "invalid" && (
          <CircleAlert
            className={`pointer-events-none absolute h-4 w-4 text-destructive ${iconPos}`}
            aria-hidden
          />
        )}
        {state === "valid" && (
          <CircleCheck
            className={`pointer-events-none absolute h-4 w-4 text-primary ${iconPos}`}
            aria-hidden
          />
        )}
      </div>
      <div className="mt-1 flex min-h-5 items-start justify-between gap-3 text-xs">
        <p
          id={`enquiry-${field}-msg`}
          className={shownError ? "text-destructive" : "text-muted-foreground"}
        >
          {shownError ?? hint}
        </p>
        {aside}
      </div>
    </div>
  );
}

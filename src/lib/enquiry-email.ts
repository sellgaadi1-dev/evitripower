import type { EnquiryField, EnquiryValues } from "./enquiry";

export function enquiryEmailUrl(body: string) {
  return `mailto:Team@evtripower.com?cc=${encodeURIComponent("maheshbhanchandrakale@gmail.com")}&subject=${encodeURIComponent("Diagnostic conversation request")}&body=${encodeURIComponent(body)}`;
}

const LABELS: Record<EnquiryField, string> = {
  name: "Name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  type: "Type",
  interest: "Interest",
  details: "Details",
};

export function enquiryEmailBody(values: EnquiryValues) {
  return (Object.keys(LABELS) as EnquiryField[])
    .map((key) => `${LABELS[key]}: ${values[key].trim()}`)
    .join("\n");
}

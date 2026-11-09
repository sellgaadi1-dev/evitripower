export function enquiryEmailUrl(body: string) {
  return `mailto:Team@evtripower.com?cc=${encodeURIComponent("maheshbhanchandrakale@gmail.com")}&subject=${encodeURIComponent("Diagnostic conversation request")}&body=${encodeURIComponent(body)}`;
}
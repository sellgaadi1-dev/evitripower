import { describe, expect, it } from "vitest";
import { enquiryEmailUrl } from "@/lib/enquiry-email";

describe("Enquiry email recipients", () => {
  it("addresses the enquiry to Team@evtripower.com", () => {
    const url = new URL(enquiryEmailUrl("Name: Example"));
    expect(url.pathname).toBe("Team@evtripower.com");
  });
  it("copies Mahesh on the enquiry", () => {
    const url = new URL(enquiryEmailUrl("Name: Example"));
    expect(url.searchParams.get("cc")).toBe("maheshbhanchandrakale@gmail.com");
  });
});
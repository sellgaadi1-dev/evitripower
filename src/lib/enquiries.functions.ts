import { createServerFn } from "@tanstack/react-start";

import { enquirySchema } from "./enquiry";

export const saveEnquiry = createServerFn({ method: "POST" })
  .validator(enquirySchema)
  .handler(async ({ data }) => {
    const { storeEnquiry } = await import("./enquiries.server");
    try {
      return await storeEnquiry(data);
    } catch (error) {
      console.error("Failed to store enquiry", error);
      return { stored: false };
    }
  });

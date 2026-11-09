import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const saveEnquiry = vi.fn();
vi.mock("@/lib/enquiries.functions", () => ({
  saveEnquiry: (...args: unknown[]) => saveEnquiry(...args),
}));

import { EnquiryForm } from "@/components/EnquiryForm";

function type(label: string | RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

// Custom dropdown: open the trigger, then pick the option from the list.
function choose(label: string, option: string) {
  fireEvent.click(screen.getByLabelText(label));
  fireEvent.click(screen.getByRole("option", { name: option }));
}

function fillValid() {
  type("Full name", "Arjun Kale");
  type("Company / group", "Example Motors");
  type("Work email", "arjun@example.com");
  type("Phone", "8530508016");
  choose("You are a…", "Tier-1 supplier");
  choose("You need help with", "Homologation");
  type("Your plans", "Electric buses for India from 2027.");
}

async function submit() {
  // Let a just-closed dropdown hand focus back to its trigger first (Radix does this on a
  // timer), as it always has by the time a person clicks Send.
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /send to the evt partners|try again/i }));
  });
}

describe("Enquiry form", () => {
  beforeEach(() => saveEnquiry.mockReset());

  it("shows no errors before the visitor interacts", () => {
    render(<EnquiryForm />);
    expect(screen.queryByText(/please enter/i)).toBeNull();
  });

  it("uses custom dropdowns that show the choice and clear the error once picked", () => {
    render(<EnquiryForm />);
    const trigger = screen.getByLabelText("You are a…");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("role", "combobox");
    expect(trigger).toHaveTextContent("Select one");

    // Opening and closing without choosing counts as visited → explains what is missing.
    fireEvent.click(trigger);
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Indian business / automotive group",
      "Global EV maker",
      "Tier-1 supplier",
      "Dealer group",
      "Other",
    ]);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
    expect(screen.getByText("Please select what best describes you.")).toBeVisible();

    choose("You are a…", "Dealer group");
    expect(trigger).toHaveTextContent("Dealer group");
    expect(screen.queryByText("Please select what best describes you.")).toBeNull();
  });

  it("tells the visitor what is wrong while typing, and clears it once fixed", () => {
    render(<EnquiryForm />);
    const email = screen.getByLabelText("Work email");

    type("Work email", "arjun");
    expect(screen.getByText("Email is missing an “@”, as in name@company.com.")).toBeVisible();
    expect(email).toHaveAttribute("aria-invalid", "true");

    type("Work email", "arjun@example.com");
    expect(screen.queryByText(/missing an “@”/)).toBeNull();
    expect(email).not.toHaveAttribute("aria-invalid");
  });

  it("counts up towards the minimum for the plans field", () => {
    render(<EnquiryForm />);
    type("Your plans", "gjfgjhfj");
    expect(
      screen.getByText("Add a little more detail: at least 20 characters (8/20)."),
    ).toBeVisible();
  });

  it("offers a correction for a mistyped email domain", () => {
    render(<EnquiryForm />);
    type("Work email", "arjun@gmial.com");
    fireEvent.click(screen.getByRole("button", { name: "arjun@gmail.com" }));
    expect(screen.getByLabelText("Work email")).toHaveValue("arjun@gmail.com");
  });

  it("on an empty submit, flags every field, focuses the first and does not send", async () => {
    render(<EnquiryForm />);
    await submit();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fix the 7 fields highlighted below.",
    );
    expect(screen.getByLabelText("Full name")).toHaveFocus();
    expect(saveEnquiry).not.toHaveBeenCalled();
  });

  it("sends a valid enquiry and thanks the visitor", async () => {
    saveEnquiry.mockResolvedValue({ ok: true });
    render(<EnquiryForm />);
    fillValid();
    await submit();

    expect(saveEnquiry).toHaveBeenCalledWith({
      data: {
        name: "Arjun Kale",
        company: "Example Motors",
        email: "arjun@example.com",
        phone: "8530508016",
        type: "Tier-1 supplier",
        interest: "Homologation",
        details: "Electric buses for India from 2027.",
        website: "",
      },
    });
    expect(screen.getByRole("heading", { name: "Thank you, Arjun." })).toBeVisible();
    expect(screen.getByText("arjun@example.com")).toBeVisible();
  });

  it("if saving fails, keeps the details and offers to email them instead", async () => {
    saveEnquiry.mockResolvedValue({ ok: false, reason: "unavailable" });
    render(<EnquiryForm />);
    fillValid();
    await submit();

    expect(screen.getByText("We couldn't send your enquiry just now.")).toBeVisible();
    const link = screen.getByRole("link", { name: /email it to team@evtripower.com/i });
    expect(link.getAttribute("href")).toMatch(/^mailto:Team@evtripower\.com\?/);
    expect(decodeURIComponent(link.getAttribute("href")!)).toContain("Name: Arjun Kale");
    expect(screen.getByLabelText("Full name")).toHaveValue("Arjun Kale");
    expect(screen.getByRole("button", { name: /try again/i })).toBeEnabled();
  });

  it("shows field errors returned by the server", async () => {
    saveEnquiry.mockResolvedValue({
      ok: false,
      reason: "invalid",
      fieldErrors: { company: "Enter a valid company name." },
    });
    render(<EnquiryForm />);
    fillValid();
    await submit();
    expect(screen.getByText("Enter a valid company name.")).toBeVisible();
    expect(screen.getByLabelText("Company / group")).toHaveFocus();
  });
});

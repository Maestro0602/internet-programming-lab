import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import BookingForm from "../src/components/BookingForm.vue";

describe("BookingForm", () => {
  it("shows no errors before the first submit", () => {
    const w = mount(BookingForm, { props: { seatsLeft: 10 } });
    expect(w.findAll(".error")).toHaveLength(0);
  });

  it("shows errors and does not emit when the form is invalid", async () => {
    const w = mount(BookingForm, { props: { seatsLeft: 10 } });
    await w.find("form").trigger("submit");
    expect(w.findAll(".error").map(e => e.text())).toEqual([
      "Enter your name (at least 2 characters).",
      "Enter a valid email address.",
    ]);
    expect(w.emitted("submit")).toBeUndefined();
  });

  it("emits the trimmed values, with seats as a number", async () => {
    const w = mount(BookingForm, { props: { seatsLeft: 10 } });
    await w.find("input[name=name]").setValue("  Dara ");
    await w.find("input[name=email]").setValue("dara@example.com");
    await w.find("input[name=seats]").setValue("3");
    await w.find("form").trigger("submit");
    expect(w.emitted("submit")).toEqual([[{ name: "Dara", email: "dara@example.com", seats: 3 }]]);
  });

  it("disables the button while pending", () => {
    const w = mount(BookingForm, { props: { seatsLeft: 10, pending: true } });
    expect(w.find("button").attributes("disabled")).toBeDefined();
    expect(w.find("button").text()).toBe("Booking...");
  });
});

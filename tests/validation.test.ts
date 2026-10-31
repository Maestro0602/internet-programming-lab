import { describe, expect, it } from "vitest";
import { hasErrors, validateBooking, validateEvent } from "../src/validation";
import type { EventInput } from "../src/types";

describe("validateBooking", () => {
  const ok = { name: "Dara", email: "dara@example.com", seats: 2 };

  it("accepts a valid booking", () => {
    expect(validateBooking(ok, 10)).toEqual({});
  });
  it("requires a name of at least 2 characters", () => {
    expect(validateBooking({ ...ok, name: " a " }, 10).name).toBeDefined();
  });
  it("requires a valid email", () => {
    expect(validateBooking({ ...ok, email: "dara@" }, 10).email).toBeDefined();
    expect(validateBooking({ ...ok, email: "dara example.com" }, 10).email).toBeDefined();
  });
  it("requires between 1 and 4 seats", () => {
    expect(validateBooking({ ...ok, seats: 0 }, 10).seats).toBe("Book at least 1 seat.");
    expect(validateBooking({ ...ok, seats: 5 }, 10).seats).toBe("You can book at most 4 seats.");
    expect(validateBooking({ ...ok, seats: 1.5 }, 10).seats).toBeDefined();
  });
  it("cannot book more seats than are left", () => {
    expect(validateBooking({ ...ok, seats: 2 }, 1).seats).toBe("You can book at most 1 seat.");
  });
});

describe("validateEvent", () => {
  const now = new Date("2026-10-01T00:00:00Z");
  const ok: EventInput = {
    title: "Pitch Night", category: "social", startsAt: "2026-11-20T18:00:00.000Z",
    location: "Hall", capacity: 50, description: "",
  };

  it("accepts a valid event", () => {
    expect(validateEvent(ok, now)).toEqual({});
  });
  it("rejects a short title, empty location and bad capacity", () => {
    const errors = validateEvent({ ...ok, title: "Hi", location: " ", capacity: 0 }, now);
    expect(Object.keys(errors).sort()).toEqual(["capacity", "location", "title"]);
  });
  it("requires a date in the future", () => {
    expect(validateEvent({ ...ok, startsAt: "" }, now).startsAt).toBe("Choose a date and time.");
    expect(validateEvent({ ...ok, startsAt: "2026-09-01T10:00:00Z" }, now).startsAt).toBe("The event must be in the future.");
  });
  it("hasErrors tells whether an errors object is empty", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ title: "x" })).toBe(true);
  });
});

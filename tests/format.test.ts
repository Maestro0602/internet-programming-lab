import { describe, expect, it } from "vitest";
import { formatDate, seatsLeft } from "../src/format";
import { sampleEvents } from "./helpers";

describe("format", () => {
  it("seatsLeft is capacity minus booked, never negative", () => {
    expect(seatsLeft(sampleEvents[0]!)).toBe(33);
    expect(seatsLeft({ ...sampleEvents[0]!, booked: 500 })).toBe(0);
  });
  it("formatDate shows day, date and time in UTC", () => {
    expect(formatDate("2026-11-02T09:00:00Z")).toBe("Mon 2 Nov, 09:00");
  });
});

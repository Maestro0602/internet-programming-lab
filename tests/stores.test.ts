import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEventsStore } from "../src/stores/events";
import { useBookingsStore } from "../src/stores/bookings";
import { mockFetch, sampleEvents } from "./helpers";

beforeEach(() => setActivePinia(createPinia()));

describe("events store", () => {
  it("fetchAll goes loading -> success and stores the events", async () => {
    mockFetch({ "GET /events": sampleEvents });
    const store = useEventsStore();
    expect(store.status).toBe("idle");
    const p = store.fetchAll();
    expect(store.status).toBe("loading");
    await p;
    expect(store.status).toBe("success");
    expect(store.events).toHaveLength(6);
    expect(store.byId(2)?.title).toBe("Git Workshop");
  });

  it("fetchAll goes to error with a message when the API fails", async () => {
    mockFetch({ "GET /events": 500 });
    const store = useEventsStore();
    await store.fetchAll();
    expect(store.status).toBe("error");
    expect(store.error).toContain("500");
    expect(store.events).toEqual([]);
  });

  it("fetchOne uses the cache before calling the API", async () => {
    const calls = mockFetch({ "GET /events": sampleEvents, "GET /events/5": sampleEvents[4] });
    const store = useEventsStore();
    expect((await store.fetchOne(5)).title).toBe("Vue in Practice");
    expect(calls).toHaveLength(1);
    await store.fetchOne(5);
    expect(calls).toHaveLength(1);
  });

  it("create sends POST with booked = 0 and adds the new event", async () => {
    const calls = mockFetch({ "POST /events": (b: object) => ({ id: 7, ...b }) });
    const store = useEventsStore();
    const { id, booked, ...input } = sampleEvents[0]!;
    const created = await store.create(input);
    expect(calls[0]).toMatchObject({ method: "POST", path: "/events", body: { booked: 0, title: "Intro to Hackathons" } });
    expect(created.id).toBe(7);
    expect(store.events).toHaveLength(1);
  });
});

describe("bookings store", () => {
  const event = sampleEvents[1]!; // Git Workshop: 30 seats, 27 booked

  it("book creates the booking, updates the seat count and the events store", async () => {
    const calls = mockFetch({
      "POST /bookings": (b: object) => ({ id: 1, ...b }),
      "PATCH /events/2": (b: { booked: number }) => ({ ...event, booked: b.booked }),
    });
    const events = useEventsStore();
    events.replace(event);
    const store = useBookingsStore();

    await store.book(event, { name: "Dara", email: "dara@example.com", seats: 2 });

    expect(calls.map(c => `${c.method} ${c.path}`)).toEqual(["POST /bookings", "PATCH /events/2"]);
    expect(calls[0]!.body).toMatchObject({ eventId: 2, seats: 2, name: "Dara" });
    expect(calls[1]!.body).toEqual({ booked: 29 });
    expect(events.byId(2)?.booked).toBe(29);
    expect(store.totalSeats).toBe(2);
  });

  it("book refuses more seats than are left, without calling the API", async () => {
    const calls = mockFetch({});
    const store = useBookingsStore();
    await expect(store.book(event, { name: "Dara", email: "d@x.io", seats: 4 })).rejects.toThrow("Not enough seats");
    expect(calls).toHaveLength(0);
  });

  it("cancel deletes the booking and gives the seats back", async () => {
    const calls = mockFetch({
      "GET /bookings": [{ id: 9, eventId: 2, name: "Dara", email: "d@x.io", seats: 3, createdAt: "" }],
      "DELETE /bookings/9": {},
      "PATCH /events/2": (b: { booked: number }) => ({ ...event, booked: b.booked }),
    });
    useEventsStore().replace(event);
    const store = useBookingsStore();
    await store.fetchAll();
    await store.cancel(store.bookings[0]!);
    expect(calls.at(-1)!.body).toEqual({ booked: 24 });
    expect(store.bookings).toEqual([]);
  });
});

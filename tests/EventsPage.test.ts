import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createMemoryHistory } from "vue-router";
import { makeRouter } from "../src/router";
import App from "../src/App.vue";
import { mockFetch, sampleEvents } from "./helpers";

async function mountApp(path = "/") {
  const router = makeRouter(createMemoryHistory());
  router.push(path);
  await router.isReady();
  const w = mount(App, { global: { plugins: [createPinia(), router] } });
  return { w, router };
}

describe("EventsPage (through the whole app)", () => {
  it("shows loading, then the events with links to their detail page", async () => {
    mockFetch({ "GET /events": sampleEvents });
    const { w } = await mountApp();
    expect(w.text()).toContain("Loading...");
    await flushPromises();
    expect(w.findAll("article")).toHaveLength(6);
    expect(w.find("article a").attributes("href")).toBe("/events/1");
  });

  it("filters the list with the search box", async () => {
    mockFetch({ "GET /events": sampleEvents });
    const { w } = await mountApp();
    await flushPromises();
    await w.find("input[type=search]").setValue("lab");
    expect(w.findAll("article")).toHaveLength(2);
  });

  it("shows an error with a retry button that loads again", async () => {
    const routes: Record<string, unknown> = { "GET /events": 503 };
    mockFetch(routes);
    const { w } = await mountApp();
    await flushPromises();
    expect(w.find("[role=alert]").text()).toContain("503");
    routes["GET /events"] = sampleEvents;
    await w.find("[role=alert] button").trigger("click");
    await flushPromises();
    expect(w.findAll("article")).toHaveLength(6);
  });

  it("books a seat from the detail page and lands on My bookings", async () => {
    const saved: object[] = []; // a tiny fake database for bookings
    mockFetch({
      "GET /events": sampleEvents,
      "GET /events/2": sampleEvents[1],
      "GET /bookings": () => saved,
      "POST /bookings": (b: object) => { saved.push({ id: 1, ...b }); return saved[0]; },
      "PATCH /events/2": (b: { booked: number }) => ({ ...sampleEvents[1]!, booked: b.booked }),
    });
    const { w, router } = await mountApp("/events/2");
    await flushPromises();
    expect(w.text()).toContain("3 seats left.");
    await w.find("input[name=name]").setValue("Dara");
    await w.find("input[name=email]").setValue("dara@example.com");
    await w.find("form").trigger("submit");
    // the My bookings page is lazy-loaded, so wait for the navigation to finish
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe("my-bookings"));
    await flushPromises();
    expect(w.text()).toContain("My bookings (1)");
    expect(w.text()).toContain("Git Workshop");
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { createMemoryHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { makeRouter } from "../src/router";
import { useSessionStore } from "../src/stores/session";

beforeEach(() => setActivePinia(createPinia()));

describe("router", () => {
  it("matches the detail route and passes the id", async () => {
    const router = makeRouter(createMemoryHistory());
    await router.push("/events/3");
    expect(router.currentRoute.value.name).toBe("event-detail");
    expect(router.currentRoute.value.params.id).toBe("3");
  });

  it("sends unknown paths to the not-found page", async () => {
    const router = makeRouter(createMemoryHistory());
    await router.push("/nope/at/all");
    expect(router.currentRoute.value.name).toBe("not-found");
    await router.push("/events/abc");
    expect(router.currentRoute.value.name).toBe("not-found");
  });

  it("only organisers can open /events/new", async () => {
    const router = makeRouter(createMemoryHistory());
    await router.push("/events/new");
    expect(router.currentRoute.value.name).toBe("events");
    expect(router.currentRoute.value.query.denied).toBe("1");

    useSessionStore().setRole("organiser");
    await router.push("/events/new");
    expect(router.currentRoute.value.name).toBe("event-new");
  });
});

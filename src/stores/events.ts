import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { eventsApi } from "../api/events";
import type { CampusEvent, EventInput } from "../types";

export type Status = "idle" | "loading" | "error" | "success";

export const useEventsStore = defineStore("events", () => {
  // state
  const events = ref<CampusEvent[]>([]);
  const status = ref<Status>("idle");
  const error = ref<string | null>(null);

  // getters
  // TODO B1: byId should return a function (id: number) => the event with that id, or undefined
  const byId = computed(() => (id: number): CampusEvent | undefined => events.value.find(e => e.id === id));

  // actions
  // TODO B2: load all events with eventsApi.list().
  //   before the request: status "loading", error null
  //   on success:         store the events, status "success"
  //   on failure:         error = the error's message, status "error"
  async function fetchAll() {
    status.value = "loading";
    error.value = null;
    try {
      events.value = await eventsApi.list();
      status.value = "success";
    } catch (e) {
      status.value = "error";
      error.value = e instanceof Error ? e.message : "Failed to load events";
    }
  }

  // Use the cached event if we have it, otherwise ask the API
  async function fetchOne(id: number): Promise<CampusEvent> {
    const cached = byId.value(id);
    if (cached) return cached;
    const e = await eventsApi.get(id);
    events.value.push(e);
    return e;
  }

  async function create(input: EventInput): Promise<CampusEvent> {
    const created = await eventsApi.create(input);
    events.value.push(created);
    return created;
  }

  // Called by the bookings store after a booking changes the seat count
  function replace(updated: CampusEvent) {
    const i = events.value.findIndex(e => e.id === updated.id);
    if (i === -1) events.value.push(updated);
    else events.value[i] = updated;
  }

  return { events, status, error, byId, fetchAll, fetchOne, create, replace };
});

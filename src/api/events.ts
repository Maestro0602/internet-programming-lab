import { request } from "./http";
import type { CampusEvent, EventInput } from "../types";

export const eventsApi = {
  list: () => request<CampusEvent[]>("/events?_sort=startsAt"),
  get: (id: number) => request<CampusEvent>(`/events/${id}`),
  create: (input: EventInput) =>
    request<CampusEvent>("/events", { method: "POST", body: JSON.stringify({ ...input, booked: 0 }) }),
  setBooked: (id: number, booked: number) =>
    request<CampusEvent>(`/events/${id}`, { method: "PATCH", body: JSON.stringify({ booked }) }),
};

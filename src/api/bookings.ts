import { request } from "./http";
import type { Booking } from "../types";

export const bookingsApi = {
  list: () => request<Booking[]>("/bookings?_sort=createdAt&_order=desc"),
  create: (b: Omit<Booking, "id">) =>
    request<Booking>("/bookings", { method: "POST", body: JSON.stringify(b) }),
  remove: (id: number) => request<void>(`/bookings/${id}`, { method: "DELETE" }),
};

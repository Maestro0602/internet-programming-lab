export type Category = "talk" | "workshop" | "social" | "sport";

export interface CampusEvent {
  id: number;
  title: string;
  category: Category;
  startsAt: string; // ISO date, e.g. "2026-11-02T09:00:00Z"
  location: string;
  capacity: number;
  booked: number;   // seats already taken
  description: string;
}

// What the "new event" form sends: the server gives the id, nobody has booked yet
export type EventInput = Omit<CampusEvent, "id" | "booked">;

export interface Booking {
  id: number;
  eventId: number;
  name: string;
  email: string;
  seats: number;
  createdAt: string;
}

export type BookingInput = Pick<Booking, "name" | "email" | "seats">;

// Field name -> error message, only for fields that have an error
export type FormErrors<T> = Partial<Record<keyof T, string>>;

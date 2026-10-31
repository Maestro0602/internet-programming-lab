import type { BookingInput, EventInput, FormErrors } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_SEATS_PER_BOOKING = 4;

// TODO C1: return an error message for each invalid field (see validateEvent below for the pattern).
//   name:  at least 2 characters after trim          -> "Enter your name (at least 2 characters)."
//   email: must match EMAIL after trim                -> "Enter a valid email address."
//   seats: a whole number of at least 1               -> "Book at least 1 seat."
//          at most min(MAX_SEATS_PER_BOOKING, seatsLeft) -> "You can book at most 4 seats." ("1 seat" when the max is 1)
export function validateBooking(form: BookingInput, seatsLeft: number): FormErrors<BookingInput> {
  const errors: FormErrors<BookingInput> = {};
  if (form.name.trim().length < 2) {
    errors.name = "Enter your name (at least 2 characters).";
  }
  if (!EMAIL.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  const maxSeats = Math.min(MAX_SEATS_PER_BOOKING, seatsLeft);
  if (!Number.isInteger(form.seats) || form.seats < 1) {
    errors.seats = "Book at least 1 seat.";
  } else if (form.seats > maxSeats) {
    errors.seats = `You can book at most ${maxSeats} seat${maxSeats === 1 ? "" : "s"}.`;
  }
  return errors;
}

export function validateEvent(form: EventInput, now = new Date()): FormErrors<EventInput> {
  const errors: FormErrors<EventInput> = {};
  if (form.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";
  if (form.location.trim() === "") errors.location = "Location is required.";
  const starts = new Date(form.startsAt);
  if (form.startsAt === "" || Number.isNaN(starts.getTime())) errors.startsAt = "Choose a date and time.";
  else if (starts <= now) errors.startsAt = "The event must be in the future.";
  if (!Number.isInteger(form.capacity) || form.capacity < 1) errors.capacity = "Capacity must be a whole number of at least 1.";
  else if (form.capacity > 1000) errors.capacity = "Capacity cannot exceed 1000.";
  if (form.description.length > 500) errors.description = "Keep the description under 500 characters.";
  return errors;
}

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;

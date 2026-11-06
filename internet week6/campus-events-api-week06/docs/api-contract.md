# Campus Events API contract (week 6)

Base URL: `http://localhost:3000`. All bodies are JSON. Errors use Nest's format:
`{ "statusCode": 400, "message": ["..."], "error": "Bad Request" }`.

## Resources

**Event**: `id` (int), `title` (3–100 chars), `category` (`talk` | `workshop` | `social` | `sport`),
`startsAt` (ISO 8601), `location` (1–100 chars), `capacity` (int 1–1000), `booked` (int, set by the server),
`description` (≤ 500 chars, optional).

**Booking**: `id` (int), `eventId` (int), `name` (2–100 chars), `email`, `seats` (int 1–4), `createdAt` (ISO 8601).

## Endpoints

| Method | Path | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/events?category=&search=` | | 200 Event[] sorted by `startsAt` | 400 bad category |
| GET | `/events/:id` | | 200 Event | 400 id not a number, 404 |
| POST | `/events` | title, category, startsAt, location, capacity, description? | 201 Event | 400 invalid or unknown field |
| PATCH | `/events/:id` | any Event field except id, booked | 200 Event | 400, 404 |
| DELETE | `/events/:id` | | 204 | 404 |
| GET | `/bookings` | | 200 Booking[] newest first | |
| POST | `/events/:id/bookings` | name, email, seats | 201 Booking, event's `booked` increases | 400, 404, 409 not enough seats |
| DELETE | `/bookings/:id` | | 204, seats given back | 404 |

Not in this version (added later): authentication (week 8), pagination (week 11).

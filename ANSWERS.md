# Week 4 Practice Lab — Answers & Results

## Part A–B — Test Results

| Request | Status code | Notes |
| :--- | :--- | :--- |
| `GET /v1/restaurants?limit=2` | `200 OK` | Returns 2 restaurants with pagination metadata (`limit: 2, offset: 0, total: 3`) |
| `POST /v1/orders` (valid) | `201 Created` | Creates new order with UUID and status `PLACED` |
| `POST /v1/orders` (`restaurantId "a"`, `items []`) | `400 Bad Request` | `ValidationPipe` rejects non-integer `restaurantId` and empty `items` array |
| `POST /v1/orders`, restaurant `99` | `404 Not Found` | Throws `NotFoundException` (`"restaurant not found"`) |
| `GET /v1/orders/{id}` (exists / missing) | `200 OK` / `404 Not Found` | Returns order object when found; `404 NotFoundException` when missing |
| `PATCH PLACED → COOKING` | `200 OK` | Valid status transition; updates order status to `COOKING` |
| `PATCH PLACED → DELIVERED` | `409 Conflict` | Invalid transition from `PLACED` directly to `DELIVERED`; throws `ConflictException` |
| `POST` with `Idempotency-Key: abc-123` (1st / 2nd) | `201 Created` / `200 OK` | 1st creates order (`201`); 2nd returns the exact same cached order (`200`) without duplicating |

**Why does a mobile app on a bad network need an idempotency key?**
If a response is lost due to a flaky connection and the app retries the request, the idempotency key ensures the server returns the original order instead of charging and creating a duplicate order.

---

## API Specification

| Method | Path | Request body | Success | Error codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/v1/restaurants` | None (query: `limit`, `offset`) | `200 OK` | `-` |
| `POST` | `/v1/orders` | `{ restaurantId: number, items: string[] }` | `201 Created` / `200 OK` | `400 Bad Request`, `404 Not Found` |
| `GET` | `/v1/orders/:id` | None | `200 OK` | `404 Not Found` |
| `PATCH` | `/v1/orders/:id` | `{ status: string }` | `200 OK` | `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `POST` | `/v1/login` | None (query: `username`) | `201 Created` | `-` |
| `GET` | `/v1/me` | None (Cookie: `sid`) | `200 OK` | `401 Unauthorized` |

---

## Part C — CORS

| Question | Answer |
| :--- | :--- |
| **CORS error message in the console** | `Access to fetch at 'http://localhost:3000/v1/restaurants' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.` |
| **Why `curl` works but the browser refuses** | Same-Origin Policy and CORS are enforced only by web browsers to protect users who have ambient credentials (cookies) stored; command-line clients like `curl` do not enforce browser security policies. |
| **Why `origin: '*'` with credentials is a bad idea** | Allowing any origin (`*`) with credentials would let any malicious website make authenticated requests using the user's cookies and read private responses (which is why browsers forbid combining `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`). |

---

## Part D — Cookies

| Question | Answer |
| :--- | :--- |
| **Flags on the `sid` cookie** | `HttpOnly: true`, `SameSite: Lax` |
| **Why `document.cookie` does not show `sid`** | The `sid` cookie has the `HttpOnly` flag set, which instructs the browser to hide it from client-side JavaScript (`document.cookie`) to prevent XSS from stealing the session ID. |
| **What happens after an API restart, and why** | `Who am I?` returns `401 Unauthorized` (`"not logged in"`) because sessions are stored in an in-memory `Map` (`SESSIONS`) that is wiped when the Node process restarts. |
| **What would happen with 3 API servers behind a load balancer** | Because each server has its own isolated in-memory `Map`, requests routed by the load balancer to the other 2 servers will not recognize the session ID and will fail with `401` (solved by a shared store like Redis or stateless JWTs). |

---

## Stretch — JSON vs MessagePack Size

- **JSON (`JSON.stringify(order).length`)**: `97 bytes`
- **MessagePack (`encode(order).length`)**: `82 bytes`

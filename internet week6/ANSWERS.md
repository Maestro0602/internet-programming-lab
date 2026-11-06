# Week 6 Questions & Answers

### 1. DELETE /events/2 returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.
Yes, `DELETE` is still idempotent. Idempotence means that making multiple identical requests has the same intended effect on the server state as making a single request. After the first call deletes the resource, subsequent calls find it already deleted and do not change the server state any further, even if the HTTP response status code changes from `204 No Content` to `404 Not Found`.

### 2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can curl read it anyway?
The web browser blocks the response, enforcing the Same-Origin Policy to protect users from malicious cross-origin scripts reading sensitive data. Tools like `curl` are command-line HTTP clients, not web browsers; they do not execute user scripts in an origin sandbox and therefore do not enforce browser-based CORS restrictions.

### 3. EventsController never writes new EventsService(). Who creates the service, when, and how many are created?
The NestJS Dependency Injection (Inversion of Control) container creates the service during application bootstrap when the module is initialized. By default in NestJS, providers are singletons within their module context, meaning exactly one shared instance of `EventsService` is created and injected wherever needed (e.g., into `EventsController` and `BookingsService`).

### 4. A client sends `{ "title": "Pitch Night", ..., "booked": 50 }`. Which line of code refuses it, and what would happen to booked without it?
It is refused by `forbidNonWhitelisted: true` in `src/setup.ts` inside the `ValidationPipe` configuration, because `booked` is not decorated in `CreateEventDto`. Without this option (but with `whitelist: true`), NestJS would silently strip `booked` from the incoming payload without raising an error; without `whitelist: true` as well, `booked` would pass into the controller and potentially overwrite server-managed state.

### 5. Why is the “not enough seats” rule in BookingsService and not in BookingsController or only in the Vue form?
The "not enough seats" rule is core business logic, and services are the designated home for domain rules and data mutations in clean architecture. Controllers only handle HTTP concerns (status codes, headers, and parameter parsing), while the Vue frontend can be bypassed entirely by direct API requests (such as via `curl` or Postman), so the server must guarantee data integrity and prevent overselling.

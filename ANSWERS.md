# Week 5 Practice: Questions & Answers

### 1. You refresh the browser on `/events/2` and the page loads. Which program answered that request in development, and what must the production server do so it still works after deployment?
In development, the Vite development server answers the request and serves `index.html` for any unmatched route, allowing client-side Vue Router to mount and read the path. In production, a static web server (such as Nginx, Caddy, or a cloud host) must be configured with a fallback rewrite rule (e.g. `try_files $uri $uri/ /index.html`) so any deep link or refresh returns `index.html` instead of a 404 HTTP error.

---

### 2. The guard stops students from opening `/events/new`. Can a student still create an event? How, and what must stop them?
Yes, a student can still create an event by sending an HTTP POST request directly to the API endpoint (`/events`) using tools like `curl`, Postman, or `fetch()` in the browser developer console. Client-side router guards only prevent UI navigation within the single-page application. True security must be enforced by the backend API server, which must authenticate the user and verify their role before accepting creation requests.

---

### 3. EventDetailPage loads its event in a `watch` on the id with `immediate: true`, not in `onMounted`. What bug would `onMounted` alone cause?
Vue Router reuses the same component instance when navigating between routes that share the same component (e.g. going from `/events/1` to `/events/2`), meaning the component is not unmounted and remounted. If only `onMounted` were used, the load logic would execute only once on first entry and fail to re-fetch data when the `:id` parameter changes. Using `watch(eventId, load, { immediate: true })` ensures the event is fetched both on initial load and whenever the `:id` parameter updates.

---

### 4. Why does EventsPage use `storeToRefs(store)` instead of `const { events } = store`?
A Pinia store is a reactive object; destructuring it directly with standard JavaScript (`const { events } = store`) strips away reactivity, leaving a static snapshot that will not update when new events are fetched. `storeToRefs()` converts each state property and getter into an individual Vue `ref`, preserving full reactivity when destructuring.

---

### 5. Booking makes two requests: POST the booking, then PATCH the seat count. What happens to the data if the second one fails? How could the server avoid this?
If POST succeeds but PATCH fails, the system enters an inconsistent state: a booking record exists in the database, but the event's booked count was never incremented, potentially causing overbooking. The server can avoid this by handling bookings as a single atomic transaction on a dedicated endpoint (e.g. `POST /api/events/:id/bookings`), updating both the booking record and seat counts together and rolling back if any step fails.


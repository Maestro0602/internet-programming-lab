# Week 5 practice: building an SPA

Campus Events grows into a real single-page app: several pages (Vue Router),
shared state (Pinia), forms with validation, and data from an API.
The API is a mock (json-server, reading `db.json`); in week 6 you replace it with NestJS.

Requires Node 24 LTS (npm 11).

```bash
npm install
npm run api     # terminal 1: mock API on http://localhost:3000
npm run dev     # terminal 2: the app on http://localhost:5173
npm test        # tests (they mock fetch, so the API does not need to run)
npm run check   # type-check
```

Already done for you: the API layer (`src/api/`), the pages (`src/pages/`),
`EventForm.vue` (a finished form to copy from), the session store (role switch).

Work through the TODOs:

- **A** `src/router/index.ts`: routes, params, lazy loading, a guard
- **B** `src/stores/events.ts`: a store with loading / error / success states
- **C** `src/validation.ts` then `src/components/BookingForm.vue`: validation and a form
- **D** `src/stores/bookings.ts`: an action that calls the API and updates another store
- **E** `src/composables/useEventFilters.ts`: move week 4's filtering into a composable

You are done when `npm test` passes (29 tests), `npm run check` shows no errors,
and you can book a seat and create an event in the browser.

`db.json` changes when you book (json-server saves to it). `git checkout db.json` resets it.

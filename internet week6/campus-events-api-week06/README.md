# Week 6 practice: a REST API with NestJS

The Campus Events API. Data is kept in memory this week (it resets when the server restarts);
week 7 moves it to PostgreSQL.

Requires Node 24 LTS (npm 11).

```bash
npm install
npm run start:dev    # http://localhost:3000, restarts when you save
npm test             # unit tests (services): 8 tests
npm run test:e2e     # HTTP tests (status codes, validation): 13 tests
```

Read `docs/api-contract.md` first: it is the specification the tests check.

- **A** `src/events/dto/create-event.dto.ts`: validation rules
- **B** `src/events/events.service.ts` and `events.controller.ts`: create, update, delete
- **C** `src/bookings/`: booking rules, including 409 when there are not enough seats

`requests.http` has ready-made requests for the VS Code REST Client extension.
You are done when both test commands pass and `npm run build` shows no errors.

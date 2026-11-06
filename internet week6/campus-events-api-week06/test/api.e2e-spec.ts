import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/setup.js';

// These tests send real HTTP requests to the app, like curl or the Vue app would.
describe('Campus Events API (e2e)', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    http = request(app.getHttpServer());
  });
  afterEach(() => app.close());

  const newEvent = {
    title: 'Pitch Night',
    category: 'social',
    startsAt: '2026-12-01T18:00:00.000Z',
    location: 'Hall',
    capacity: 50,
  };

  describe('events', () => {
    it('GET /events returns all events as JSON, with filters', async () => {
      const res = await http.get('/events').expect(200).expect('Content-Type', /json/);
      expect(res.body).toHaveLength(6);
      const talks = await http.get('/events?category=talk').expect(200);
      expect(talks.body).toHaveLength(2);
    });

    it('GET /events?category=party is a 400: not a valid category', () =>
      http.get('/events?category=party').expect(400));

    it('GET /events/2 returns one event; unknown ids are 404; bad ids are 400', async () => {
      const res = await http.get('/events/2').expect(200);
      expect(res.body.title).toBe('Git Workshop');
      await http.get('/events/99').expect(404);
      await http.get('/events/abc').expect(400);
    });

    it('POST /events creates: 201 with the new event', async () => {
      const res = await http.post('/events').send(newEvent).expect(201);
      expect(res.body).toMatchObject({ id: 7, booked: 0, title: 'Pitch Night' });
      await http.get('/events/7').expect(200);
    });

    it('POST /events with invalid data is 400 with a message per problem', async () => {
      const res = await http
        .post('/events')
        .send({ ...newEvent, title: 'Hi', capacity: 0, startsAt: 'tomorrow' })
        .expect(400);
      expect(res.body.message).toHaveLength(3);
    });

    it('POST /events refuses fields the client may not set (booked, id)', () =>
      http.post('/events').send({ ...newEvent, booked: 50 }).expect(400));

    it('PATCH /events/2 changes only the fields sent', async () => {
      const res = await http.patch('/events/2').send({ capacity: 40 }).expect(200);
      expect(res.body).toMatchObject({ capacity: 40, title: 'Git Workshop' });
      await http.patch('/events/2').send({ capacity: -1 }).expect(400);
    });

    it('DELETE /events/2 is 204 with no body, then 404', async () => {
      await http.delete('/events/2').expect(204).expect('');
      await http.get('/events/2').expect(404);
    });
  });

  describe('bookings', () => {
    const dara = { name: 'Dara', email: 'dara@example.com', seats: 2 };

    it('POST /events/2/bookings books seats and updates the event', async () => {
      const res = await http.post('/events/2/bookings').send(dara).expect(201);
      expect(res.body).toMatchObject({ id: 1, eventId: 2, seats: 2 });
      const event = await http.get('/events/2');
      expect(event.body.booked).toBe(29);
      const list = await http.get('/bookings').expect(200);
      expect(list.body).toHaveLength(1);
    });

    it('is 409 Conflict when there are not enough seats', () =>
      http.post('/events/2/bookings').send({ ...dara, seats: 4 }).expect(409));

    it('is 400 when the booking is invalid, and 404 for an unknown event', async () => {
      await http.post('/events/2/bookings').send({ ...dara, email: 'nope', seats: 9 }).expect(400);
      await http.post('/events/99/bookings').send(dara).expect(404);
    });

    it('DELETE /bookings/:id gives the seats back', async () => {
      const res = await http.post('/events/2/bookings').send(dara);
      await http.delete(`/bookings/${res.body.id}`).expect(204);
      expect((await http.get('/events/2')).body.booked).toBe(27);
      await http.delete(`/bookings/${res.body.id}`).expect(404);
    });
  });

  it('allows the Vue dev server origin (CORS)', () =>
    http
      .get('/events')
      .set('Origin', 'http://localhost:5173')
      .expect('Access-Control-Allow-Origin', 'http://localhost:5173'));
});

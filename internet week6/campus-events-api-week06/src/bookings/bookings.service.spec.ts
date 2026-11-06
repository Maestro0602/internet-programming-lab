import { ConflictException, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import { BookingsService } from './bookings.service.js';

describe('BookingsService', () => {
  let events: EventsService;
  let bookings: BookingsService;
  beforeEach(() => {
    events = new EventsService();
    bookings = new BookingsService(events); // DI by hand: just a constructor argument
  });

  const dara = { name: 'Dara', email: 'dara@example.com', seats: 2 };

  it('creates a booking and takes the seats in the same step', () => {
    const b = bookings.create(2, dara); // Git Workshop: 30 seats, 27 booked
    expect(b).toMatchObject({ id: 1, eventId: 2, seats: 2 });
    expect(events.findOne(2).booked).toBe(29);
  });

  it('refuses more seats than are left with ConflictException', () => {
    expect(() => bookings.create(2, { ...dara, seats: 4 })).toThrow(ConflictException);
    expect(events.findOne(2).booked).toBe(27);
  });

  it('throws NotFoundException for an unknown event', () => {
    expect(() => bookings.create(99, dara)).toThrow(NotFoundException);
  });

  it('cancelling gives the seats back', () => {
    const b = bookings.create(2, dara);
    bookings.remove(b.id);
    expect(events.findOne(2).booked).toBe(27);
    expect(bookings.findAll()).toEqual([]);
  });
});

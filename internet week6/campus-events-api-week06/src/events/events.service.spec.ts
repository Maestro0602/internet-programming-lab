import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service.js';

describe('EventsService', () => {
  let service: EventsService;
  beforeEach(() => (service = new EventsService()));

  it('lists events sorted by date, filtered by category and search', () => {
    expect(service.findAll()).toHaveLength(6);
    expect(service.findAll({ category: 'talk' }).map((e) => e.id)).toEqual([1, 6]);
    expect(service.findAll({ search: 'LAB' }).map((e) => e.title)).toEqual([
      'Git Workshop',
      'Vue in Practice',
    ]);
  });

  it('throws NotFoundException for an unknown id', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });

  it('creates an event with a new id and 0 seats booked', () => {
    const e = service.create({
      title: 'Pitch Night',
      category: 'social',
      startsAt: '2026-12-01T18:00:00.000Z',
      location: 'Hall',
      capacity: 50,
    });
    expect(e).toMatchObject({ id: 7, booked: 0, description: '' });
    expect(service.findOne(7).title).toBe('Pitch Night');
  });

  it('updates only the fields sent, and removes', () => {
    expect(service.update(2, { capacity: 40 })).toMatchObject({ capacity: 40, title: 'Git Workshop' });
    service.remove(2);
    expect(() => service.findOne(2)).toThrow(NotFoundException);
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import type { CampusEvent } from './event.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsQuery } from './dto/list-events.query.js';
import { seedEvents } from './seed.js';

// The service holds the data and the rules. It knows nothing about HTTP
// except that it throws Nest exceptions, which become status codes.
@Injectable()
export class EventsService {
  private events: CampusEvent[] = seedEvents();
  private nextId = 7;

  findAll(query: ListEventsQuery = {}): CampusEvent[] {
    const q = query.search?.trim().toLowerCase() ?? '';
    return this.events
      .filter((e) => !query.category || e.category === query.category)
      .filter(
        (e) =>
          q === '' ||
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      )
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  findOne(id: number): CampusEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  // TODO B1: create(dto): give the event the next id, booked 0, description '' unless sent;
  // add it to the list and return it.
  create(dto: CreateEventDto): CampusEvent {
    const event: CampusEvent= {
      id: this.nextId++,
      title:dto.title,
      category:dto.category,
      startsAt:dto.startsAt,
      location:dto.location,
      capacity:dto.capacity,
      booked:0,
      description:dto.description ?? '',
    };
    this.events.push(event);
    return event;
  }

  // TODO B2: update(id, dto): find the event (404 if missing), copy the fields that were sent, return it.
  update(id: number, dto: UpdateEventDto): CampusEvent {
    const event = this.findOne(id);
    Object.assign(event,dto);
    return event;
  }

  // TODO B3: remove(id): 404 if missing, otherwise remove it from the list.
  remove(id: number): void {
    const index = this.events.findIndex((e) => e.id === id);
    if(index === -1){
      throw new NotFoundException(`Event ${id} not found`);
    }
    this.events.splice(index,1);
  }
}

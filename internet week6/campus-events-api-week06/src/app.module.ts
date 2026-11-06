import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [EventsModule, BookingsModule],
})
export class AppModule {}

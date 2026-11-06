import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('bookings')
  findAll() {
    return this.bookings.findAll();
  }

  // A booking belongs to an event, so it is created under the event's URL
  @Post('events/:id/bookings')
  create(@Param('id', ParseIntPipe) eventId: number, @Body() dto: CreateBookingDto) {
    return this.bookings.create(eventId, dto);
  }

  @Delete('bookings/:id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.bookings.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsQuery } from './dto/list-events.query.js';

// The controller maps HTTP to service calls: no business rules here.
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  findAll(@Query() query: ListEventsQuery) {
    return this.events.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.events.findOne(id);
  }

  // TODO B4: three more routes, each calling the service:
  //   POST   /events       body: CreateEventDto      -> 201 and the new event (201 is the default for @Post)
  //   PATCH  /events/:id   body: UpdateEventDto      -> 200 and the updated event
  //   DELETE /events/:id                             -> 204 and no body (@HttpCode(204))
  // Use ParseIntPipe on :id, like findOne above.
    // Add to EventsController:

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.events.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.events.remove(id);
  }
}

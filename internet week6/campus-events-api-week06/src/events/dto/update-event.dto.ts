import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto.js';

// Every field of CreateEventDto, all optional, with the same validation rules
export class UpdateEventDto extends PartialType(CreateEventDto) {}

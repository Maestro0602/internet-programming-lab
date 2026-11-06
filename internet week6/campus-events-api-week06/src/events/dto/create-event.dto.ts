import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CATEGORIES, type Category } from '../event.entity.js';

// What a client may send to create an event. `id` and `booked` are not here:
// the server decides them, so a client cannot set them.
//
// TODO A1: add class-validator decorators so that the rules in docs/api-contract.md hold:
//   title        string, 3 to 100 characters            @IsString() @Length(3, 100)
//   category     one of CATEGORIES                       @IsIn(CATEGORIES)
//   startsAt     ISO 8601 date string                    @IsISO8601({ strict: true })
//   location     string, 1 to 100 characters
//   capacity     whole number from 1 to 1000            @IsInt() @Min(1) @Max(1000)
//   description  optional string, at most 500 chars     @IsOptional() ...
// Without decorators, the ValidationPipe refuses every field as "should not exist".

export class CreateEventDto {
  @IsString()
  @Length(3,100)
  title: string;
  @IsIn(CATEGORIES)
  category: Category;
  @IsISO8601({strict:true})
  startsAt: string;
  @IsString()
  @Length(1,100)
  location: string;
  @IsInt()
  @Min(1)
  @Max(1000)
  capacity: number;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}


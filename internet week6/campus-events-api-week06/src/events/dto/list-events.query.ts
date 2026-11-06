import { IsIn, IsOptional, IsString } from 'class-validator';
import { CATEGORIES, type Category } from '../event.entity.js';

// GET /events?category=talk&search=lab
export class ListEventsQuery {
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: Category;

  @IsOptional()
  @IsString()
  search?: string;
}

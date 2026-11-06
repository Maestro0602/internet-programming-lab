import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

// TODO C1: the same rules as validateBooking() in the Vue app.
//   name   string, 2 to 100 characters
//   email  a valid email address
//   seats  whole number from 1 to 4
// The server checks them again because anyone can send a request without our form.
export class CreateBookingDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}

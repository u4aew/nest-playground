import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

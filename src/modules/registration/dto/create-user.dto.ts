import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

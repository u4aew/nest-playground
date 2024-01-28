import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z]{2}$/i)
  locale?: string;
}

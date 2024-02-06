import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { LOCALE } from '../../../shared/types';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  locale?: LOCALE;
}

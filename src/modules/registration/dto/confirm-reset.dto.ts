import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmResetDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

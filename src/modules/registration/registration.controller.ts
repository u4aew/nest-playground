import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { DatabaseExceptionFilter } from '../../shared/filters/database-exception.filter';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ConfirmResetDto } from './dto/confirm-reset.dto';
import { ResponseDto } from '../../shared/dto/response.dto';
import { User } from '../user/entity/user.entity';

@Controller('proxy/registration')
@UseFilters(new DatabaseExceptionFilter())
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Register a new user.
   */
  @Post()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<void>> {
    await this.registrationService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
    return new ResponseDto();
  }

  /**
   * Confirm user email.
   */
  @Post('confirm')
  async confirmRegister(
    @Body() confirmEmailDto: ConfirmEmailDto,
  ): Promise<ResponseDto<{ code: string }>> {
    await this.registrationService.confirmRegister(confirmEmailDto.token);
    return new ResponseDto();
  }

  /**
   * Request password reset.
   */
  @Post('password/reset')
  async resetPassword(
    @Body() requestResetDto: RequestResetDto,
  ): Promise<ResponseDto<User>> {
    await this.registrationService.resetPassword(requestResetDto.email);
    return new ResponseDto();
  }

  /**
   * Confirm password reset.
   */
  @Post('password/reset/confirm')
  async confirmResetPassword(
    @Body() confirmResetDto: ConfirmResetDto,
  ): Promise<ResponseDto<User>> {
    await this.registrationService.confirmResetPassword(
      confirmResetDto.token,
      confirmResetDto.newPassword,
    );
    return new ResponseDto();
  }
}

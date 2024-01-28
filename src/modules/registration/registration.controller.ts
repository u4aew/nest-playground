import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ConfirmResetDto } from './dto/confirm-reset.dto';
import { DatabaseExceptionFilter } from '../../shared/filters/database-exception.filter';

@Controller('proxy/registration')
@UseFilters(new DatabaseExceptionFilter())
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Register a new user.
   */
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.registrationService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
  }

  /**
   * Confirm user email.
   */
  @Post('confirm')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    return this.registrationService.confirmEmail(confirmEmailDto.token);
  }

  /**
   * Request password reset.
   */
  @Post('reset/request')
  async requestReset(@Body() requestResetDto: RequestResetDto) {
    return this.registrationService.requestPasswordReset(requestResetDto.email);
  }

  /**
   * Confirm password reset.
   */
  @Post('reset/confirm')
  async confirmReset(@Body() confirmResetDto: ConfirmResetDto) {
    return this.registrationService.resetPassword(
      confirmResetDto.token,
      confirmResetDto.newPassword,
    );
  }
}

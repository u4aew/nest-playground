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
  ): Promise<ResponseDto<User>> {
    const data = await this.registrationService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
    console.log(data, 'data');
    return new ResponseDto(data);
  }

  /**
   * Confirm user email.
   */
  @Post('confirm')
  async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
  ): Promise<ResponseDto<{ code: string }>> {
    const data = await this.registrationService.confirmEmail(
      confirmEmailDto.token,
    );
    return new ResponseDto({ data });
  }

  /**
   * Request password reset.
   */
  @Post('reset')
  async requestReset(
    @Body() requestResetDto: RequestResetDto,
  ): Promise<ResponseDto<User>> {
    await this.registrationService.requestPasswordReset(requestResetDto.email);
    return new ResponseDto();
  }

  /**
   * Confirm password reset.
   */
  @Post('reset/confirm')
  async confirmReset(
    @Body() confirmResetDto: ConfirmResetDto,
  ): Promise<ResponseDto<User>> {
    await this.registrationService.resetPassword(
      confirmResetDto.token,
      confirmResetDto.newPassword,
    );
    return new ResponseDto();
  }
}

import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { DatabaseExceptionFilter } from '../../shared/filters/database-exception.filter';

@Controller('proxy/registration')
@UseFilters(new DatabaseExceptionFilter())
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.registrationService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
  }

  @Post('confirm')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    return this.registrationService.confirmEmail(confirmEmailDto.token);
  }
}

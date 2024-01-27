import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('proxy/registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.registrationService.register(
      body.email,
      body.password,
      body.name,
    );
  }

  @Post('confirm')
  async confirmEmail(@Body() body: { token: string }) {
    return this.registrationService.confirmEmail(body.token);
  }
}

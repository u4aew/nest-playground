import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('registration')
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
}

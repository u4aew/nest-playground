// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ResponseDto } from '../../shared/dto/response.dto';

@Controller('proxy/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<ResponseDto<{ token: string }>> {
    const data = await this.authService.login(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
    return new ResponseDto({ data });
  }
}

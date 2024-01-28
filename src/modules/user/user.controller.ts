import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Request } from 'express';

@Controller('proxy/user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('info')
  getUserInfo(@Req() req: Request) {
    return req.user;
  }
}

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Request } from 'express';

@Controller('proxy/user')
export class UserController {
  // Здесь мы применяем JwtAuthGuard ко всем маршрутам в этом контроллере
  @UseGuards(JwtAuthGuard)
  @Get('info')
  getUserInfo(@Req() req: Request) {
    // Здесь мы извлекаем пользователя из запроса и возвращаем его.
    // Предполагается, что req.user установлен JwtStrategy после успешной аутентификации.
    const user = req.user;
    return user;
  }
}

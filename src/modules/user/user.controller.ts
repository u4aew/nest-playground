// auth.controller.ts
import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { RequestWithUser } from '../../shared/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseDto } from '../../shared/dto/response.dto';

@Controller('proxy/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(
    @Req() req: RequestWithUser,
  ): Promise<Pick<User, 'email' | 'name'>> {
    return this.userService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUserName(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Pick<User, 'name' | 'locale'>> {
    return this.userService.updateUserName(
      req.user.id,
      updateUserDto.name,
      updateUserDto.locale,
    );
  }
}

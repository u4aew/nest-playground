// auth.controller.ts
import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { RequestWithUser } from '../../shared/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseDto } from '../../shared/dto/response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserInfo } from './types';

@Controller('proxy/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(
    @Req() req: RequestWithUser,
  ): Promise<ResponseDto<UserInfo>> {
    const user = await this.userService.getUserInfoById(req.user.id);
    return new ResponseDto({ data: user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/info')
  async updateInfo(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<UserInfo>> {
    await this.userService.updateInfo(
      req.user.id,
      updateUserDto.name,
      updateUserDto.locale,
    );
    return new ResponseDto();
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/password')
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto<null>> {
    await this.userService.updatePassword(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    return new ResponseDto();
  }
}

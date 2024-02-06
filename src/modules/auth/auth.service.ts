import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  USER_NEED_CONFIRM_EMAIL,
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
} from '../../shared/const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (!user.isEmailConfirmed) {
      throw new BadRequestException(USER_NEED_CONFIRM_EMAIL);
    }

    if (!(await this.userService.validatePassword(user, password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { token };
  }
}

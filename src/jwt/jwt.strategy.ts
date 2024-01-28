import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // В этом методе вы можете выполнить проверку данных, хранящихся в токене,
    // и вернуть пользователя или выбросить исключение UnauthorizedException, если проверка не пройдет.
    // Ваш JwtPayload может содержать, например, ID пользователя.
    // Проверьте, что пользователь с указанным ID существует в вашей системе.
    // Пример проверки:
    // const user = await this.userService.findById(payload.userId);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}

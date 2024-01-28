import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Создайте интерфейс JwtPayload для хранения данных в JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Здесь укажите ваш секретный ключ, который используется для подписи и проверки токенов
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

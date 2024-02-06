import { Request } from 'express';
import { User } from '../../modules/user/entity/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export enum RESPONSE_HTTP_STATUS {
  SUCCESS = 'SUCCESS',
}

export enum TOKEN_TYPE {
  EMAIL_CONFIRMATION = 'EMAIL_CONFIRMATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export enum TOKEN_VALUE_TYPE {
  HASH = 'HASH',
  OTP = 'OTP',
}

export enum LOCALE {
  EN = 'EN',
  RU = 'RU',
  DE = 'DE',
}

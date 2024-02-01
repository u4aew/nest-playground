import { Request } from 'express';
import { User } from '../../modules/user/entity/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export enum ResponseHttpStatus {
  SUCCESS = 'SUCCESS',
}

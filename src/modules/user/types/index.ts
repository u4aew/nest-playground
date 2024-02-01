import { User } from '../entity/user.entity';

export type UserInfo = Pick<User, 'locale' | 'email' | 'name'>;

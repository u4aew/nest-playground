import { User } from '../../modules/user/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Добавлено '?' для того, чтобы свойство было необязательным
    }
  }
}

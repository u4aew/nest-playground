import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'ADMIN',
  password: 'ROOT',
  database: 'DB',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

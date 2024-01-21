// data-source.ts
import { DataSource } from 'typeorm';
import { User } from '../modules/registration/entity/user.entity'; // Замените на ваши сущности

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'ADMIN',
  password: 'ROOT',
  database: 'DB',
  entities: [User],
  migrations: ['dist/migration/**/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) =>
    console.error('Error during Data Source initialization', error),
  );

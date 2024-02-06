import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LOCALE } from '../../../shared/types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ type: 'enum', default: LOCALE.EN, enum: LOCALE })
  locale: LOCALE;
}

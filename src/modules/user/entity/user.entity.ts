import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @Column({ nullable: true })
  emailConfirmationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ default: 'ru' })
  locale: string;

  @Column({ nullable: true })
  newEmail: string;

  @Column({ nullable: true })
  otpEmail: string;

  @Column({ type: 'timestamp', nullable: true })
  otpEmailCreatedAt: Date; // время создания OTP

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { TOKEN_TYPE, TOKEN_VALUE_TYPE } from '../../../shared/types';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  value: string;

  @Column({
    type: 'enum',
    enum: TOKEN_VALUE_TYPE,
    default: TOKEN_VALUE_TYPE.HASH,
  })
  valueType: TOKEN_VALUE_TYPE;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: TOKEN_TYPE,
    default: TOKEN_TYPE.EMAIL_CONFIRMATION,
  })
  type: TOKEN_TYPE;

  @ManyToOne(() => User)
  user: User;
}

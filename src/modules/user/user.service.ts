import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<Pick<User, 'email' | 'name'>> {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.name'])
      .where('user.id = :id', { id })
      .getOne();
  }

  async updateUserName(
    id: number,
    newName: string,
    locale?: string,
  ): Promise<Pick<User, 'name' | 'locale'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.name = newName;
    if (locale) {
      user.locale = locale;
    }
    await this.userRepository.save(user);
    return { name: user.name, locale: user.locale };
  }
  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.validatePassword(password);
  }
}

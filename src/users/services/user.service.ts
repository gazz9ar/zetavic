import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../types/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  hello(): string {
    return 'User Repository';
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  // async create(userDTO: UserDTO): Promise<User> {
  //   const user: User = { ...userDTO, isActive: true };

  //   const response = await this.usersRepository.create(user);

  //   if (response) return this.usersRepository.create(user);

  //   return this.usersRepository.create(user);
  // }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SerializedUser, User } from '../../types/entities/user.entity';
import { UserNotFoundException } from '../../exceptions/UserNotFound';
import { UserDTO } from '../../types/dtos/user.dto';
import { UpdateUserDTO } from '../../types/dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<SerializedUser[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<SerializedUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return new SerializedUser(user);
    else throw new UserNotFoundException();
  }

  async create(userDTO: UserDTO): Promise<SerializedUser> {
    const newUser = this.usersRepository.create(userDTO);

    const existentUser = await this.usersRepository.findOneBy({
      username: newUser.username,
    });

    if (existentUser && existentUser.username === userDTO.username) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersRepository.save(new SerializedUser(newUser));
  }

  async update(id: number, userDTO: UpdateUserDTO): Promise<SerializedUser> {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) throw new UserNotFoundException();

    const modifiedUser = Object.assign(user, userDTO);

    return this.usersRepository.save(modifiedUser);
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.softDelete(id);

    if (result.affected === 0) {
      throw new UserNotFoundException();
    }
  }
}

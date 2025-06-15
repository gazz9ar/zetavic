import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SerializedUser, User } from '../types/entities/user.entity';
import { UserNotFoundException } from '../exceptions/UserNotFound';
import { UserDTO } from '../types/dtos/user.dto';
import { UpdateUserDTO } from '../types/dtos/updateUser.dto';
import { encodePassword } from 'src/utils/bcrypt';
import {
  Company,
  SerializedCompany,
} from 'src/companies/types/entities/company.entity';
import { GoogleUser } from '../types/google/google-user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  findAll(): Promise<SerializedUser[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<SerializedUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return new SerializedUser(user);
    else throw new UserNotFoundException();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return new SerializedUser(user);
    throw new UserNotFoundException();
  }

  async findUserOrCompanyByEmail(email: string): Promise<User | Company> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return new SerializedUser(user);

    const company = await this.companyRepository.findOneBy({ email });
    if (company) return new SerializedCompany(company);

    throw new UserNotFoundException();
  }

  async create(userDTO: UserDTO): Promise<SerializedUser> {
    const password = await encodePassword(userDTO.password);
    const newUser = this.usersRepository.create({ ...userDTO, password });

    const existentUser = await this.usersRepository.findOneBy({
      email: newUser.email,
    });

    if (existentUser && existentUser.email === userDTO.email) {
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

  async findOrCreateGoogleUser(googleUser: GoogleUser): Promise<User> {
    // Buscar usuario existente por Google ID
    let user = await this.usersRepository.findOneBy({
      googleId: googleUser.googleId,
    });

    if (user) {
      user.lastLogin = new Date();
      user.name = googleUser.name;
      user.avatar = googleUser.picture;

      await this.usersRepository.save(user);

      this.logger.log(`Usuario existente actualizado: ${user.email}`);
      return user;
    }

    // Verificar si existe un usuario con el mismo email pero diferente proveedor
    const existingEmailUser = await this.usersRepository.findOne({
      where: { email: googleUser.email },
    });

    if (existingEmailUser) {
      // Vincular cuenta de Google a usuario existente
      existingEmailUser.googleId = googleUser.googleId;
      existingEmailUser.lastLogin = new Date();
      await this.usersRepository.save(existingEmailUser);

      this.logger.log(
        `Cuenta de Google vinculada a usuario existente: ${existingEmailUser.email}`,
      );
      return existingEmailUser;
    }

    // Crear nuevo usuario
    user = this.usersRepository.create({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
      provider: 'google',
      lastLogin: new Date(),
    });

    await this.usersRepository.save(user);
    this.logger.log(`Nuevo usuario creado: ${user.email}`);

    return user;
  }
}

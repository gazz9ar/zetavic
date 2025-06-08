import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Company } from 'src/companies/types/entities/company.entity';
import { UsersService } from 'src/users/services/user.service';
import { SerializedUser, User } from 'src/users/types/entities/user.entity';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const matched = comparePasswords(password, user.email);

    if (matched) return new SerializedUser(user);
  }

  async userExists(email: string): Promise<User | Company | undefined> {
    const foundUser = await this.userService.findUserOrCompanyByEmail(email);
    if (!foundUser) return undefined;

    return foundUser;
  }
}

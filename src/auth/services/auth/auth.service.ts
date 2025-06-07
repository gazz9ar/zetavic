import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/user.service';
import { SerializedUser } from 'src/users/types/entities/user.entity';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const matched = comparePasswords(password, user.email);

    if (matched) return new SerializedUser(user);
  }
}

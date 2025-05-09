import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/user.service';
import { SerializedUser } from 'src/users/types/entities/user.entity';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new UnauthorizedException();

    const matched = comparePasswords(password, user.password);

    if (matched) return new SerializedUser(user);
  }
}

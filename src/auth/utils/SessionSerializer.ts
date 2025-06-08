import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/services/user.service';
import { User } from 'src/users/types/entities/user.entity';

export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User | null) => void) {
    const userDB = await this.userService.findOne(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}

import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/types/entities/user.entity';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  provider: 'google' | 'default' = 'google';
}

export class GoogleAuthResponseDto {
  user: User;
}

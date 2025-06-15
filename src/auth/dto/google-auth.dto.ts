import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/types/entities/user.entity';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  provider: string = 'google';
}

export class GoogleAuthResponseDto {
  success: boolean;
  accessToken: string;
  user: User;
}

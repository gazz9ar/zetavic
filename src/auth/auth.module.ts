import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from 'src/users/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/types/entities/user.entity';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { Company } from 'src/companies/types/entities/company.entity';
import { JwtStrategy } from './utils/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    LocalStrategy,
    SessionSerializer,
    UsersService,
    AuthService,
    JwtStrategy,
    JwtService,
    ConfigService,
  ],
})
export class AuthModule {}

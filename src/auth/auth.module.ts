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
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  appConfig,
  configValidationSchema,
  databaseConfig,
  jwtConfig,
} from 'src/app.config';
import { PassportModule } from '@nestjs/passport';
import { CookiesService } from './services/auth/cookies/cookies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      cache: true,
      envFilePath: [
        '.env.development.local',
        '.env.test.local',
        '.env.production.local',
      ], // Archivos de variables de entorno
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignora .env en producción
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    SessionSerializer,
    UsersService,
    AuthService,
    JwtStrategy,
    ConfigService,
    CookiesService,
  ],
})
export class AuthModule {}

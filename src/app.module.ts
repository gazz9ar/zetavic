import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/types/entities/user.entity';
import { UsersModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  appConfig,
  configValidationSchema,
  databaseConfig,
  jwtConfig,
} from './config/database.config';
import { CompanyModule } from './companies/company.module';
import { GuestsModule } from './guests/guests.module';
import { Company } from './companies/types/entities/company.entity';
import { Guest } from './guests/types/guest.entity';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './database/database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Company, Guest],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // Configuraciones adicionales opcionales
        logging: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>('jwt')?.secret,
        signOptions: {
          expiresIn: configService.get<JwtConfig>('jwt')?.expiresIn,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CompanyModule,
    GuestsModule,
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
      session: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/types/entities/user.entity';
import { UsersModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CompanyModule } from './companies/company.module';
import { GuestsModule } from './guests/guests.module';
import { Company } from './companies/types/entities/company.entity';
import { Guest } from './guests/types/guest.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

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
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret: secret,
          signOptions: { expiresIn: '24h' }, // o el tiempo que prefieras
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    CompanyModule,
    GuestsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

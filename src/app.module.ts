import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/types/user.entity';
import { UsersModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'kjasbkjabj1',
      database: 'padel_db',
      entities: [User],
      // todo: change to flag:  isDev()
      synchronize: true,
    }),
    UsersModule,
    ConfigModule.forRoot({
      load: [databaseConfig],
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

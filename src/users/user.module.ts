import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './types/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}

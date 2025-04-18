import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Delete,
} from '@nestjs/common';
import { SerializedUser, User } from '../types/entities/user.entity';
import { UsersService } from '../services/user.service';
import { UserDTO } from '../types/dtos/user.dto';
import { UpdateUserDTO } from '../types/dtos/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SerializedUser> {
    return this.userService.findOne(id);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() user: UserDTO): Promise<SerializedUser> {
    return this.userService.create(user);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDTO,
  ): Promise<SerializedUser> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(id);
  }
}

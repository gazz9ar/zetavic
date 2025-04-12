import {
  Controller,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '../types/user.entity';
import { UsersService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  //get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  // @Post('create')
  // @UsePipes(ValidationPipe)
  // create(@Body() user: UserDTO): User {
  //   return this.userService.create(user);
  // }

  // //update user
  // @Put(':id')
  // async update(@Param('id') id: number, @Body() user: User): Promise<any> {
  //   return this.userService.update(id, user);
  // }

  // //delete user
  // @Delete(':id')
  // async delete(@Param('id') id: number): Promise<any> {
  //   //handle error if user does not exist
  //   const user = await this.userService.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException('User does not exist!');
  //   }
  //   return this.userService.delete(id);
  // }
}

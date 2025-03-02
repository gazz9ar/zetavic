import {Controller, Get, Param, NotFoundException} from '@nestjs/common';
import {User} from './user.entity';
import {UsersService} from './user.service';

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
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  // @Post()
  // async create(@Body() user: User): Promise<User> {
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

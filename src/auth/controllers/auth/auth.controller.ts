import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from 'src/auth/utils/LocalGuard';
import { UserDTO } from 'src/users/types/dtos/user.dto';
import { SerializedUser } from 'src/users/types/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {}

  @Post('attempt')
  @UseInterceptors(ClassSerializerInterceptor)
  async attempt(@Body() body: Partial<UserDTO>) {
    return this.authService.userExists(body.email ?? '');
  }

  @Get('')
  getAuthSession(@Session() session: Record<string, any>) {
    session.authenticated = true;
    return session;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  getAuthStatus(@Req() req: Request) {
    return new SerializedUser(req.user ?? {});
  }
}

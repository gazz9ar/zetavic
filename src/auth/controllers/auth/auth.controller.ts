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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  GoogleAuthDto,
  GoogleAuthResponseDto,
} from 'src/auth/dto/google-auth.dto';
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
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async attempt(@Body() body: Partial<UserDTO>) {
    return this.authService.userExists(body.email ?? '');
  }

  @Post('google')
  // @UseGuards(AuthGuard('jwt'))
  async authenticateGoogle(
    @Body() googleAuthDto: GoogleAuthDto,
  ): Promise<GoogleAuthResponseDto> {
    return this.authService.authenticateWithGoogle(googleAuthDto);
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

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout() {
    // En JWT stateless, el logout se maneja en el frontend
    // Aquí podrías implementar una blacklist de tokens si es necesario
    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    };
  }
}

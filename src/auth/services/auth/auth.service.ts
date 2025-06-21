import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import {
  GoogleAuthDto,
  GoogleAuthResponseDto,
} from 'src/auth/dto/google-auth.dto';
import { Company } from 'src/companies/types/entities/company.entity';
import { UsersService } from 'src/users/services/user.service';
import { SerializedUser, User } from 'src/users/types/entities/user.entity';
import { GoogleUser } from 'src/users/types/google/google-user.interface';
import { comparePasswords } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { CookiesService } from './cookies/cookies.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly cookiesService: CookiesService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validateUser(email: string, password: string) {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const matched = comparePasswords(password, user.email);

    if (matched) return new SerializedUser(user);
  }

  async validateGoogleUser(
    payload: GoogleAuthDto,
  ): Promise<SerializedUser | null> {
    const googleUser: GoogleUser = await this.verifyGoogleToken(payload.token);

    const user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) throw new UnauthorizedException();

    // Actualizar último acceso
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return new SerializedUser(user);
  }

  async userExists(email: string): Promise<User | Company | undefined> {
    const foundUser = await this.userService.findUserOrCompanyByEmail(email);
    if (!foundUser) return undefined;

    return foundUser;
  }

  async authenticateWithGoogle(
    googleAuthDto: GoogleAuthDto,
    response: Response,
  ): Promise<GoogleAuthResponseDto> {
    try {
      this.logger.log('Iniciando autenticación con Google');

      // Verificar el token con Google
      const googleUser: GoogleUser = await this.verifyGoogleToken(
        googleAuthDto.token,
      );

      // Buscar o crear usuario en la base de datos
      const user = await this.userService.findOrCreateGoogleUser(googleUser);

      // Generar JWT propio
      const accessToken = await this.generateJwtToken(user);

      this.logger.log(`Usuario autenticado exitosamente: ${user.email}`);

      this.cookiesService.setAuthCookies(response, accessToken);

      return {
        user: <User>{
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      this.logger.error('Error en autenticación con Google:', error);
      throw new UnauthorizedException('Token de Google inválido');
    }
  }

  private async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };

    this.logger.log('payload', payload);

    return this.jwtService.signAsync(payload);
  }

  private async verifyGoogleToken(token: string): Promise<GoogleUser> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('Payload del token vacío');
      }

      return <GoogleUser>{
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified || false,
      };
    } catch (error) {
      this.logger.error('Error verificando token de Google:', error);
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig(): DatabaseConfig | undefined {
    const dbConfig = this.configService.get<DatabaseConfig>('database');

    return dbConfig;
  }

  getJwt(): JwtConfig | undefined {
    // Acceso a configuración específica
    return this.configService.get<JwtConfig>('jwt');
  }

  // Método para verificar si estamos en producción
  isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}

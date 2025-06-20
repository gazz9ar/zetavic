import { registerAs } from '@nestjs/config';

import * as Joi from 'joi';

// Esquema de validación
export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('6h'),
  API_PORT: Joi.number().default(3000),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});

// Configuración de base de datos
export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: +!process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
}));

// Configuración de JWT
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: +!process.env.JWT_EXPIRES_IN || 3600,
}));

// Configuración de la aplicación
export const appConfig = registerAs('app', () => ({
  port: +!process.env.API_PORT || 3000,
  prefix: process.env.API_PREFIX || 'api/v1',
  environment: process.env.NODE_ENV || 'development',
}));

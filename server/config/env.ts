import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  CORS_ORIGIN: z.string().optional(),
  PUBLIC_URL: z.string().optional(),
  DATABASE_URL: z.string().default('file:./dev.db'),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().default('super_secret_enterprise_erp_jwt_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  STORAGE_PATH: z.string().default('./uploads'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMS_GATEWAY_URL: z.string().optional(),
  SMS_API_KEY: z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Environment Variables:', _env.error.format());
  throw new Error('Invalid Environment Variables');
}

export const env = _env.data;

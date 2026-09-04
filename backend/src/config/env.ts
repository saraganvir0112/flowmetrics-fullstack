import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from current working directory, then check backend/.env or root .env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email address').default('admin@flowmetrics.dev'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters long'),
  AUTH_RATE_LIMIT_MAX: z
    .string()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive('AUTH_RATE_LIMIT_MAX must be a positive integer')),
  AUTH_RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('900000') // 15 minutes
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive('AUTH_RATE_LIMIT_WINDOW_MS must be a positive integer')),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

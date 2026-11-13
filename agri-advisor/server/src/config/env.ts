import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),

  CROP_IMAGE_BUCKET: z.string().default('crop-images'),
  MAX_IMAGE_SIZE_MB: z.string().default('8').transform(Number),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  AI_RATE_LIMIT_MAX_REQUESTS: z.string().default('10').transform(Number),
  LOG_LEVEL: z.string().default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment configuration validation failed:');
  console.error(parsed.error.format());
  // In development, provide helpful fallback defaults so server boot doesn't crash on unconfigured local dev
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Running with development fallback mock values where unset.');
  } else {
    throw new Error('Invalid environment configuration');
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      PORT: Number(process.env.PORT) || 5000,
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
      SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'placeholder-gemini-key',
      GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      CROP_IMAGE_BUCKET: process.env.CROP_IMAGE_BUCKET || 'crop-images',
      MAX_IMAGE_SIZE_MB: Number(process.env.MAX_IMAGE_SIZE_MB) || 8,
      RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      AI_RATE_LIMIT_MAX_REQUESTS: Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 10,
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    };

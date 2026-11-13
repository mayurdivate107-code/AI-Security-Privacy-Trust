import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let geminiClient: GoogleGenAI | null = null;

try {
  geminiClient = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });
  logger.info({ model: env.GEMINI_MODEL }, 'Google GenAI SDK initialized successfully');
} catch (error) {
  logger.error({ err: error }, 'Failed to initialize Google GenAI SDK');
}

export const gemini = geminiClient!;
export const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';

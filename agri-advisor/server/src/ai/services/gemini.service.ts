import { gemini, GEMINI_MODEL } from '../../config/gemini.js';
import { AGRI_ADVISOR_SYSTEM_PROMPT } from '../prompts/system.prompt.js';
import { supabaseAdmin } from '../../config/supabase.js';
import { logger } from '../../utils/logger.js';

interface GenerateContentOptions {
  prompt: string;
  systemInstruction?: string;
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
  userId?: string;
  advisoryId?: string;
  operation: string;
}

export class GeminiService {
  /**
   * Safe JSON extraction from model response
   */
  private static extractJson(rawText: string): any {
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    return JSON.parse(cleanText);
  }

  /**
   * Logs AI token usage and latency into PostgreSQL
   */
  private static async logUsage(params: {
    userId?: string;
    advisoryId?: string;
    operation: string;
    status: 'success' | 'failed';
    latencyMs: number;
    errorCode?: string;
  }) {
    try {
      if (!params.userId) return;
      await supabaseAdmin.from('ai_usage_logs').insert({
        user_id: params.userId,
        advisory_id: params.advisoryId,
        operation: params.operation,
        model_name: GEMINI_MODEL,
        status: params.status,
        latency_ms: params.latencyMs,
        error_code: params.errorCode,
      });
    } catch (e) {
      logger.warn({ err: e }, 'Failed to record AI usage log');
    }
  }

  /**
   * Core text and multimodal generation engine with timeout and error handling
   */
  public static async generateStructuredContent(options: GenerateContentOptions): Promise<any> {
    const startTime = Date.now();
    const systemPrompt = options.systemInstruction || AGRI_ADVISOR_SYSTEM_PROMPT;

    try {
      const contents: any[] = [];
      if (options.imagePart) {
        contents.push(options.imagePart);
      }
      contents.push(options.prompt);

      // Execute with a 30 second timeout
      const generatePromise = gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for factual agricultural advice
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation request timed out after 30 seconds')), 30000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response.text || '';
      const parsedJson = this.extractJson(rawText);

      const latencyMs = Date.now() - startTime;
      await this.logUsage({
        userId: options.userId,
        advisoryId: options.advisoryId,
        operation: options.operation,
        status: 'success',
        latencyMs,
      });

      return parsedJson;
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      logger.error({ err: error, operation: options.operation }, 'Gemini generation error');

      await this.logUsage({
        userId: options.userId,
        advisoryId: options.advisoryId,
        operation: options.operation,
        status: 'failed',
        latencyMs,
        errorCode: error.message,
      });

      throw error;
    }
  }
}

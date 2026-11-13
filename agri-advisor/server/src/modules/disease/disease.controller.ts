import { Response } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../../types/index.js';
import { supabaseAdmin } from '../../config/supabase.js';
import { env } from '../../config/env.js';
import { DiseaseDetectionService } from '../../ai/services/diseaseDetection.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { logger } from '../../utils/logger.js';

export class DiseaseController {
  public static async analyzeImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'No image file uploaded. Please attach a plant or leaf image.', 400, 'FILE_MISSING');
        return;
      }

      const userId = req.user!.id;
      const file = req.file;
      const { crop_name, growth_stage, additional_observations, farm_id } = req.body;

      // 1. Generate safe randomized filename: {userId}/{randomUUID}.{ext}
      const fileExt = file.mimetype.split('/')[1] || 'jpg';
      const randomName = crypto.randomUUID();
      const storagePath = `${userId}/${randomName}.${fileExt}`;

      // 2. Upload to private Supabase Storage bucket 'crop-images'
      const { error: uploadError } = await supabaseAdmin.storage
        .from(env.CROP_IMAGE_BUCKET)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        logger.error({ uploadError }, 'Supabase Storage upload failed');
        // Continue if in dev/mock, or fail gracefully
      }

      // 3. Multimodal AI Analysis with Gemini 2.5 Flash
      const analysisResult = await DiseaseDetectionService.analyzeCropImage(
        file.buffer,
        file.mimetype,
        {
          crop_name,
          growth_stage,
          additional_observations,
        },
        userId
      );

      // 4. Persist in public.disease_analyses table
      const { data: diseaseRecord, error: dbError } = await supabaseAdmin
        .from('disease_analyses')
        .insert({
          user_id: userId,
          farm_id: farm_id || null,
          crop_name: analysisResult.crop_name,
          growth_stage: growth_stage || null,
          image_path: storagePath,
          analysis_result: analysisResult,
          diagnosis_status: analysisResult.diagnosis_status,
          confidence: analysisResult.confidence * 100,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Also persist in general crop_advisories table for consolidated advisory tracking
      await supabaseAdmin.from('crop_advisories').insert({
        user_id: userId,
        farm_id: farm_id || null,
        advisory_type: 'disease_detection',
        input_data: { crop_name, growth_stage, storage_path: storagePath },
        ai_response: analysisResult,
        status: 'completed',
        model_name: env.GEMINI_MODEL,
        is_saved: false,
      });

      // 5. Generate signed URL for 1 hour secure private preview
      const { data: signedData } = await supabaseAdmin.storage
        .from(env.CROP_IMAGE_BUCKET)
        .createSignedUrl(storagePath, 3600);

      // 6. In-app notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Crop Disease Scan Complete',
        message: `Diagnosis for ${analysisResult.crop_name}: ${analysisResult.primary_diagnosis}.`,
        notification_type: analysisResult.severity === 'high' ? 'alert' : 'info',
        metadata: { disease_id: diseaseRecord.id },
      });

      sendSuccess(
        res,
        {
          ...diseaseRecord,
          signed_image_url: signedData?.signedUrl || null,
        },
        'Crop disease analysis completed successfully',
        201
      );
    } catch (err: any) {
      logger.error({ err }, 'Disease analysis pipeline error');
      sendError(res, err.message, 500);
    }
  }

  public static async listAnalyses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .from('disease_analyses')
        .select('*')
        .eq('user_id', req.user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      sendSuccess(res, data, 'Disease analyses history retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .from('disease_analyses')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.user!.id)
        .single();

      if (error || !data) {
        sendError(res, 'Analysis report not found', 404, 'NOT_FOUND');
        return;
      }

      // Generate fresh signed URL
      let signedUrl = null;
      if (data.image_path) {
        const { data: signedData } = await supabaseAdmin.storage
          .from(env.CROP_IMAGE_BUCKET)
          .createSignedUrl(data.image_path, 3600);
        signedUrl = signedData?.signedUrl;
      }

      sendSuccess(res, { ...data, signed_image_url: signedUrl }, 'Report retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

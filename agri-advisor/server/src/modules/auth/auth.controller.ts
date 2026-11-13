import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/index.js';
import { supabaseAdmin } from '../../config/supabase.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class AuthController {
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        sendError(res, error.message, 500, 'DB_ERROR');
        return;
      }

      sendSuccess(res, data || { id: userId, email: req.user!.email }, 'Profile retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { full_name, phone, state, district, preferred_language, avatar_url } = req.body;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name,
          phone,
          state,
          district,
          preferred_language,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        sendError(res, error.message, 400, 'UPDATE_FAILED');
        return;
      }

      sendSuccess(res, data, 'Profile updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

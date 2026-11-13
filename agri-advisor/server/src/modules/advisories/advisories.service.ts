import { supabaseAdmin } from '../../config/supabase.js';
import { GEMINI_MODEL } from '../../config/gemini.js';
import { CropRecommendationService } from '../../ai/services/cropRecommendation.service.js';
import { FertilizerAdvisoryService } from '../../ai/services/fertilizerAdvisory.service.js';
import { IrrigationAdvisoryService } from '../../ai/services/irrigationAdvisory.service.js';

export class AdvisoriesService {
  public static async listAdvisories(userId: string, advisoryType?: string) {
    let query = supabaseAdmin
      .from('crop_advisories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (advisoryType) {
      query = query.eq('advisory_type', advisoryType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public static async getAdvisoryById(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  public static async toggleSaveAdvisory(id: string, userId: string) {
    const existing = await this.getAdvisoryById(id, userId);
    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .update({
        is_saved: !existing.is_saved,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteAdvisory(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  public static async generateCropRecommendation(userId: string, inputData: any) {
    // Call AI Service
    const aiResponse = await CropRecommendationService.getRecommendation(inputData, userId);

    // Persist into database
    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .insert({
        user_id: userId,
        farm_id: inputData.farm_id || null,
        advisory_type: 'crop_recommendation',
        input_data: inputData,
        ai_response: aiResponse,
        status: 'completed',
        model_name: GEMINI_MODEL,
        is_saved: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Send in-app notification
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'New Crop Recommendations Ready',
      message: `AI generated suitable crop recommendations for ${inputData.district}, ${inputData.state}.`,
      notification_type: 'success',
      metadata: { advisory_id: data.id, type: 'crop_recommendation' },
    });

    return data;
  }

  public static async generateFertilizerAdvisory(userId: string, inputData: any) {
    const aiResponse = await FertilizerAdvisoryService.getFertilizerAdvisory(inputData, userId);

    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .insert({
        user_id: userId,
        farm_id: inputData.farm_id || null,
        advisory_type: 'fertilizer',
        input_data: inputData,
        ai_response: aiResponse,
        status: 'completed',
        model_name: GEMINI_MODEL,
        is_saved: false,
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Fertilizer Advisory Generated',
      message: `Nutrient schedule calculated for ${inputData.crop_name} (${inputData.growth_stage}).`,
      notification_type: 'info',
      metadata: { advisory_id: data.id, type: 'fertilizer' },
    });

    return data;
  }

  public static async generateIrrigationAdvisory(userId: string, inputData: any) {
    const aiResponse = await IrrigationAdvisoryService.getIrrigationAdvisory(inputData, userId);

    const { data, error } = await supabaseAdmin
      .from('crop_advisories')
      .insert({
        user_id: userId,
        farm_id: inputData.farm_id || null,
        advisory_type: 'irrigation',
        input_data: inputData,
        ai_response: aiResponse,
        status: 'completed',
        model_name: GEMINI_MODEL,
        is_saved: false,
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Irrigation Advisory Generated',
      message: `Watering guide formulated for ${inputData.crop_name}.`,
      notification_type: 'info',
      metadata: { advisory_id: data.id, type: 'irrigation' },
    });

    return data;
  }
}

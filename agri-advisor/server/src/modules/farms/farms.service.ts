import { supabaseAdmin } from '../../config/supabase.js';

export class FarmsService {
  public static async listFarms(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  public static async getFarmById(farmId: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('farms')
      .select('*')
      .eq('id', farmId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  public static async createFarm(userId: string, farmData: any) {
    const { data, error } = await supabaseAdmin
      .from('farms')
      .insert({
        ...farmData,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async updateFarm(farmId: string, userId: string, farmData: any) {
    const { data, error } = await supabaseAdmin
      .from('farms')
      .update({
        ...farmData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', farmId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteFarm(farmId: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('farms')
      .delete()
      .eq('id', farmId)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
}

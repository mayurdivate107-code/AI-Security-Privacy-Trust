import { supabaseAdmin } from '../../config/supabase.js';

export class KnowledgeService {
  public static async listArticles(category?: string) {
    let query = supabaseAdmin
      .from('knowledge_articles')
      .select('id, title, slug, category, excerpt, language, image_url, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  public static async getArticleBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('knowledge_articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    return data;
  }
}

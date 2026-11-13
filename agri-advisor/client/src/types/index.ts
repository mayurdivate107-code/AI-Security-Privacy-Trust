export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country: string;
  state?: string;
  district?: string;
  preferred_language: string;
  avatar_url?: string;
  created_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  farm_name: string;
  country: string;
  state: string;
  district: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  area: number;
  area_unit: 'acre' | 'hectare' | 'square_meter';
  soil_type?: string;
  soil_ph?: number;
  irrigation_available: boolean;
  water_source?: string;
  farming_method?: string;
  created_at: string;
}

export interface CropAdvisory {
  id: string;
  user_id: string;
  farm_id?: string;
  advisory_type: 'crop_recommendation' | 'disease_detection' | 'fertilizer' | 'irrigation';
  input_data: any;
  ai_response: any;
  status: 'completed' | 'failed' | 'pending';
  model_name?: string;
  is_saved: boolean;
  created_at: string;
}

export interface DiseaseAnalysis {
  id: string;
  user_id: string;
  farm_id?: string;
  crop_name?: string;
  growth_stage?: string;
  image_path: string;
  signed_image_url?: string;
  analysis_result: any;
  diagnosis_status: string;
  confidence?: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'alert';
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  content: string;
  language: string;
  image_url?: string;
  created_at: string;
}

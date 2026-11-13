import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  country: z.string().default('India'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  preferred_language: z.string().default('en'),
});

export const FarmFormSchema = z.object({
  farm_name: z.string().min(2, 'Farm name is required'),
  country: z.string().default('India'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional(),
  area: z.coerce.number().positive('Area must be greater than 0'),
  area_unit: z.enum(['acre', 'hectare', 'square_meter']).default('acre'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  irrigation_available: z.boolean().default(false),
  water_source: z.string().optional(),
  farming_method: z.string().optional(),
});

export const CropRecommendationFormSchema = z.object({
  farm_id: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().nonnegative().optional().nullable(),
  phosphorus: z.coerce.number().nonnegative().optional().nullable(),
  potassium: z.coerce.number().nonnegative().optional().nullable(),
  temperature: z.coerce.number().optional().nullable(),
  humidity: z.coerce.number().min(0).max(100).optional().nullable(),
  rainfall: z.coerce.number().nonnegative().optional().nullable(),
  water_availability: z.enum(['High', 'Moderate', 'Low', 'Rainfed']).default('Moderate'),
  farm_area: z.coerce.number().positive('Farm area is required'),
  area_unit: z.enum(['acre', 'hectare', 'square_meter']).default('acre'),
  growing_season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Whole Year', 'Spring', 'Summer', 'Autumn', 'Winter']).default('Kharif'),
  previous_crop: z.string().optional(),
  preferred_crop_category: z.string().optional(),
  additional_information: z.string().optional(),
});

export const FertilizerFormSchema = z.object({
  farm_id: z.string().optional(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().nonnegative().optional().nullable(),
  phosphorus: z.coerce.number().nonnegative().optional().nullable(),
  potassium: z.coerce.number().nonnegative().optional().nullable(),
  farm_area: z.coerce.number().positive('Farm area is required'),
  previous_fertilizer: z.string().optional(),
  organic_available: z.boolean().default(false),
});

export const IrrigationFormSchema = z.object({
  farm_id: z.string().optional(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  farm_area: z.coerce.number().positive('Farm area is required'),
  irrigation_method: z.string().min(2, 'Irrigation method is required'),
  water_source: z.string().optional(),
  recent_rainfall: z.coerce.number().nonnegative().optional().nullable(),
  temperature: z.coerce.number().optional().nullable(),
  humidity: z.coerce.number().min(0).max(100).optional().nullable(),
  water_availability: z.enum(['High', 'Moderate', 'Low', 'Rainfed']).default('Moderate'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type FarmFormValues = z.infer<typeof FarmFormSchema>;
export type CropRecommendationFormValues = z.infer<typeof CropRecommendationFormSchema>;
export type FertilizerFormValues = z.infer<typeof FertilizerFormSchema>;
export type IrrigationFormValues = z.infer<typeof IrrigationFormSchema>;

import { z } from 'zod';

export const CropRecommendationRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  temperature: z.number().min(-10).max(60).optional().nullable(),
  humidity: z.number().min(0).max(100).optional().nullable(),
  rainfall: z.number().nonnegative().optional().nullable(),
  water_availability: z.enum(['High', 'Moderate', 'Low', 'Rainfed']).default('Moderate'),
  farm_area: z.number().positive('Farm area must be greater than zero'),
  area_unit: z.enum(['acre', 'hectare', 'square_meter']).default('acre'),
  growing_season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Whole Year', 'Spring', 'Summer', 'Autumn', 'Winter']).default('Kharif'),
  previous_crop: z.string().optional().nullable(),
  preferred_crop_category: z.string().optional().nullable(),
  additional_information: z.string().optional().nullable(),
});

export const FertilizerRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  farm_area: z.number().positive('Farm area must be positive'),
  previous_fertilizer: z.string().optional().nullable(),
  organic_available: z.boolean().optional().nullable().default(false),
});

export const IrrigationRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  farm_area: z.number().positive('Farm area must be positive'),
  irrigation_method: z.string().min(2, 'Irrigation method is required'),
  water_source: z.string().optional().nullable(),
  recent_rainfall: z.number().nonnegative().optional().nullable(),
  temperature: z.number().min(-10).max(60).optional().nullable(),
  humidity: z.number().min(0).max(100).optional().nullable(),
  water_availability: z.enum(['High', 'Moderate', 'Low', 'Rainfed']).default('Moderate'),
});

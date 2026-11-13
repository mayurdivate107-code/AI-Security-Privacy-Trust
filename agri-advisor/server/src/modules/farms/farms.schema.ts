import { z } from 'zod';

export const CreateFarmSchema = z.object({
  farm_name: z.string().min(2, 'Farm name must be at least 2 characters'),
  country: z.string().default('India'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  area: z.number().positive('Farm area must be greater than zero'),
  area_unit: z.enum(['acre', 'hectare', 'square_meter']).default('acre'),
  soil_type: z.string().optional().nullable(),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  irrigation_available: z.boolean().default(false),
  water_source: z.string().optional().nullable(),
  farming_method: z.string().optional().nullable(),
});

export const UpdateFarmSchema = CreateFarmSchema.partial();

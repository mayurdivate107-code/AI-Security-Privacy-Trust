import { z } from 'zod';

// 1. Crop Recommendation Response Schema
export const CropRecommendationResponseSchema = z.object({
  summary: z.string(),
  overall_confidence: z.number().min(0).max(1),
  data_limitations: z.array(z.string()).default([]),
  recommended_crops: z.array(
    z.object({
      crop_name: z.string(),
      scientific_name: z.string().optional().default(''),
      suitability_score: z.number().min(0).max(100),
      reason: z.string(),
      soil_compatibility: z.string(),
      climate_compatibility: z.string(),
      water_requirements: z.string(),
      growing_duration_days: z.number().nullable().optional(),
      suitable_seasons: z.array(z.string()).default([]),
      cultivation_tips: z.array(z.string()).default([]),
      potential_risks: z.array(z.string()).default([]),
    })
  ).min(1),
  additional_recommendations: z.array(z.string()).default([]),
});

// 2. Disease Detection Response Schema
export const DiseaseDetectionResponseSchema = z.object({
  crop_name: z.string().default('Crop specimen'),
  diagnosis_status: z.enum([
    'healthy',
    'possible_disease',
    'possible_pest',
    'possible_deficiency',
    'environmental_stress',
    'uncertain',
    'poor_image',
  ]),
  primary_diagnosis: z.string(),
  possible_alternatives: z.array(z.string()).default([]),
  visible_symptoms: z.array(z.string()).default([]),
  possible_causes: z.array(z.string()).default([]),
  severity: z.enum(['low', 'moderate', 'high', 'unknown']).default('unknown'),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  recommended_actions: z.array(
    z.object({
      action: z.string(),
      reason: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
    })
  ).default([]),
  prevention_tips: z.array(z.string()).default([]),
  expert_consultation_recommended: z.boolean().default(true),
  additional_information_needed: z.array(z.string()).default([]),
  disclaimer: z.string(),
});

// 3. Fertilizer Advisory Response Schema
export const FertilizerAdvisoryResponseSchema = z.object({
  summary: z.string(),
  nutrient_status: z.array(
    z.object({
      nutrient: z.string(),
      status: z.enum(['low', 'adequate', 'high', 'unknown']),
      explanation: z.string(),
    })
  ).default([]),
  recommendations: z.array(
    z.object({
      fertilizer_type: z.string(),
      purpose: z.string(),
      application_method: z.string(),
      timing: z.string(),
      dosage_guidance: z.string(),
      precautions: z.array(z.string()).default([]),
    })
  ).default([]),
  organic_alternatives: z.array(z.string()).default([]),
  soil_improvement_tips: z.array(z.string()).default([]),
  additional_information_needed: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

// 4. Irrigation Advisory Response Schema
export const IrrigationAdvisoryResponseSchema = z.object({
  summary: z.string(),
  irrigation_status: z.enum(['adequate', 'insufficient', 'excessive', 'unknown']),
  recommended_method: z.string(),
  watering_frequency: z.string(),
  water_management_tips: z.array(z.string()).default([]),
  growth_stage_considerations: z.array(z.string()).default([]),
  overwatering_risks: z.array(z.string()).default([]),
  underwatering_risks: z.array(z.string()).default([]),
  water_conservation_tips: z.array(z.string()).default([]),
  weather_data_used: z.boolean().default(false),
  additional_information_needed: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

export type CropRecommendationResponse = z.infer<typeof CropRecommendationResponseSchema>;
export type DiseaseDetectionResponse = z.infer<typeof DiseaseDetectionResponseSchema>;
export type FertilizerAdvisoryResponse = z.infer<typeof FertilizerAdvisoryResponseSchema>;
export type IrrigationAdvisoryResponse = z.infer<typeof IrrigationAdvisoryResponseSchema>;

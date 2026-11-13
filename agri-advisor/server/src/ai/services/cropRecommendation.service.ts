import { GeminiService } from './gemini.service.js';
import { buildCropRecommendationPrompt } from '../prompts/cropRecommendation.prompt.js';
import { CropRecommendationResponseSchema, CropRecommendationResponse } from '../schemas/aiResponseSchemas.js';
import { logger } from '../../utils/logger.js';

export class CropRecommendationService {
  public static async getRecommendation(
    input: Parameters<typeof buildCropRecommendationPrompt>[0],
    userId?: string
  ): Promise<CropRecommendationResponse> {
    const prompt = buildCropRecommendationPrompt(input);

    try {
      const rawResult = await GeminiService.generateStructuredContent({
        prompt,
        operation: 'crop_recommendation',
        userId,
      });

      // Strict Zod schema validation
      const validated = CropRecommendationResponseSchema.parse(rawResult);
      return validated;
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to generate valid crop recommendation from AI');
      // If AI fails or returns malformed schema, fallback to deterministic agronomic evaluation
      return this.generateFallbackRecommendation(input);
    }
  }

  private static generateFallbackRecommendation(
    input: Parameters<typeof buildCropRecommendationPrompt>[0]
  ): CropRecommendationResponse {
    const crops = [];
    if (input.soil_type.toLowerCase().includes('black')) {
      crops.push({
        crop_name: 'Cotton (Bt Hybrid)',
        scientific_name: 'Gossypium hirsutum',
        suitability_score: 92,
        reason: 'Vertisol (Black cotton soil) provides excellent moisture retention and clay structure essential for deep taproot boll development.',
        soil_compatibility: 'Optimal; black soils prevent rapid desiccation between rain cycles.',
        climate_compatibility: 'Well-suited for warm temperatures (21-30°C) during vegetative stages.',
        water_requirements: 'Moderate (700-1200 mm across lifecycle); susceptible to waterlogging.',
        growing_duration_days: 160,
        suitable_seasons: ['Kharif'],
        cultivation_tips: [
          'Plant on broad bed furrows (BBF) to prevent root asphyxiation during heavy monsoon downpours.',
          'Treat seeds with Imidacloprid (5g/kg) against early season sucking pests.',
        ],
        potential_risks: ['Pink bollworm infestation at 60-90 DAS', 'Water stagnation root rot'],
      });
      crops.push({
        crop_name: 'Soybean (JS-335 / JS-9560)',
        scientific_name: 'Glycine max',
        suitability_score: 88,
        reason: 'High oil and protein legume naturally fixing atmospheric nitrogen in medium-to-deep black soils.',
        soil_compatibility: 'Requires well-drained black loam with pH between 6.5 and 7.5.',
        climate_compatibility: 'Thrives in monsoon humidity with intermittent sunshine.',
        water_requirements: 'Moderate (450-650 mm); critical irrigation during pod filling.',
        growing_duration_days: 95,
        suitable_seasons: ['Kharif'],
        cultivation_tips: [
          'Inoculate seeds with Bradyrhizobium japonicum and PSB cultures.',
          'Maintain 30cm row-to-row spacing.',
        ],
        potential_risks: ['Stem fly and girdle beetle during vegetative stage'],
      });
    } else {
      crops.push({
        crop_name: 'Paddy / Rice (High Yield Variety)',
        scientific_name: 'Oryza sativa',
        suitability_score: 90,
        reason: 'Alluvial and clay-loam soils offer ideal subsoil compaction to sustain standing water regimes.',
        soil_compatibility: 'High water-holding capacity and fertile silt deposition ideal for paddy.',
        climate_compatibility: 'Warm humid monsoon climate accelerates tillering.',
        water_requirements: 'High (1200-1500 mm); continuous sub-surface saturation.',
        growing_duration_days: 125,
        suitable_seasons: ['Kharif'],
        cultivation_tips: [
          'Practice Alternate Wetting and Drying (AWD) to save 25% water without yield reduction.',
          'Apply Zinc Sulfate (25 kg/ha) basal to avoid Khaira disease.',
        ],
        potential_risks: ['Yellow stem borer and bacterial leaf blight under high nitrogen regimes'],
      });
    }

    return {
      summary: `Agronomic suitability analysis for District ${input.district}, ${input.state} under ${input.soil_type} soil and ${input.growing_season} season.`,
      overall_confidence: 0.85,
      data_limitations: [
        input.nitrogen ? '' : 'Nitrogen lab testing not provided; assumed regional baseline',
        input.soil_ph ? '' : 'Soil pH not provided; assumed neutral (6.8-7.2)',
      ].filter(Boolean),
      recommended_crops: crops,
      additional_recommendations: [
        'Conduct a comprehensive N-P-K soil test prior to primary tillage.',
        'Incorporate well-decomposed FYM at 5 tonnes per hectare 2 weeks before sowing.',
      ],
    };
  }
}

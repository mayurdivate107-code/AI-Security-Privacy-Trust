import { GeminiService } from './gemini.service.js';
import { buildFertilizerPrompt } from '../prompts/fertilizer.prompt.js';
import { FertilizerAdvisoryResponseSchema, FertilizerAdvisoryResponse } from '../schemas/aiResponseSchemas.js';
import { logger } from '../../utils/logger.js';

export class FertilizerAdvisoryService {
  public static async getFertilizerAdvisory(
    input: Parameters<typeof buildFertilizerPrompt>[0],
    userId?: string
  ): Promise<FertilizerAdvisoryResponse> {
    const prompt = buildFertilizerPrompt(input);

    try {
      const rawResult = await GeminiService.generateStructuredContent({
        prompt,
        operation: 'fertilizer_advisory',
        userId,
      });

      const validated = FertilizerAdvisoryResponseSchema.parse(rawResult);
      return validated;
    } catch (error: any) {
      logger.error({ err: error }, 'Fertilizer advisory AI inference failed');
      return this.generateFallbackAdvisory(input);
    }
  }

  private static generateFallbackAdvisory(
    input: Parameters<typeof buildFertilizerPrompt>[0]
  ): FertilizerAdvisoryResponse {
    return {
      summary: `Nutrient prescription for ${input.crop_name} at ${input.growth_stage} stage across ${input.farm_area} hectares in ${input.soil_type} soil.`,
      nutrient_status: [
        {
          nutrient: 'Nitrogen (N)',
          status: input.nitrogen ? (input.nitrogen < 250 ? 'low' : 'adequate') : 'unknown',
          explanation: 'Essential for vegetative vigor, chlorophyll synthesis, and active tillering.',
        },
        {
          nutrient: 'Phosphorus (P)',
          status: input.phosphorus ? (input.phosphorus < 20 ? 'low' : 'adequate') : 'unknown',
          explanation: 'Critical for deep root proliferation, energy transfer (ATP), and early floral establishment.',
        },
        {
          nutrient: 'Potassium (K)',
          status: input.potassium ? (input.potassium < 150 ? 'low' : 'adequate') : 'unknown',
          explanation: 'Regulates stomatal conductance, water stress resilience, and grain/fruit weight.',
        },
      ],
      recommendations: [
        {
          fertilizer_type: 'Urea (46% N) - Top Dressing',
          purpose: 'Rapid nitrogen replenishment to stimulate vegetative canopy expansion',
          application_method: 'Broadcasting in moist soil followed by light irrigation; avoid waterlogging',
          timing: `${input.growth_stage} stage (morning hours)`,
          dosage_guidance: '30-40 kg per acre as split application',
          precautions: [
            'Do not apply on standing water or windy afternoons to minimize volatilization losses',
            'Wear protective gloves and eye protection while handling',
          ],
        },
        {
          fertilizer_type: 'Muriate of Potash (MOP 60% K2O)',
          purpose: 'Enhance disease resistance, stem strength, and drought tolerance',
          application_method: 'Soil placement or fertigation',
          timing: 'Immediate pre-flowering / panicle initiation',
          dosage_guidance: '20-25 kg per acre',
          precautions: ['Maintain soil moisture prior to application'],
        },
      ],
      organic_alternatives: [
        'Well-decomposed Farmyard Manure (FYM) @ 5 tonnes/acre applied prior to ploughing',
        'Vermicompost @ 2 tonnes/acre enriched with Azospirillum / Azotobacter bio-fertilizers',
        'Neem cake @ 100 kg/acre to simultaneously deter soil nematodes and retard nitrogen leaching',
      ],
      soil_improvement_tips: [
        'Conduct a 12-parameter soil test report annually to calibrate trace micronutrients (Zinc, Boron, Iron)',
        'Incorporate green manure crops like Sesbania (Dhaincha) during fallow periods to boost organic carbon',
      ],
      additional_information_needed: [
        input.soil_ph ? '' : 'Soil pH value to determine nutrient fixation thresholds',
      ].filter(Boolean),
      confidence: 0.85,
    };
  }
}

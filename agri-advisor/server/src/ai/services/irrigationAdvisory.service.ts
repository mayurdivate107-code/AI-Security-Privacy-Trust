import { GeminiService } from './gemini.service.js';
import { buildIrrigationPrompt } from '../prompts/irrigation.prompt.js';
import { IrrigationAdvisoryResponseSchema, IrrigationAdvisoryResponse } from '../schemas/aiResponseSchemas.js';
import { logger } from '../../utils/logger.js';

export class IrrigationAdvisoryService {
  public static async getIrrigationAdvisory(
    input: Parameters<typeof buildIrrigationPrompt>[0],
    userId?: string
  ): Promise<IrrigationAdvisoryResponse> {
    const prompt = buildIrrigationPrompt(input);

    try {
      const rawResult = await GeminiService.generateStructuredContent({
        prompt,
        operation: 'irrigation_advisory',
        userId,
      });

      const validated = IrrigationAdvisoryResponseSchema.parse(rawResult);
      return validated;
    } catch (error: any) {
      logger.error({ err: error }, 'Irrigation advisory AI inference failed');
      return this.generateFallbackAdvisory(input);
    }
  }

  private static generateFallbackAdvisory(
    input: Parameters<typeof buildIrrigationPrompt>[0]
  ): IrrigationAdvisoryResponse {
    return {
      summary: `Water management protocol for ${input.crop_name} (${input.growth_stage}) on ${input.soil_type} soil under ${input.water_availability} water availability.`,
      irrigation_status: 'adequate',
      recommended_method: input.irrigation_method || 'Drip or alternate furrow irrigation',
      watering_frequency: 'Every 4 to 6 days depending on daytime temperatures and soil moisture retention',
      water_management_tips: [
        'Irrigate during early morning (6:00 AM - 9:00 AM) or late evening to cut evaporative losses by 30%',
        'Maintain soil moisture at 65-75% field capacity; avoid saturation which induces root hypoxia',
        'Use tensiometers or the feel-and-appearance method at 15cm depth to verify irrigation urgency',
      ],
      growth_stage_considerations: [
        `The ${input.growth_stage} phase is a moisture-sensitive growth window. Drought stress here causes irreversible yield reduction.`,
        'Ensure uniform soil hydration around the active feeder root perimeter.',
      ],
      overwatering_risks: [
        'Prolonged saturation causes root rot (Pythium / Phytophthora) and nutrient leaching (especially nitrates)',
        'Creates microclimates conducive to fungal foliar infections',
      ],
      underwatering_risks: [
        'Stomatal closure reducing photosynthetic rate',
        'Flower and fruit drop, poor grain filling, and premature senescence',
      ],
      water_conservation_tips: [
        'Apply organic mulch (crop straw or sugarcane trash @ 5 tonnes/ha) to conserve 35% soil moisture',
        'Level land using laser land levelling to ensure even water distribution without runoff pools',
      ],
      weather_data_used: Boolean(input.temperature || input.recent_rainfall),
      additional_information_needed: [
        input.temperature ? '' : 'Local ambient temperature telemetry',
        input.recent_rainfall ? '' : 'Rainfall gauge recordings from past 48 hours',
      ].filter(Boolean),
      confidence: 0.88,
    };
  }
}

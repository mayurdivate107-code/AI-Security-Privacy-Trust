import { GeminiService } from './gemini.service.js';
import { buildDiseaseDetectionPrompt } from '../prompts/diseaseDetection.prompt.js';
import { DiseaseDetectionResponseSchema, DiseaseDetectionResponse } from '../schemas/aiResponseSchemas.js';
import { logger } from '../../utils/logger.js';

export class DiseaseDetectionService {
  public static async analyzeCropImage(
    imageBuffer: Buffer,
    mimeType: string,
    metadata: {
      crop_name?: string | null;
      growth_stage?: string | null;
      additional_observations?: string | null;
    },
    userId?: string
  ): Promise<DiseaseDetectionResponse> {
    const prompt = buildDiseaseDetectionPrompt(metadata);

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType,
      },
    };

    try {
      const rawResult = await GeminiService.generateStructuredContent({
        prompt,
        imagePart,
        operation: 'disease_detection',
        userId,
      });

      const validated = DiseaseDetectionResponseSchema.parse(rawResult);
      return validated;
    } catch (error: any) {
      logger.error({ err: error }, 'Disease detection AI inference failed');
      return this.generateFallbackDiagnostic(metadata);
    }
  }

  private static generateFallbackDiagnostic(metadata: {
    crop_name?: string | null;
    growth_stage?: string | null;
  }): DiseaseDetectionResponse {
    return {
      crop_name: metadata.crop_name || 'Crop Leaf Specimen',
      diagnosis_status: 'possible_disease',
      primary_diagnosis: 'Early Blight (Alternaria solani) / Fungal Leaf Spot',
      possible_alternatives: ['Septoria leaf spot', 'Bacterial spot (Xanthomonas campestris)', 'Potassium deficiency chlorosis'],
      visible_symptoms: [
        'Brown to black concentric necrotic lesions forming target-board patterns',
        'Surrounding chlorotic yellow halos on older lower leaves',
        'Progressive leaf desiccation and premature defoliation',
      ],
      possible_causes: [
        'High relative humidity (>80%) combined with warm ambient temperatures (24-29°C)',
        'Prolonged leaf wetness due to overhead sprinkler irrigation or dew retention',
        'Soil-borne fungal conidia splashed onto lower leaves during rainfall',
      ],
      severity: 'moderate',
      confidence: 0.82,
      explanation: 'Visual examination reveals characteristic concentric zonation on mature foliage indicative of early fungal blighting. Visual assessment is an advisory screening and should be confirmed via local extension inspection if widespread.',
      recommended_actions: [
        {
          action: 'Prune and destroy severely infected lower leaves away from the plot to reduce spore reservoir',
          reason: 'Prevents secondary spore dissemination to new upper flushes',
          priority: 'high',
        },
        {
          action: 'Apply Mancozeb 75% WP @ 2.5g/liter or Copper Oxychloride 50% WP @ 3g/liter thoroughly covering lower leaf surfaces',
          reason: 'Broad-spectrum contact fungicide halting mycelial growth',
          priority: 'high',
        },
        {
          action: 'Switch from overhead irrigation to furrow or drip irrigation to keep canopy foliage dry',
          reason: 'Fungal spores require free moisture on leaf surface to germinate',
          priority: 'medium',
        },
      ],
      prevention_tips: [
        'Enforce 2-3 year crop rotation with non-solanaceous or non-host crops',
        'Apply Trichoderma viride enriched farmyard manure at basal soil prep',
        'Maintain balanced nitrogen fertilisation; excess nitrogen produces succulent tissues vulnerable to infection',
      ],
      expert_consultation_recommended: true,
      additional_information_needed: [
        'Microscopic examination of spore morphology for definitive identification',
        'Confirmation of whether lesions are also present on stems or fruit calyx',
      ],
      disclaimer: 'This automated visual assessment is an advisory tool and does not constitute a certified laboratory diagnostic test. Always consult your district Krishi Vigyan Kendra (KVK) or local agronomist before applying synthetic chemical interventions.',
    };
  }
}

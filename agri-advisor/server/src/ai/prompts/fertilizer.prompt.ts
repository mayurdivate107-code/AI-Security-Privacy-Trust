export function buildFertilizerPrompt(input: {
  crop_name: string;
  growth_stage: string;
  soil_type: string;
  soil_ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  farm_area: number;
  previous_fertilizer?: string | null;
  organic_available?: boolean | null;
}): string {
  return `Analyze crop requirements, growth stage, soil information, and nutrient values.
- Target Crop: ${input.crop_name}
- Current Growth Stage: ${input.growth_stage}
- Soil Type: ${input.soil_type}
- Soil pH: ${input.soil_ph !== undefined && input.soil_ph !== null ? input.soil_ph : 'Not specified'}
- Available N (Nitrogen): ${input.nitrogen !== undefined && input.nitrogen !== null ? `${input.nitrogen} kg/ha` : 'Unknown'}
- Available P (Phosphorus): ${input.phosphorus !== undefined && input.phosphorus !== null ? `${input.phosphorus} kg/ha` : 'Unknown'}
- Available K (Potassium): ${input.potassium !== undefined && input.potassium !== null ? `${input.potassium} kg/ha` : 'Unknown'}
- Plot Area: ${input.farm_area}
- Previous Fertilizer Applied: ${input.previous_fertilizer || 'None declared'}
- Organic Manure Available: ${input.organic_available ? 'Yes' : 'No or limited'}

Identify possible nutrient deficiencies.
Recommend suitable nutrient management practices.

Consider:
- Soil test results and Liebig's Law of the Minimum.
- Crop growth stage (Basal vs Top dressing).
- Soil pH impact on nutrient availability.
- Organic fertilizer alternatives (FYM, Vermicompost, Bio-NPK).

Differentiate confirmed deficiencies from possible deficiencies.
Recommend soil testing when information is insufficient.
Avoid unsupported precise application rates and unsafe chemical mixing instructions.

Return JSON strictly adhering to schema:
{
  "summary": "string",
  "nutrient_status": [
    {
      "nutrient": "string",
      "status": "low" | "adequate" | "high" | "unknown",
      "explanation": "string"
    }
  ],
  "recommendations": [
    {
      "fertilizer_type": "string",
      "purpose": "string",
      "application_method": "string",
      "timing": "string",
      "dosage_guidance": "string",
      "precautions": ["string"]
    }
  ],
  "organic_alternatives": ["string"],
  "soil_improvement_tips": ["string"],
  "additional_information_needed": ["string"],
  "confidence": number (0.0 to 1.0)
}`;
}

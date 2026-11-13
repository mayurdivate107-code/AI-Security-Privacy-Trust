export function buildDiseaseDetectionPrompt(input: {
  crop_name?: string | null;
  growth_stage?: string | null;
  additional_observations?: string | null;
}): string {
  return `Analyze the uploaded crop image and supplied agricultural details:
- Declared Crop: ${input.crop_name || 'Unspecified by farmer - please identify from leaf if possible'}
- Crop Growth Stage: ${input.growth_stage || 'Unknown'}
- Additional Observations: ${input.additional_observations || 'None'}

Identify visible symptoms and possible agricultural causes.

Possible outcomes:
- Healthy-looking plant.
- Fungal disease.
- Bacterial disease.
- Viral disease.
- Pest damage.
- Nutrient deficiency.
- Environmental stress.
- Uncertain diagnosis.

CRITICAL INSTRUCTIONS:
- Do not claim that visual identification is a laboratory-confirmed diagnosis.
- Describe visible evidence separately from suspected diagnosis.
- Provide practical prevention and management guidance (favor organic remedies alongside standard practices).
- Avoid unsupported chemical dosages.
- If image quality is insufficient, set diagnosis_status to "poor_image" and request a clearer photo.

Return JSON strictly adhering to the schema:
{
  "crop_name": "string",
  "diagnosis_status": "healthy" | "possible_disease" | "possible_pest" | "possible_deficiency" | "environmental_stress" | "uncertain" | "poor_image",
  "primary_diagnosis": "string",
  "possible_alternatives": ["string"],
  "visible_symptoms": ["string"],
  "possible_causes": ["string"],
  "severity": "low" | "moderate" | "high" | "unknown",
  "confidence": number (0.0 to 1.0),
  "explanation": "string",
  "recommended_actions": [
    {
      "action": "string",
      "reason": "string",
      "priority": "low" | "medium" | "high"
    }
  ],
  "prevention_tips": ["string"],
  "expert_consultation_recommended": boolean,
  "additional_information_needed": ["string"],
  "disclaimer": "string"
}`;
}

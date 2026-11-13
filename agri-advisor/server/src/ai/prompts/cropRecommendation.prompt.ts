export function buildCropRecommendationPrompt(input: {
  state: string;
  district: string;
  soil_type: string;
  soil_ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  rainfall?: number | null;
  water_availability: string;
  farm_area: number;
  area_unit: string;
  growing_season: string;
  previous_crop?: string | null;
  preferred_crop_category?: string | null;
  additional_information?: string | null;
}): string {
  return `Analyze the supplied agricultural conditions and recommend suitable crops.

Consider:
- Location: District ${input.district}, State of ${input.state}, India.
- Soil Type: ${input.soil_type}
- Soil pH: ${input.soil_ph !== undefined && input.soil_ph !== null ? input.soil_ph : 'Not measured / Unknown'}
- Available Nitrogen (N): ${input.nitrogen !== undefined && input.nitrogen !== null ? `${input.nitrogen} kg/ha` : 'Not tested'}
- Available Phosphorus (P): ${input.phosphorus !== undefined && input.phosphorus !== null ? `${input.phosphorus} kg/ha` : 'Not tested'}
- Available Potassium (K): ${input.potassium !== undefined && input.potassium !== null ? `${input.potassium} kg/ha` : 'Not tested'}
- Ambient Temperature: ${input.temperature !== undefined && input.temperature !== null ? `${input.temperature} °C` : 'Historical regional average'}
- Relative Humidity: ${input.humidity !== undefined && input.humidity !== null ? `${input.humidity} %` : 'Seasonal norm'}
- Rainfall Expectation: ${input.rainfall !== undefined && input.rainfall !== null ? `${input.rainfall} mm` : 'Seasonal norm'}
- Water Availability: ${input.water_availability}
- Farm Area: ${input.farm_area} ${input.area_unit}
- Target Growing Season: ${input.growing_season}
- Previous Crop: ${input.previous_crop || 'None or not declared'}
- Preferred Category: ${input.preferred_crop_category || 'Any suitable category'}
- Additional Notes: ${input.additional_information || 'None'}

Rank suitable crops based on available evidence.

For every crop:
- Explain suitability.
- Explain soil compatibility.
- Explain climate compatibility.
- Provide estimated growth duration only when supported.
- Explain water requirements.
- Mention cultivation considerations.
- Mention important risks.

Do not invent precise yield or financial projections.
If information is incomplete, clearly explain the uncertainty in data_limitations.

Return JSON strictly adhering to the specified schema:
{
  "summary": "string",
  "overall_confidence": number (0.0 to 1.0),
  "data_limitations": ["string"],
  "recommended_crops": [
    {
      "crop_name": "string",
      "scientific_name": "string",
      "suitability_score": integer (0 to 100),
      "reason": "string",
      "soil_compatibility": "string",
      "climate_compatibility": "string",
      "water_requirements": "string",
      "growing_duration_days": integer or null,
      "suitable_seasons": ["string"],
      "cultivation_tips": ["string"],
      "potential_risks": ["string"]
    }
  ],
  "additional_recommendations": ["string"]
}`;
}

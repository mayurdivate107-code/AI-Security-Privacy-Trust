export function buildIrrigationPrompt(input: {
  crop_name: string;
  growth_stage: string;
  soil_type: string;
  farm_area: number;
  irrigation_method: string;
  water_source?: string | null;
  recent_rainfall?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  water_availability: string;
}): string {
  return `Analyze the crop, growth stage, soil type, farm area, irrigation method, water availability, and supplied weather parameters:
- Crop: ${input.crop_name}
- Growth Stage: ${input.growth_stage}
- Soil Type: ${input.soil_type}
- Farm Area: ${input.farm_area}
- Existing Irrigation Method: ${input.irrigation_method}
- Water Source: ${input.water_source || 'Unspecified'}
- Recent Rainfall: ${input.recent_rainfall !== undefined && input.recent_rainfall !== null ? `${input.recent_rainfall} mm` : 'No rainfall measured'}
- Temperature: ${input.temperature !== undefined && input.temperature !== null ? `${input.temperature} °C` : 'Historical baseline'}
- Humidity: ${input.humidity !== undefined && input.humidity !== null ? `${input.humidity} %` : 'Not provided'}
- Water Availability: ${input.water_availability}

Provide practical irrigation guidance.

Consider:
- Crop water requirements across current development stage.
- Soil water retention capacity.
- Rainfall buffer.
- Evapotranspiration risk under current temperature.
- Water conservation and prevention of waterlogging.

Do not invent real-time weather conditions. Clearly distinguish supplied weather information from assumptions.

Return JSON strictly matching the schema:
{
  "summary": "string",
  "irrigation_status": "adequate" | "insufficient" | "excessive" | "unknown",
  "recommended_method": "string",
  "watering_frequency": "string",
  "water_management_tips": ["string"],
  "growth_stage_considerations": ["string"],
  "overwatering_risks": ["string"],
  "underwatering_risks": ["string"],
  "water_conservation_tips": ["string"],
  "weather_data_used": boolean,
  "additional_information_needed": ["string"],
  "confidence": number (0.0 to 1.0)
}`;
}

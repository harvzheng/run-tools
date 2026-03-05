import type { ToolConfig } from "@/lib/types";

export interface WeatherGearState {
  intensity: string;
  tempUnit: string;
  windUnit: string;
  manualTemp: number;
  useManualTemp: boolean;
}

export const config: ToolConfig<WeatherGearState> = {
  slug: "weather-gear",
  name: "Weather gear",
  description: "What to wear for your run based on current weather",
  icon: "CloudSun",
  accent: "from-sky-500 to-sky-600",
  tags: ["weather", "clothing", "gear"],
  defaultInputs: {
    intensity: "easy",
    tempUnit: "F",
    windUnit: "mph",
    manualTemp: 55,
    useManualTemp: false,
  },
};

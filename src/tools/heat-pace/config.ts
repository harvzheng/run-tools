import type { ToolConfig } from "@/lib/types";

export interface HeatPaceState {
  paceMinKm: number;
  temperature: number;
  tempUnit: string;
  dewPoint: number; // in same unit as temperature
}

export const config: ToolConfig<HeatPaceState> = {
  slug: "heat-pace",
  name: "Heat pace converter",
  description: "Adjust your target pace for hot weather",
  icon: "Thermometer",
  accent: "from-orange-500 to-orange-600",
  tags: ["heat", "pace", "weather"],
  defaultInputs: {
    paceMinKm: 300, // 5:00/km in seconds
    temperature: 80,
    tempUnit: "F",
    dewPoint: 65, // 65 °F — warm summer day
  },
};

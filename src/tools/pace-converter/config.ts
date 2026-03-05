import type { ToolConfig } from "@/lib/types";

export interface PaceState {
  paceMinKm: number;
  customDistance: number;
  customDistanceUnit: string;
}

export const config: ToolConfig<PaceState> = {
  slug: "pace-converter",
  name: "Pace converter",
  description: "Convert between pace and speed formats",
  icon: "Timer",
  accent: "from-brand-500 to-brand-600",
  tags: ["pace", "speed", "conversion"],
  defaultInputs: {
    paceMinKm: 300, // 5:00/km in seconds
    customDistance: 5,
    customDistanceUnit: "km",
  },
};

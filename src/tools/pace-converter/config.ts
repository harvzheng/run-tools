import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "pace-converter",
  name: "Pace converter",
  description: "Convert between pace and speed formats",
  icon: "Timer",
  tags: ["pace", "speed", "conversion"],
  defaultInputs: {
    paceMinKm: 300, // 5:00/km in seconds
    customDistance: 5,
    customDistanceUnit: "km",
  },
};

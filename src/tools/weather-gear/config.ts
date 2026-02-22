import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "weather-gear",
  name: "Weather gear",
  description: "What to wear for your run based on current weather",
  icon: "CloudSun",
  tags: ["weather", "clothing", "gear"],
  defaultInputs: {
    intensity: "easy",
    tempUnit: "F",
    windUnit: "mph",
    manualTemp: 55,
    useManualTemp: false,
  },
};

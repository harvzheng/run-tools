import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "treadmill-pace",
  name: "Treadmill pace converter",
  description: "Convert treadmill speed and incline to outdoor pace",
  icon: "Gauge",
  tags: ["treadmill", "pace", "incline"],
  defaultInputs: {
    speed: 10,
    speedUnit: "km/h",
    incline: 1,
  },
};

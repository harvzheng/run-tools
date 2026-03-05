import type { ToolConfig } from "@/lib/types";

export interface TreadmillState {
  speed: number;
  speedUnit: string;
  incline: number;
}

export const config: ToolConfig<TreadmillState> = {
  slug: "treadmill-pace",
  name: "Treadmill pace converter",
  description: "Convert treadmill speed and incline to outdoor pace",
  icon: "Gauge",
  accent: "from-amber-500 to-amber-600",
  tags: ["treadmill", "pace", "incline"],
  defaultInputs: {
    speed: 10,
    speedUnit: "km/h",
    incline: 1,
  },
};

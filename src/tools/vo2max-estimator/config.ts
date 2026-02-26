import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "vo2max-estimator",
  name: "VO2max estimator",
  description: "Estimate your aerobic fitness from any training run using pace and heart rate",
  icon: "Activity",
  tags: ["training", "heart rate", "fitness"],
  defaultInputs: {
    inputMode: "pace",
    paceMinutes: 5,
    paceSeconds: 0,
    paceUnit: "min/km",
    tdMinutes: 20,
    tdSeconds: 0,
    tdDistance: 5,
    tdDistanceUnit: "km",
    avgHR: 150,
    maxHR: 190,
    restHR: 50,
  },
};

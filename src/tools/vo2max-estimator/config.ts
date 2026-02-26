import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "vo2max-estimator",
  name: "VO2max estimator",
  description: "Estimate your aerobic fitness from any training run using pace and heart rate",
  icon: "Activity",
  tags: ["training", "heart rate", "fitness"],
  defaultInputs: {
    paceMinutes: 5,
    paceSeconds: 0,
    paceUnit: "min/km",
    avgHR: 150,
    maxHR: 190,
    restHR: 50,
  },
};

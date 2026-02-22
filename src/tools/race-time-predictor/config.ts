import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "race-time-predictor",
  name: "Race time predictor",
  description: "Project race results from a recent performance",
  icon: "Activity",
  tags: ["race", "prediction", "training"],
  defaultInputs: {
    baseTimeSeconds: 1500,
    baseDistance: 5,
    baseDistanceUnit: "km",
    exponent: 1.06,
    targetDistance: 10,
    targetDistanceUnit: "km",
  },
};

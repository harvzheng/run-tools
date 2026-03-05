import type { ToolConfig } from "@/lib/types";

export interface RaceTimeState {
  baseTimeSeconds: number;
  baseDistance: number;
  baseDistanceUnit: string;
  exponent: number;
  targetDistance: number;
  targetDistanceUnit: string;
}

export const config: ToolConfig<RaceTimeState> = {
  slug: "race-time-predictor",
  name: "Race time predictor",
  description: "Project race results from a recent performance",
  icon: "Activity",
  accent: "from-emerald-500 to-emerald-600",
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

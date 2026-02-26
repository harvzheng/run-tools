import type { ToolConfig } from "@/lib/types";
import { config as hrZones } from "./hr-zones/config";
import { config as paceConverter } from "./pace-converter/config";
import { config as weatherGear } from "./weather-gear/config";
import { config as raceTimePredictor } from "./race-time-predictor/config";
import { config as splitCalculator } from "./split-calculator/config";
import { config as treadmillPace } from "./treadmill-pace/config";
import { config as vo2maxEstimator } from "./vo2max-estimator/config";

export const tools: ToolConfig[] = [
  hrZones,
  paceConverter,
  weatherGear,
  raceTimePredictor,
  splitCalculator,
  treadmillPace,
  vo2maxEstimator,
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

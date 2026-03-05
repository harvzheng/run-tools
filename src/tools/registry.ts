import type { ToolConfig } from "@/lib/types";
import dynamic from "next/dynamic";
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

export const toolComponents: Record<string, ReturnType<typeof dynamic>> = {
  "hr-zones": dynamic(() => import("@/tools/hr-zones/component")),
  "pace-converter": dynamic(() => import("@/tools/pace-converter/component")),
  "weather-gear": dynamic(() => import("@/tools/weather-gear/component")),
  "race-time-predictor": dynamic(
    () => import("@/tools/race-time-predictor/component"),
  ),
  "split-calculator": dynamic(
    () => import("@/tools/split-calculator/component"),
  ),
  "treadmill-pace": dynamic(() => import("@/tools/treadmill-pace/component")),
  "vo2max-estimator": dynamic(
    () => import("@/tools/vo2max-estimator/component"),
  ),
};

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

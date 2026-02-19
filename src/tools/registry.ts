import type { ToolConfig } from "@/lib/types";
import { config as hrZones } from "./hr-zones/config";
import { config as paceConverter } from "./pace-converter/config";
import { config as weatherGear } from "./weather-gear/config";

export const tools: ToolConfig[] = [hrZones, paceConverter, weatherGear];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

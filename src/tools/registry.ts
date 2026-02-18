import type { ToolConfig } from "@/lib/types";
import { config as hrZones } from "./hr-zones/config";
import { config as paceConverter } from "./pace-converter/config";

export const tools: ToolConfig[] = [hrZones, paceConverter];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

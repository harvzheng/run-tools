import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "split-calculator",
  name: "Split calculator",
  description: "Plan even, negative, or positive race splits",
  icon: "Footprints",
  tags: ["splits", "pace", "race"],
  defaultInputs: {
    distance: 10,
    distanceUnit: "km",
    totalTimeSeconds: 3000,
    splitUnit: "km",
    strategy: "even",
  },
};

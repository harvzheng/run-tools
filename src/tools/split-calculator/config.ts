import type { ToolConfig } from "@/lib/types";

export interface SplitState {
  distance: number;
  distanceUnit: string;
  totalTimeSeconds: number;
  splitUnit: string;
  strategy: string;
}

export const config: ToolConfig<SplitState> = {
  slug: "split-calculator",
  name: "Split calculator",
  description: "Plan even, negative, or positive race splits",
  icon: "Footprints",
  accent: "from-violet-500 to-violet-600",
  tags: ["splits", "pace", "race"],
  defaultInputs: {
    distance: 10,
    distanceUnit: "km",
    totalTimeSeconds: 3000,
    splitUnit: "km",
    strategy: "even",
  },
};

import type { ToolConfig } from "@/lib/types";

export interface HRZonesState {
  age: number;
  restingHR: number;
  maxHR: number;
  lthr: number;
  method: string;
}

export const config: ToolConfig<HRZonesState> = {
  slug: "hr-zones",
  name: "Heart rate zones",
  description: "Calculate your training zones by heart rate",
  icon: "Heart",
  accent: "from-rose-500 to-rose-600",
  tags: ["training", "heart rate"],
  defaultInputs: {
    age: 30,
    restingHR: 60,
    maxHR: 190,
    lthr: 170,
    method: "max-hr",
  },
};

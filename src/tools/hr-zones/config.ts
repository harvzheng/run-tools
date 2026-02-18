import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "hr-zones",
  name: "Heart Rate Zones",
  description: "Calculate your training zones by heart rate",
  icon: "Heart",
  tags: ["training", "heart rate"],
  defaultInputs: {
    age: 30,
    restingHR: 60,
    maxHR: 190,
    lthr: 170,
    method: "max-hr",
  },
};

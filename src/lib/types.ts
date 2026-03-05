// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ToolConfig<T extends Record<string, any> = Record<string, any>> {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  tags: string[];
  defaultInputs: T;
}

export interface Zone {
  name: string;
  label: string;
  min: number;
  max: number;
  color: string;
}

export type PaceUnit = "min/mi" | "min/km" | "mph" | "km/h";

export interface RaceTimes {
  "5K": string;
  "10K": string;
  "Half Marathon": string;
  Marathon: string;
}

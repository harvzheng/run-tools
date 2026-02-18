import type { Zone } from "@/lib/types";

export type HRMethod = "max-hr" | "karvonen" | "lthr";

const ZONE_DEFS = [
  { name: "z1", label: "Easy / Recovery", color: "#3b82f6" },
  { name: "z2", label: "Aerobic / Endurance", color: "#22c55e" },
  { name: "z3", label: "Tempo", color: "#eab308" },
  { name: "z4", label: "Threshold", color: "#f97316" },
  { name: "z5", label: "VO2max / Anaerobic", color: "#ef4444" },
];

const MAX_HR_PERCENTS = [
  [0.5, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.0],
];

const KARVONEN_PERCENTS = [
  [0.5, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.0],
];

const LTHR_PERCENTS = [
  [0.65, 0.81],
  [0.81, 0.9],
  [0.9, 0.95],
  [0.95, 1.0],
  [1.0, 1.06],
];

export function calculateMaxHR(age: number): number {
  return Math.round(220 - age);
}

export function calculateZonesMaxHR(maxHR: number): Zone[] {
  return ZONE_DEFS.map((def, i) => ({
    ...def,
    min: Math.round(maxHR * MAX_HR_PERCENTS[i][0]),
    max: Math.round(maxHR * MAX_HR_PERCENTS[i][1]),
  }));
}

export function calculateZonesKarvonen(
  maxHR: number,
  restingHR: number,
): Zone[] {
  const hrr = maxHR - restingHR;
  return ZONE_DEFS.map((def, i) => ({
    ...def,
    min: Math.round(hrr * KARVONEN_PERCENTS[i][0] + restingHR),
    max: Math.round(hrr * KARVONEN_PERCENTS[i][1] + restingHR),
  }));
}

export function calculateZonesLTHR(lthr: number): Zone[] {
  return ZONE_DEFS.map((def, i) => ({
    ...def,
    min: Math.round(lthr * LTHR_PERCENTS[i][0]),
    max: Math.round(lthr * LTHR_PERCENTS[i][1]),
  }));
}

export function calculateZones(
  method: HRMethod,
  maxHR: number,
  restingHR: number,
  lthr: number,
): Zone[] {
  switch (method) {
    case "max-hr":
      return calculateZonesMaxHR(maxHR);
    case "karvonen":
      return calculateZonesKarvonen(maxHR, restingHR);
    case "lthr":
      return calculateZonesLTHR(lthr);
  }
}

export function formatZonesAsText(zones: Zone[], method: string): string {
  const header = `Heart Rate Zones (${method})`;
  const lines = zones.map(
    (z, i) => `Z${i + 1} ${z.label}: ${z.min}–${z.max} bpm`,
  );
  return [header, ...lines].join("\n");
}

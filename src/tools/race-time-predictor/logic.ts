import { formatTime } from "@/lib/utils";

export const KM_PER_MILE = 1.609344;

export const RACE_DISTANCES_KM: { name: string; distanceKm: number }[] = [
  { name: "5K", distanceKm: 5 },
  { name: "10K", distanceKm: 10 },
  { name: "Half Marathon", distanceKm: 21.0975 },
  { name: "Marathon", distanceKm: 42.195 },
];

export const DEFAULT_RIEGEL_EXPONENT = 1.06;

export function timeToSeconds(time: string): number {
  const parts = time.trim().split(":");
  if (parts.length === 3) {
    return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
  }
  if (parts.length === 2) {
    return Number(parts[0]) * 60 + Number(parts[1]);
  }
  return Number(time);
}

export function predictTime(
  baseSeconds: number,
  baseDistanceKm: number,
  targetDistanceKm: number,
  exponent: number = DEFAULT_RIEGEL_EXPONENT,
): number {
  if (baseSeconds <= 0 || baseDistanceKm <= 0 || targetDistanceKm <= 0) {
    return NaN;
  }
  const ratio = targetDistanceKm / baseDistanceKm;
  return baseSeconds * Math.pow(ratio, exponent);
}

export function formatPrediction(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "--:--";
  return formatTime(seconds);
}

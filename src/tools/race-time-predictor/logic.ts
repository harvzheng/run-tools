import { KM_PER_MILE, RACE_DISTANCES } from "@/lib/constants";
import { formatTime, timeToSeconds } from "@/lib/utils";

export { KM_PER_MILE, RACE_DISTANCES, timeToSeconds };

export const DEFAULT_RIEGEL_EXPONENT = 1.06;

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

import { formatPace } from "@/lib/utils";

/** Baseline temperature in °F where no pace adjustment is needed. */
export const BASELINE_F = 60;

/**
 * Convert Celsius to Fahrenheit.
 */
export function cToF(c: number): number {
  return c * 1.8 + 32;
}

/**
 * Convert Fahrenheit to Celsius.
 */
export function fToC(f: number): number {
  return (f - 32) / 1.8;
}

/**
 * Calculate the heat slowdown percentage for a given temperature in °F.
 *
 * Below the baseline (60 °F / ~15.5 °C) there is no adjustment.
 * Above the baseline the slowdown increases quadratically:
 *   slowdown = 0.003 × d + 0.00005 × d²
 * where d = °F above baseline.
 *
 * This approximates commonly cited coaching guidance:
 *   65 °F → ~1.6 %, 75 °F → ~5.6 %, 85 °F → ~10.6 %, 95 °F → ~16.6 %
 */
export function heatSlowdownPct(tempF: number): number {
  const d = tempF - BASELINE_F;
  if (d <= 0) return 0;
  return 0.003 * d + 0.00005 * d * d;
}

export interface HeatPaceResult {
  slowdownPct: number;
  adjustedPaceSecPerKm: number;
  adjustedPaceSecPerMi: number;
  originalPaceSecPerKm: number;
  originalPaceSecPerMi: number;
}

const KM_PER_MILE = 1.609344;

/**
 * Calculate heat-adjusted pace given a base pace and temperature.
 *
 * @param paceSecPerKm  Base pace in seconds per kilometer
 * @param tempF         Temperature in Fahrenheit
 */
export function adjustPaceForHeat(
  paceSecPerKm: number,
  tempF: number,
): HeatPaceResult {
  const slowdownPct = heatSlowdownPct(tempF);
  const adjustedPaceSecPerKm = paceSecPerKm * (1 + slowdownPct);
  const originalPaceSecPerMi = paceSecPerKm * KM_PER_MILE;
  const adjustedPaceSecPerMi = adjustedPaceSecPerKm * KM_PER_MILE;

  return {
    slowdownPct,
    adjustedPaceSecPerKm,
    adjustedPaceSecPerMi,
    originalPaceSecPerKm: paceSecPerKm,
    originalPaceSecPerMi,
  };
}

/**
 * Format seconds-per-unit as "M:SS". Returns "--:--" for invalid values.
 */
export function formatPaceValue(secondsPerUnit: number): string {
  if (!isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "--:--";
  return formatPace(secondsPerUnit);
}

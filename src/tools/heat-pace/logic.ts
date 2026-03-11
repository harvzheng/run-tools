import { formatPace } from "@/lib/utils";

/**
 * Baseline combined temperature + dew point (°F) below which no adjustment is needed.
 * Based on Mantzios et al. (2022) Med Sci Sports Exerc 54(1):153–161.
 * At combined ≤ 130 (e.g. 70 °F / 60 °F DP), conditions are comfortable for racing.
 */
export const BASELINE_COMBINED_F = 130;

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
 * Calculate the heat slowdown percentage given temperature and dew point in °F.
 *
 * Uses the Temperature + Dew Point combined-value method from:
 *   Mantzios et al. (2022) Effects of Weather Parameters on Endurance Running
 *   Performance. Med Sci Sports Exerc 54(1):153–161. PMID 34652333.
 *
 * combined = tempF + dewPointF
 * Below the baseline (combined ≤ 130) there is no adjustment.
 * Above the baseline each combined degree adds 0.2 %:
 *   slowdown = 0.002 × (combined − 130)
 *
 * Approximate reference values:
 *   70 °F / 60 °F DP  → combined 130 → 0 %
 *   75 °F / 65 °F DP  → combined 140 → 2 %
 *   80 °F / 70 °F DP  → combined 150 → 4 %
 *   85 °F / 75 °F DP  → combined 160 → 6 %
 *   90 °F / 75 °F DP  → combined 165 → 7 %
 *   90 °F / 80 °F DP  → combined 170 → 8 %
 */
export function heatSlowdownPct(tempF: number, dewPointF: number): number {
  const combined = tempF + dewPointF;
  const d = combined - BASELINE_COMBINED_F;
  if (d <= 0) return 0;
  return 0.002 * d;
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
 * Calculate heat-adjusted pace given a base pace, temperature, and dew point.
 *
 * @param paceSecPerKm  Base pace in seconds per kilometer
 * @param tempF         Temperature in Fahrenheit
 * @param dewPointF     Dew point in Fahrenheit
 */
export function adjustPaceForHeat(
  paceSecPerKm: number,
  tempF: number,
  dewPointF: number,
): HeatPaceResult {
  const slowdownPct = heatSlowdownPct(tempF, dewPointF);
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

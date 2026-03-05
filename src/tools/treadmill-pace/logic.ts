import { KM_PER_MILE } from "@/lib/constants";
import { formatPace } from "@/lib/utils";

export { KM_PER_MILE };

export type SpeedUnit = "mph" | "km/h";

export interface TreadmillResult {
  flatSpeedKmh: number;
  flatSpeedMph: number;
  paceSecondsPerKm: number;
  paceSecondsPerMi: number;
}

export function equivalentFlatSpeed(
  speed: number,
  unit: SpeedUnit,
  inclinePercent: number,
): TreadmillResult {
  const speedMpm = speedToMetersPerMinute(speed, unit);
  const grade = inclinePercent / 100;
  const vo2 = 0.2 * speedMpm + 0.9 * speedMpm * grade + 3.5;
  const flatMpm = (vo2 - 3.5) / 0.2;

  const flatSpeedKmh = metersPerMinuteToKmh(flatMpm);
  const flatSpeedMph = flatSpeedKmh / KM_PER_MILE;
  const paceSecondsPerKm = 3600 / flatSpeedKmh;
  const paceSecondsPerMi = 3600 / flatSpeedMph;

  return { flatSpeedKmh, flatSpeedMph, paceSecondsPerKm, paceSecondsPerMi };
}

export function formatPaceValue(secondsPerUnit: number): string {
  if (!isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "--:--";
  return formatPace(secondsPerUnit);
}

function speedToMetersPerMinute(speed: number, unit: SpeedUnit): number {
  if (unit === "km/h") return (speed * 1000) / 60;
  return (speed * KM_PER_MILE * 1000) / 60;
}

function metersPerMinuteToKmh(speedMpm: number): number {
  return (speedMpm * 60) / 1000;
}

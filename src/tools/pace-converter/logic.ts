import type { PaceUnit, RaceTimes } from "@/lib/types";
import { formatTime, formatPace } from "@/lib/utils";

const KM_PER_MILE = 1.609344;

const RACE_DISTANCES_KM: Record<string, number> = {
  "5K": 5,
  "10K": 10,
  "Half Marathon": 21.0975,
  Marathon: 42.195,
};

/**
 * Parse a pace string like "8:30" into total seconds.
 * Also accepts plain numbers (e.g. "510" = 510 seconds).
 */
export function paceToSeconds(pace: string): number {
  const trimmed = pace.trim();
  if (trimmed.includes(":")) {
    const [min, sec] = trimmed.split(":");
    return Number(min) * 60 + Number(sec || 0);
  }
  return Number(trimmed);
}

/**
 * Convert total seconds back to "M:SS" format.
 */
export function secondsToPace(seconds: number): string {
  return formatPace(seconds);
}

/**
 * Convert a pace/speed value from one unit to another.
 * Pace units (min/mi, min/km) are in seconds.
 * Speed units (mph, km/h) are in their native unit.
 */
export function convertPace(
  value: number,
  from: PaceUnit,
  to: PaceUnit,
): number {
  // Normalize everything to seconds per km
  const secPerKm = toSecondsPerKm(value, from);
  return fromSecondsPerKm(secPerKm, to);
}

function toSecondsPerKm(value: number, unit: PaceUnit): number {
  switch (unit) {
    case "min/km":
      return value; // already seconds per km
    case "min/mi":
      return value / KM_PER_MILE; // seconds per mile → seconds per km
    case "km/h":
      return 3600 / value; // km/h → seconds per km
    case "mph":
      return 3600 / (value * KM_PER_MILE); // mph → km/h → seconds per km
  }
}

function fromSecondsPerKm(secPerKm: number, unit: PaceUnit): number {
  switch (unit) {
    case "min/km":
      return secPerKm;
    case "min/mi":
      return secPerKm * KM_PER_MILE;
    case "km/h":
      return 3600 / secPerKm;
    case "mph":
      return 3600 / secPerKm / KM_PER_MILE;
  }
}

/**
 * Calculate race finish times from pace in seconds per km.
 */
export function calculateRaceTimes(secPerKm: number): RaceTimes {
  const result: Record<string, string> = {};
  for (const [race, distKm] of Object.entries(RACE_DISTANCES_KM)) {
    const totalSeconds = secPerKm * distKm;
    result[race] = formatTime(totalSeconds);
  }
  return result as unknown as RaceTimes;
}

/**
 * Format a speed value for display.
 * Pace units → "M:SS", speed units → decimal with 1 decimal place.
 */
export function formatValue(value: number, unit: PaceUnit): string {
  if (unit === "min/km" || unit === "min/mi") {
    return secondsToPace(value);
  }
  return value.toFixed(1);
}

/**
 * Parse a display string back to a numeric value for the given unit.
 */
export function parseValue(input: string, unit: PaceUnit): number {
  if (unit === "min/km" || unit === "min/mi") {
    return paceToSeconds(input);
  }
  return Number(input);
}

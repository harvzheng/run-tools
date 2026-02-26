export type PaceUnit = "min/km" | "min/mi";
export type DistanceUnit = "km" | "mi";

export interface VO2maxInput {
  paceMinutes: number;
  paceSeconds: number;
  paceUnit: PaceUnit;
  /** Optional speed override (m/min) — used when input is time + distance instead of pace */
  speedMPerMin?: number;
  avgHR: number;
  maxHR: number;
  restHR: number;
}

export interface VO2maxResult {
  vo2max: number;
  fitnessLabel: string;
  percentVO2max: number;
  warning: string | null;
}

const MI_TO_KM = 1.60934;

/** Convert pace (min + sec per km or mi) to speed in m/min */
export function paceToMetersPerMin(
  minutes: number,
  seconds: number,
  unit: PaceUnit,
): number {
  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) return 0;
  const distanceMeters = unit === "min/km" ? 1000 : MI_TO_KM * 1000;
  // convert distance/seconds → distance/minute
  return (distanceMeters / totalSeconds) * 60;
}

/** Convert a total run time + distance to speed in m/min */
export function timeDistanceToMetersPerMin(
  totalMinutes: number,
  totalSeconds: number,
  distance: number,
  unit: DistanceUnit,
): number {
  const secs = totalMinutes * 60 + totalSeconds;
  if (secs <= 0 || distance <= 0) return 0;
  const distanceMeters = unit === "km" ? distance * 1000 : distance * MI_TO_KM * 1000;
  return (distanceMeters / secs) * 60;
}

/** Daniels-Gilbert oxygen cost at a given running speed (m/min) */
export function vo2AtPace(speedMPerMin: number): number {
  return -4.60 + 0.182258 * speedMPerMin + 0.000104 * speedMPerMin ** 2;
}

/** Fraction of HRR (Karvonen method) */
export function hrrFraction(avgHR: number, maxHR: number, restHR: number): number {
  const hrr = maxHR - restHR;
  if (hrr <= 0) return 0;
  return (avgHR - restHR) / hrr;
}

/** Fitness label based on VO2max bands used by Runalyze */
export function fitnessLabel(vo2max: number): string {
  if (vo2max < 30) return "Beginner";
  if (vo2max < 40) return "Recreational";
  if (vo2max < 50) return "Intermediate";
  if (vo2max < 60) return "Advanced";
  if (vo2max < 70) return "Sub-elite";
  return "Elite";
}

/** Estimate effective VO2max from pace + heart rate data */
export function estimateVO2max(input: VO2maxInput): VO2maxResult {
  const { paceMinutes, paceSeconds, paceUnit, avgHR, maxHR, restHR } = input;

  const speedMPerMin =
    input.speedMPerMin ?? paceToMetersPerMin(paceMinutes, paceSeconds, paceUnit);
  const vo2AtSpeed = vo2AtPace(speedMPerMin);
  const percentVO2max = hrrFraction(avgHR, maxHR, restHR);

  const rawVO2max =
    percentVO2max > 0 ? vo2AtSpeed / percentVO2max : 0;

  // Clamp to physiological range
  const vo2max = Math.min(90, Math.max(20, rawVO2max));

  // Warning conditions
  let warning: string | null = null;
  if (percentVO2max < 0.55) {
    warning =
      "HR effort is very easy (< 55% HRR) — estimate may be less accurate. Best results come from steady aerobic runs.";
  }

  return {
    vo2max: Math.round(vo2max * 10) / 10,
    fitnessLabel: fitnessLabel(vo2max),
    percentVO2max: Math.round(percentVO2max * 1000) / 10,
    warning,
  };
}

import { formatPace, formatTime } from "@/lib/utils";

export const KM_PER_MILE = 1.609344;

export type SplitStrategy = "even" | "negative" | "positive";

export interface SplitSegment {
  index: number;
  distanceKm: number;
  splitSeconds: number;
  cumulativeSeconds: number;
  paceSecondsPerKm: number;
}

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

export function calculateSplits(
  distanceKm: number,
  totalSeconds: number,
  splitLengthKm: number,
  strategy: SplitStrategy,
  delta: number = 0.06,
): SplitSegment[] {
  if (distanceKm <= 0 || totalSeconds <= 0 || splitLengthKm <= 0) return [];

  const segments: number[] = [];
  let remaining = distanceKm;
  while (remaining > 0) {
    const segmentDistance = Math.min(splitLengthKm, remaining);
    segments.push(segmentDistance);
    remaining -= segmentDistance;
  }

  const weights = buildWeights(segments.length, strategy, delta);
  const weightedDistance = segments.reduce(
    (sum, d, i) => sum + d * weights[i],
    0,
  );

  const basePaceSecondsPerKm = totalSeconds / weightedDistance;

  let cumulative = 0;
  return segments.map((segmentDistance, index) => {
    const splitSeconds =
      basePaceSecondsPerKm * segmentDistance * weights[index];
    cumulative += splitSeconds;
    return {
      index,
      distanceKm: segmentDistance,
      splitSeconds,
      cumulativeSeconds: cumulative,
      paceSecondsPerKm: basePaceSecondsPerKm * weights[index],
    };
  });
}

export function formatSplitTime(seconds: number): string {
  return formatTime(seconds);
}

export function formatSplitPace(secondsPerKm: number): string {
  return formatPace(secondsPerKm);
}

function buildWeights(
  count: number,
  strategy: SplitStrategy,
  delta: number,
): number[] {
  if (count <= 1 || strategy === "even") {
    return Array.from({ length: count }, () => 1);
  }

  return Array.from({ length: count }, (_, i) => {
    const x = (i / (count - 1)) * 2 - 1; // -1..1
    if (strategy === "negative") return 1 - delta * x;
    return 1 + delta * x;
  });
}

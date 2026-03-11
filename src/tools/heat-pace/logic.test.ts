import { describe, it, expect } from "vitest";
import {
  cToF,
  fToC,
  heatSlowdownPct,
  adjustPaceForHeat,
  formatPaceValue,
  BASELINE_COMBINED_F,
} from "./logic";

describe("cToF / fToC", () => {
  it("converts 0 °C to 32 °F", () => {
    expect(cToF(0)).toBeCloseTo(32);
  });

  it("converts 100 °C to 212 °F", () => {
    expect(cToF(100)).toBeCloseTo(212);
  });

  it("round-trips correctly", () => {
    expect(fToC(cToF(25))).toBeCloseTo(25);
  });
});

describe("heatSlowdownPct", () => {
  it("returns 0 when combined T+DP is at or below baseline (130 °F)", () => {
    // 70 °F temp + 60 °F DP = 130 — exactly at baseline
    expect(heatSlowdownPct(70, 60)).toBe(0);
    // well below baseline
    expect(heatSlowdownPct(60, 50)).toBe(0);
    expect(heatSlowdownPct(50, 40)).toBe(0);
  });

  it("returns positive slowdown when combined exceeds baseline", () => {
    expect(heatSlowdownPct(75, 65)).toBeGreaterThan(0); // combined 140
    expect(heatSlowdownPct(80, 70)).toBeGreaterThan(0); // combined 150
    expect(heatSlowdownPct(90, 75)).toBeGreaterThan(0); // combined 165
  });

  it("increases as combined T+DP increases", () => {
    const s1 = heatSlowdownPct(75, 65); // combined 140
    const s2 = heatSlowdownPct(80, 70); // combined 150
    const s3 = heatSlowdownPct(85, 75); // combined 160
    expect(s2).toBeGreaterThan(s1);
    expect(s3).toBeGreaterThan(s2);
  });

  it("matches expected values from T+DP method (Mantzios 2022)", () => {
    // combined 140 → d=10 → 0.002 × 10 = 2 %
    expect(heatSlowdownPct(75, 65)).toBeCloseTo(0.02, 3);
    // combined 150 → d=20 → 0.002 × 20 = 4 %
    expect(heatSlowdownPct(80, 70)).toBeCloseTo(0.04, 3);
    // combined 160 → d=30 → 0.002 × 30 = 6 %
    expect(heatSlowdownPct(85, 75)).toBeCloseTo(0.06, 3);
    // combined 170 → d=40 → 0.002 × 40 = 8 %
    expect(heatSlowdownPct(90, 80)).toBeCloseTo(0.08, 3);
  });

  it("same combined value gives same slowdown regardless of split", () => {
    // 80+70 = 150, same as 75+75 = 150
    expect(heatSlowdownPct(80, 70)).toBeCloseTo(heatSlowdownPct(75, 75), 6);
  });

  it("BASELINE_COMBINED_F constant is 130", () => {
    expect(BASELINE_COMBINED_F).toBe(130);
  });
});

describe("adjustPaceForHeat", () => {
  const basePace = 300; // 5:00/km

  it("returns unchanged pace at baseline conditions", () => {
    const result = adjustPaceForHeat(basePace, 70, 60); // combined 130
    expect(result.adjustedPaceSecPerKm).toBe(basePace);
    expect(result.slowdownPct).toBe(0);
  });

  it("returns slower pace in hot and humid conditions", () => {
    const result = adjustPaceForHeat(basePace, 85, 75); // combined 160 → 6%
    expect(result.adjustedPaceSecPerKm).toBeGreaterThan(basePace);
    expect(result.slowdownPct).toBeCloseTo(0.06, 3);
  });

  it("calculates mi pace as km pace × 1.609344", () => {
    const result = adjustPaceForHeat(basePace, 80, 70);
    expect(result.adjustedPaceSecPerMi).toBeCloseTo(
      result.adjustedPaceSecPerKm * 1.609344,
      2,
    );
  });
});

describe("formatPaceValue", () => {
  it("formats 300 seconds as 5:00", () => {
    expect(formatPaceValue(300)).toBe("5:00");
  });

  it("formats 330 seconds as 5:30", () => {
    expect(formatPaceValue(330)).toBe("5:30");
  });

  it("returns --:-- for invalid values", () => {
    expect(formatPaceValue(-1)).toBe("--:--");
    expect(formatPaceValue(Infinity)).toBe("--:--");
    expect(formatPaceValue(0)).toBe("--:--");
  });
});

import { describe, it, expect } from "vitest";
import {
  cToF,
  fToC,
  heatSlowdownPct,
  adjustPaceForHeat,
  formatPaceValue,
  BASELINE_F,
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
  it("returns 0 at or below baseline (60 °F)", () => {
    expect(heatSlowdownPct(60)).toBe(0);
    expect(heatSlowdownPct(50)).toBe(0);
    expect(heatSlowdownPct(0)).toBe(0);
  });

  it("returns positive slowdown above baseline", () => {
    expect(heatSlowdownPct(65)).toBeGreaterThan(0);
    expect(heatSlowdownPct(80)).toBeGreaterThan(0);
    expect(heatSlowdownPct(95)).toBeGreaterThan(0);
  });

  it("increases with temperature", () => {
    const s70 = heatSlowdownPct(70);
    const s80 = heatSlowdownPct(80);
    const s90 = heatSlowdownPct(90);
    expect(s80).toBeGreaterThan(s70);
    expect(s90).toBeGreaterThan(s80);
  });

  it("matches expected approximate values", () => {
    // 70 °F → d=10 → 0.03 + 0.005 = 3.5%
    expect(heatSlowdownPct(70)).toBeCloseTo(0.035, 2);
    // 80 °F → d=20 → 0.06 + 0.02 = 8%
    expect(heatSlowdownPct(80)).toBeCloseTo(0.08, 2);
    // 90 °F → d=30 → 0.09 + 0.045 = 13.5%
    expect(heatSlowdownPct(90)).toBeCloseTo(0.135, 2);
  });
});

describe("adjustPaceForHeat", () => {
  const basePace = 300; // 5:00/km

  it("returns unchanged pace at baseline temp", () => {
    const result = adjustPaceForHeat(basePace, BASELINE_F);
    expect(result.adjustedPaceSecPerKm).toBe(basePace);
    expect(result.slowdownPct).toBe(0);
  });

  it("returns slower pace in heat", () => {
    const result = adjustPaceForHeat(basePace, 85);
    expect(result.adjustedPaceSecPerKm).toBeGreaterThan(basePace);
    expect(result.slowdownPct).toBeGreaterThan(0);
  });

  it("calculates mi pace as km pace × 1.609344", () => {
    const result = adjustPaceForHeat(basePace, 80);
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

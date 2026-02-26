import { describe, it, expect } from "vitest";
import {
  paceToMetersPerMin,
  vo2AtPace,
  hrrFraction,
  fitnessLabel,
  estimateVO2max,
} from "./logic";

describe("paceToMetersPerMin", () => {
  it("converts min/km pace correctly", () => {
    // 5:00/km = 300 sec/km → 1000/300 = 3.333 m/s = 200 m/min
    expect(paceToMetersPerMin(5, 0, "min/km")).toBeCloseTo(200, 1);
  });

  it("converts min/mi pace correctly", () => {
    // 8:00/mi = 480 sec/mi → 1609.34/480 ≈ 201.17 m/min
    expect(paceToMetersPerMin(8, 0, "min/mi")).toBeCloseTo(201.17, 0);
  });

  it("returns 0 for zero pace", () => {
    expect(paceToMetersPerMin(0, 0, "min/km")).toBe(0);
  });
});

describe("vo2AtPace", () => {
  it("returns correct VO2 at 200 m/min (5:00/km)", () => {
    // v = 200
    // -4.60 + 0.182258 * 200 + 0.000104 * 200^2
    // = -4.60 + 36.4516 + 4.16
    // = 36.01
    const v = 200;
    const expected = -4.60 + 0.182258 * v + 0.000104 * v * v;
    expect(vo2AtPace(v)).toBeCloseTo(expected, 5);
  });
});

describe("hrrFraction", () => {
  it("calculates correct fraction", () => {
    // (150 - 50) / (190 - 50) = 100 / 140 ≈ 0.714
    expect(hrrFraction(150, 190, 50)).toBeCloseTo(100 / 140, 4);
  });

  it("returns 0 if maxHR equals restHR", () => {
    expect(hrrFraction(170, 170, 170)).toBe(0);
  });
});

describe("fitnessLabel", () => {
  it("returns correct labels", () => {
    expect(fitnessLabel(25)).toBe("Beginner");
    expect(fitnessLabel(35)).toBe("Recreational");
    expect(fitnessLabel(45)).toBe("Intermediate");
    expect(fitnessLabel(55)).toBe("Advanced");
    expect(fitnessLabel(65)).toBe("Sub-elite");
    expect(fitnessLabel(75)).toBe("Elite");
  });
});

describe("estimateVO2max", () => {
  it("produces a plausible result for 5:00/km at 150bpm, maxHR 190, restHR 50", () => {
    const result = estimateVO2max({
      paceMinutes: 5,
      paceSeconds: 0,
      paceUnit: "min/km",
      avgHR: 150,
      maxHR: 190,
      restHR: 50,
    });

    // percentVO2max ≈ 71.4%
    // vo2AtPace(200) ≈ 36.01
    // vo2max ≈ 36.01 / 0.714 ≈ 50.4
    expect(result.vo2max).toBeGreaterThan(45);
    expect(result.vo2max).toBeLessThan(60);
    expect(result.fitnessLabel).toBe("Intermediate");
    expect(result.percentVO2max).toBeCloseTo(71.4, 0);
    expect(result.warning).toBeNull();
  });

  it("clamps output to 20–90 range", () => {
    // Very slow pace + very high HR → raw VO2max would be very low
    const low = estimateVO2max({
      paceMinutes: 15,
      paceSeconds: 0,
      paceUnit: "min/km",
      avgHR: 189,
      maxHR: 190,
      restHR: 50,
    });
    expect(low.vo2max).toBeGreaterThanOrEqual(20);

    // Very fast pace + very low HR → raw VO2max would be very high
    const high = estimateVO2max({
      paceMinutes: 3,
      paceSeconds: 30,
      paceUnit: "min/km",
      avgHR: 82,
      maxHR: 190,
      restHR: 50,
    });
    expect(high.vo2max).toBeLessThanOrEqual(90);
  });

  it("warns when HR effort is below 55% HRR", () => {
    const result = estimateVO2max({
      paceMinutes: 7,
      paceSeconds: 0,
      paceUnit: "min/km",
      avgHR: 100,
      maxHR: 190,
      restHR: 50,
    });
    // HRR fraction = (100-50)/(190-50) = 50/140 ≈ 35.7% → below 55%
    expect(result.warning).not.toBeNull();
  });

  it("returns no warning for a moderately hard effort", () => {
    const result = estimateVO2max({
      paceMinutes: 5,
      paceSeconds: 30,
      paceUnit: "min/km",
      avgHR: 155,
      maxHR: 190,
      restHR: 50,
    });
    expect(result.warning).toBeNull();
  });
});

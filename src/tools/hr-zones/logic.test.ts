import { describe, it, expect } from "vitest";
import {
  calculateMaxHR,
  calculateZonesMaxHR,
  calculateZonesKarvonen,
  calculateZonesLTHR,
  formatZonesAsText,
} from "./logic";

describe("calculateMaxHR", () => {
  it("returns 220 - age", () => {
    expect(calculateMaxHR(30)).toBe(190);
    expect(calculateMaxHR(25)).toBe(195);
    expect(calculateMaxHR(40)).toBe(180);
  });
});

describe("calculateZonesMaxHR", () => {
  it("returns 5 zones based on % of max HR", () => {
    const zones = calculateZonesMaxHR(190);
    expect(zones).toHaveLength(5);

    // Z1: 50-60% of 190 = 95-114
    expect(zones[0].min).toBe(95);
    expect(zones[0].max).toBe(114);

    // Z5: 90-100% of 190 = 171-190
    expect(zones[4].min).toBe(171);
    expect(zones[4].max).toBe(190);
  });

  it("assigns correct labels", () => {
    const zones = calculateZonesMaxHR(190);
    expect(zones[0].label).toBe("Easy / Recovery");
    expect(zones[2].label).toBe("Tempo");
    expect(zones[4].label).toBe("VO2max / Anaerobic");
  });
});

describe("calculateZonesKarvonen", () => {
  it("calculates zones using heart rate reserve", () => {
    const zones = calculateZonesKarvonen(190, 60);
    // HRR = 130
    // Z1: (130 * 0.5) + 60 = 125, (130 * 0.6) + 60 = 138
    expect(zones[0].min).toBe(125);
    expect(zones[0].max).toBe(138);

    // Z5: (130 * 0.9) + 60 = 177, (130 * 1.0) + 60 = 190
    expect(zones[4].min).toBe(177);
    expect(zones[4].max).toBe(190);
  });
});

describe("calculateZonesLTHR", () => {
  it("calculates zones based on lactate threshold HR", () => {
    const zones = calculateZonesLTHR(170);

    // Z1: 65-81% of 170 = 111-138 (rounded)
    expect(zones[0].min).toBe(111);
    expect(zones[0].max).toBe(138);

    // Z4: 95-100% of 170 = 162-170 (rounded)
    expect(zones[3].min).toBe(162);
    expect(zones[3].max).toBe(170);

    // Z5: 100-106% of 170 = 170-180 (rounded)
    expect(zones[4].min).toBe(170);
    expect(zones[4].max).toBe(180);
  });
});

describe("formatZonesAsText", () => {
  it("formats zones as readable text", () => {
    const zones = calculateZonesMaxHR(190);
    const text = formatZonesAsText(zones, "% Max HR");
    expect(text).toContain("Heart Rate Zones (% Max HR)");
    expect(text).toContain("Z1 Easy / Recovery: 95–114 bpm");
    expect(text).toContain("Z5 VO2max / Anaerobic: 171–190 bpm");
  });
});

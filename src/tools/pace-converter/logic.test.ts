import { describe, it, expect } from "vitest";
import {
  paceToSeconds,
  secondsToPace,
  convertPace,
  calculateRaceTimes,
  formatValue,
  parseValue,
} from "./logic";

describe("paceToSeconds", () => {
  it("parses M:SS format", () => {
    expect(paceToSeconds("8:30")).toBe(510);
    expect(paceToSeconds("5:00")).toBe(300);
    expect(paceToSeconds("10:15")).toBe(615);
  });

  it("parses plain number strings", () => {
    expect(paceToSeconds("510")).toBe(510);
  });

  it("handles missing seconds", () => {
    expect(paceToSeconds("5:")).toBe(300);
  });
});

describe("secondsToPace", () => {
  it("formats seconds as M:SS", () => {
    expect(secondsToPace(510)).toBe("8:30");
    expect(secondsToPace(300)).toBe("5:00");
    expect(secondsToPace(615)).toBe("10:15");
  });
});

describe("convertPace", () => {
  it("converts min/mi to min/km", () => {
    // 8:30/mi = 510 sec/mi → 510 / 1.609344 ≈ 316.86 sec/km ≈ 5:17
    const result = convertPace(510, "min/mi", "min/km");
    expect(result).toBeCloseTo(316.86, 0);
  });

  it("converts min/km to mph", () => {
    // 5:00/km = 300 sec/km → 3600/300 = 12 km/h → 12/1.609344 ≈ 7.456 mph
    const result = convertPace(300, "min/km", "mph");
    expect(result).toBeCloseTo(7.456, 1);
  });

  it("converts mph to km/h", () => {
    // 6 mph = 6 * 1.609344 = 9.656 km/h
    const result = convertPace(6, "mph", "km/h");
    expect(result).toBeCloseTo(9.656, 1);
  });

  it("identity conversion returns same value", () => {
    expect(convertPace(300, "min/km", "min/km")).toBeCloseTo(300, 5);
    expect(convertPace(7.5, "mph", "mph")).toBeCloseTo(7.5, 5);
  });
});

describe("calculateRaceTimes", () => {
  it("calculates correct finish times at 5:00/km pace", () => {
    const times = calculateRaceTimes(300); // 5:00/km

    // 5K at 5:00/km = 25:00
    expect(times["5K"]).toBe("25:00");

    // 10K at 5:00/km = 50:00
    expect(times["10K"]).toBe("50:00");

    // Half Marathon at 5:00/km ≈ 1:45:29
    expect(times["Half Marathon"]).toBe("1:45:29");

    // Marathon at 5:00/km ≈ 3:30:59
    expect(times["Marathon"]).toBe("3:30:59");
  });
});

describe("formatValue", () => {
  it("formats pace units as M:SS", () => {
    expect(formatValue(510, "min/mi")).toBe("8:30");
    expect(formatValue(300, "min/km")).toBe("5:00");
  });

  it("formats speed units with 1 decimal", () => {
    expect(formatValue(12.0, "km/h")).toBe("12.0");
    expect(formatValue(7.456, "mph")).toBe("7.5");
  });
});

describe("parseValue", () => {
  it("parses pace strings", () => {
    expect(parseValue("8:30", "min/mi")).toBe(510);
  });

  it("parses speed numbers", () => {
    expect(parseValue("12.5", "km/h")).toBe(12.5);
  });
});

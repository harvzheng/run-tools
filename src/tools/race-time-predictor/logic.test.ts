import { describe, it, expect } from "vitest";
import { timeToSeconds, predictTime } from "./logic";

describe("timeToSeconds", () => {
  it("parses hh:mm:ss", () => {
    expect(timeToSeconds("1:05:30")).toBe(3930);
  });

  it("parses mm:ss", () => {
    expect(timeToSeconds("25:00")).toBe(1500);
  });
});

describe("predictTime", () => {
  it("predicts 10K from 5K using Riegel", () => {
    const predicted = predictTime(1500, 5, 10, 1.06);
    expect(predicted).toBeCloseTo(3127.4, 1);
  });

  it("returns base time for same distance", () => {
    const predicted = predictTime(1800, 10, 10, 1.06);
    expect(predicted).toBeCloseTo(1800, 4);
  });
});

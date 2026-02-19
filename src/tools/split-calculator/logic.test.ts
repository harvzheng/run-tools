import { describe, it, expect } from "vitest";
import { calculateSplits } from "./logic";

describe("calculateSplits", () => {
  it("splits evenly for even strategy", () => {
    const splits = calculateSplits(10, 3000, 1, "even");
    expect(splits).toHaveLength(10);
    expect(splits[0]?.splitSeconds).toBeCloseTo(300, 3);
    expect(splits[9]?.cumulativeSeconds).toBeCloseTo(3000, 3);
  });

  it("negative splits finish faster than start", () => {
    const splits = calculateSplits(10, 3000, 1, "negative");
    const first = splits[0]?.splitSeconds ?? 0;
    const last = splits[splits.length - 1]?.splitSeconds ?? 0;
    expect(first).toBeGreaterThan(last);
  });

  it("positive splits start faster than finish", () => {
    const splits = calculateSplits(10, 3000, 1, "positive");
    const first = splits[0]?.splitSeconds ?? 0;
    const last = splits[splits.length - 1]?.splitSeconds ?? 0;
    expect(first).toBeLessThan(last);
  });
});

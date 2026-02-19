import { describe, it, expect } from "vitest";
import { equivalentFlatSpeed } from "./logic";

describe("equivalentFlatSpeed", () => {
  it("matches input pace at 0% incline", () => {
    const result = equivalentFlatSpeed(10, "km/h", 0);
    expect(result.flatSpeedKmh).toBeCloseTo(10, 3);
    expect(result.paceSecondsPerKm).toBeCloseTo(360, 1);
  });

  it("returns faster equivalent pace for incline", () => {
    const flat = equivalentFlatSpeed(10, "km/h", 0);
    const incline = equivalentFlatSpeed(10, "km/h", 5);
    expect(incline.paceSecondsPerKm).toBeLessThan(flat.paceSecondsPerKm);
  });
});

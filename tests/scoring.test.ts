import { describe, expect, it } from "vitest";
import { calculateWeightedScore } from "../lib/scoring";

describe("calculateWeightedScore", () => {
  it("applies the configured weights", () => {
    const evidence = "Test evidence";
    expect(calculateWeightedScore({
      businessModelAttractiveness: { value: 5, evidence },
      recurringRevenue: { value: 4, evidence },
      defensibility: { value: 3, evidence },
      operationalImprovement: { value: 2, evidence },
      ownerOperatorFit: { value: 1, evidence },
    })).toBe(3.15);
  });
});

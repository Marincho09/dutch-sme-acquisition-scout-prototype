import { describe, expect, it } from "vitest";
import { assessmentSchema, unavailable } from "../lib/schema";
import { createMockAssessment } from "../lib/mock";

describe("createMockAssessment", () => {
  it("returns a validated curated profile for a real sample company", () => {
    const assessment = createMockAssessment({
      company_name: "Adaption",
      website_url: "https://www.adaption-it.nl/",
    });

    expect(assessment.mode).toBe("demo");
    expect(assessment.location).toBe("Sliedrecht, Netherlands");
    expect(assessment.sourceUrls.length).toBeGreaterThan(1);
    expect(assessment.successionOwnershipIndicators).toBe(unavailable);
    expect(assessmentSchema.safeParse(assessment).success).toBe(true);
  });

  it("keeps unsupported companies evidence-safe in generic mock mode", () => {
    const assessment = createMockAssessment({
      company_name: "Unknown Company",
      website_url: "https://example.com/",
    });

    expect(assessment.mode).toBe("mock");
    expect(assessment.productsServices).toBe(unavailable);
    expect(assessment.confidence).toBe("Low");
    expect(assessmentSchema.safeParse(assessment).success).toBe(true);
  });
});

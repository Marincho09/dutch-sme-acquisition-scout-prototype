import { describe, expect, it } from "vitest";
import { assessmentsToCsv, parseCompanyCsv } from "../lib/csv";
import { createMockAssessment } from "../lib/mock";

describe("parseCompanyCsv", () => {
  it("accepts valid rows", () => {
    const result = parseCompanyCsv("company_name,website_url\nDelta Services,https://example.com");
    expect(result.errors).toEqual([]);
    expect(result.companies[0].company_name).toBe("Delta Services");
  });

  it("reports missing headers", () => {
    const result = parseCompanyCsv("name,url\nDelta,not-a-url");
    expect(result.companies).toEqual([]);
    expect(result.errors[0]).toContain("company_name");
  });

  it("exports ranked assessment fields", () => {
    const csv = assessmentsToCsv([createMockAssessment({ company_name: "Delta Services", website_url: "https://example.com" })]);
    expect(csv).toContain("rank,company_name,website_url");
    expect(csv).toContain("Delta Services");
    expect(csv).toContain("3");
  });
});

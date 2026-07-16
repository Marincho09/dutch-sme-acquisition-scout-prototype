import Papa from "papaparse";
import { companyInputSchema, type Assessment, type CompanyInput } from "./schema";

export type CsvParseResult = { companies: CompanyInput[]; errors: string[] };

export function parseCompanyCsv(text: string): CsvParseResult {
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase(),
  });
  const errors = parsed.errors.map((error) =>
    `${typeof error.row === "number" ? `Row ${error.row + 2}` : "CSV"}: ${error.message}`,
  );
  const companies: CompanyInput[] = [];

  parsed.data.forEach((row, index) => {
    const result = companyInputSchema.safeParse(row);
    if (result.success) companies.push(result.data);
    else errors.push(`Row ${index + 2}: ${result.error.issues.map((issue) => issue.message).join(", ")}`);
  });

  if (!parsed.meta.fields?.includes("company_name") || !parsed.meta.fields?.includes("website_url")) {
    errors.unshift("CSV must contain company_name and website_url headers.");
    return { companies: [], errors };
  }
  return { companies, errors };
}

export function assessmentsToCsv(assessments: Assessment[]): string {
  return Papa.unparse(
    assessments.map((item, index) => ({
      rank: index + 1,
      company_name: item.companyName,
      website_url: item.website,
      sector: item.sector,
      location: item.location,
      total_score: item.totalScore,
      confidence: item.confidence,
      business_model_score: item.scores.businessModelAttractiveness.value,
      repeat_revenue_score: item.scores.recurringRevenue.value,
      defensibility_score: item.scores.defensibility.value,
      operational_improvement_score: item.scores.operationalImprovement.value,
      owner_operator_fit_score: item.scores.ownerOperatorFit.value,
      score_explanation: item.scoreExplanation,
      information_gaps: item.informationGaps.join(" | "),
      source_urls: item.sourceUrls.join(" | "),
      outreach_draft: item.outreachDraft,
    })),
  );
}

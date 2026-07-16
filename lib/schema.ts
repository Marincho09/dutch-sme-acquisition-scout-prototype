import { z } from "zod";

export const unavailable = "Information unavailable";

export const companyInputSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  website_url: z.string().trim().url("Website must be a valid URL"),
});

export const scoreSchema = z.object({
  value: z.number().int().min(1).max(5),
  evidence: z.string().min(1),
});

export const assessmentCoreSchema = z.object({
  companyName: z.string().min(1),
  website: z.string().url(),
  overview: z.string().min(1),
  productsServices: z.string().min(1),
  customerType: z.string().min(1),
  businessModel: z.string().min(1),
  sector: z.string().min(1),
  location: z.string().min(1),
  recurringRevenueCharacteristics: z.string().min(1),
  successionOwnershipIndicators: z.string().min(1),
  operationalComplexity: z.string().min(1),
  aiAutomationOpportunities: z.array(z.string().min(1)),
  keyRisks: z.array(z.string().min(1)),
  informationGaps: z.array(z.string().min(1)),
  sourceUrls: z.array(z.string().url()),
  scores: z.object({
    businessModelAttractiveness: scoreSchema,
    recurringRevenue: scoreSchema,
    defensibility: scoreSchema,
    operationalImprovement: scoreSchema,
    ownerOperatorFit: scoreSchema,
  }),
  scoreExplanation: z.string().min(1),
  confidence: z.enum(["Low", "Medium", "High"]),
  outreachDraft: z.string().min(1),
});

export const assessmentSchema = assessmentCoreSchema.extend({
  id: z.string().min(1),
  totalScore: z.number().min(1).max(5),
  generatedAt: z.string().datetime(),
  mode: z.enum(["mock", "demo", "live"]),
});

export const analysisRequestSchema = z.object({ company: companyInputSchema });

export type CompanyInput = z.infer<typeof companyInputSchema>;
export type AssessmentCore = z.infer<typeof assessmentCoreSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type ScoreKey = keyof Assessment["scores"];

import type { AssessmentCore, ScoreKey } from "./schema";

export const scoreWeights: Record<ScoreKey, number> = {
  businessModelAttractiveness: 0.25,
  recurringRevenue: 0.2,
  defensibility: 0.2,
  operationalImprovement: 0.15,
  ownerOperatorFit: 0.2,
};

export const scoreLabels: Record<ScoreKey, string> = {
  businessModelAttractiveness: "Business model",
  recurringRevenue: "Repeat revenue",
  defensibility: "Defensibility",
  operationalImprovement: "Improvement",
  ownerOperatorFit: "Owner-operator fit",
};

export function calculateWeightedScore(scores: AssessmentCore["scores"]): number {
  const total = (Object.keys(scoreWeights) as ScoreKey[]).reduce(
    (sum, key) => sum + scores[key].value * scoreWeights[key],
    0,
  );
  return Number(total.toFixed(2));
}

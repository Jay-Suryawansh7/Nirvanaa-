export const calculateReadinessScore = (
  lawyerConfirmed: boolean,
  witnessConfirmed: boolean,
  documentsReady: boolean
): number => {
  let score = 0;
  if (lawyerConfirmed) score += 40;
  if (witnessConfirmed) score += 30;
  if (documentsReady) score += 30;
  return score;
};

export const getReadinessStatus = (score: number) => {
  if (score >= 80) return "READY";
  if (score >= 50) return "PARTIAL";
  return "HIGH_RISK";
};

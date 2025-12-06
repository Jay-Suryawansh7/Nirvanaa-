"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReadinessScore = calculateReadinessScore;
exports.getReadinessStatus = getReadinessStatus;
const POINTS = {
    LAWYER_CONFIRMED: 30,
    WITNESS_CONFIRMED: 20,
    DOCUMENTS_READY: 20,
    MEDIATION_BOTH: 30,
    MEDIATION_ONE: 15,
    MEDIATION_NONE: 0,
    MAX_SCORE: 100
};
function calculateReadinessScore(caseData) {
    let score = 0;
    if (caseData.lawyerConfirmed)
        score += POINTS.LAWYER_CONFIRMED;
    if (caseData.witnessConfirmed)
        score += POINTS.WITNESS_CONFIRMED;
    if (caseData.documentsReady)
        score += POINTS.DOCUMENTS_READY;
    if (caseData.mediationWilling === 'BOTH')
        score += POINTS.MEDIATION_BOTH;
    else if (caseData.mediationWilling === 'ONE_PARTY')
        score += POINTS.MEDIATION_ONE;
    return Math.min(score, POINTS.MAX_SCORE);
}
function getReadinessStatus(caseData) {
    const score = calculateReadinessScore(caseData);
    if (score >= 85)
        return 'READY';
    if (score >= 70 && caseData.mediationWilling === 'BOTH')
        return 'MEDIATION_READY';
    if (score >= 50)
        return 'WAITING';
    if (score >= 30)
        return 'PARTIALLY_READY';
    return 'HIGH_RISK';
}
//# sourceMappingURL=scoringService.js.map
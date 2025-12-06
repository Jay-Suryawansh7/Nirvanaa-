"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseMetrics = exports.getCases = void 0;
const scoringService_1 = require("../services/scoringService");
// Mock Data Generation
const generateMockCases = () => {
    const cases = [];
    for (let i = 1; i <= 20; i++) {
        cases.push({
            id: `C${100 + i}`,
            lawyerConfirmed: Math.random() > 0.3,
            witnessConfirmed: Math.random() > 0.4,
            documentsReady: Math.random() > 0.2,
            mediationWilling: Math.random() > 0.7 ? 'BOTH' : (Math.random() > 0.5 ? 'ONE_PARTY' : 'NONE')
        });
    }
    return cases;
};
const mockCases = generateMockCases();
const getCases = (req, res) => {
    const statusFilter = req.query.status;
    let results = mockCases.map(c => ({
        ...c,
        readinessScore: (0, scoringService_1.calculateReadinessScore)(c),
        status: (0, scoringService_1.getReadinessStatus)(c)
    }));
    if (statusFilter) {
        results = results.filter(c => c.status === statusFilter);
    }
    // Sort by score desc
    results.sort((a, b) => b.readinessScore - a.readinessScore);
    res.json(results);
};
exports.getCases = getCases;
const getCaseMetrics = (req, res) => {
    const totalCases = mockCases.length;
    const stats = mockCases.map(c => (0, scoringService_1.getReadinessStatus)(c));
    const readyCases = stats.filter(s => s === 'READY').length;
    const highRiskCases = stats.filter(s => s === 'HIGH_RISK').length;
    const mediationReadyCases = stats.filter(s => s === 'MEDIATION_READY').length;
    res.json({
        totalCases,
        readyCases,
        highRiskCases,
        mediationReadyCases,
        partiallyReadyCases: totalCases - readyCases - highRiskCases - mediationReadyCases
    });
};
exports.getCaseMetrics = getCaseMetrics;
//# sourceMappingURL=caseController.js.map
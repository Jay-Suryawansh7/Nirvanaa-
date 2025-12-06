import { Request, Response } from 'express';
import { Case, ReadinessStatus } from '../models/types';
import { calculateReadinessScore, getReadinessStatus } from '../services/scoringService';

// Mock Data Generation
const generateMockCases = (): Case[] => {
    const cases: Case[] = [];
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

interface CaseResponse extends Case {
    readinessScore: number;
    status: ReadinessStatus;
}

export const getCases = (req: Request, res: Response) => {
    const statusFilter = req.query.status as string;
    
    let results = mockCases.map(c => ({
        ...c,
        readinessScore: calculateReadinessScore(c),
        status: getReadinessStatus(c)
    }));

    if (statusFilter) {
        results = results.filter(c => c.status === statusFilter);
    }

    // Sort by score desc
    results.sort((a, b) => b.readinessScore - a.readinessScore);

    res.json(results);
};

export const getCaseMetrics = (req: Request, res: Response) => {
    const totalCases = mockCases.length;
    const stats = mockCases.map(c => getReadinessStatus(c));
    
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

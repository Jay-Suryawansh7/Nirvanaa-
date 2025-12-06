"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scoringService_1 = require("../src/services/scoringService");
describe('Case Readiness Scoring', () => {
    test('should calculate 30 points for lawyer confirmed only', () => {
        const testCase = {
            id: '123',
            lawyerConfirmed: true,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        const score = (0, scoringService_1.calculateReadinessScore)(testCase);
        expect(score).toBe(30);
    });
    test('should calculate 20 points for witness confirmed', () => {
        const testCase = {
            id: '124',
            lawyerConfirmed: false,
            witnessConfirmed: true,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(20);
    });
    test('should calculate 20 points for documents ready', () => {
        const testCase = {
            id: '125',
            lawyerConfirmed: false,
            witnessConfirmed: false,
            documentsReady: true,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(20);
    });
    test('should calculate 30 points for mediation (BOTH willing)', () => {
        const testCase = {
            id: '126',
            lawyerConfirmed: false,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'BOTH'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(30);
    });
    test('should calculate 100 points when all readiness criteria are met', () => {
        const testCase = {
            id: '127',
            lawyerConfirmed: true,
            witnessConfirmed: true,
            documentsReady: true,
            mediationWilling: 'BOTH'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(100);
    });
    test('should map to READY status when score is >= 85', () => {
        // Score: 30(L) + 20(W) + 20(D) + 30(M) = 100
        const testCase = {
            id: '128',
            lawyerConfirmed: true,
            witnessConfirmed: true,
            documentsReady: true,
            mediationWilling: 'BOTH'
        };
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('READY');
    });
    test('should map to MEDIATION_READY when score >= 70 and BOTH willing', () => {
        // Score: 30(L) + 20(W) + 30(M) = 80 -> MEDIATION_READY priority over WAITING?
        // Wait, TDD plan says: MEDIATION_READY (70-84, both willing)
        const testCase = {
            id: '129',
            lawyerConfirmed: true,
            witnessConfirmed: true,
            documentsReady: false,
            mediationWilling: 'BOTH'
        };
        // Score: 30 + 20 + 30 = 80
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('MEDIATION_READY');
    });
    test('should map to WAITING status when score is between 50-69', () => {
        // Score: 30(L) + 20(W) = 50
        const testCase = {
            id: '130',
            lawyerConfirmed: true,
            witnessConfirmed: true,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('WAITING');
    });
    test('should map to PARTIALLY_READY when score is between 30-49', () => {
        // Score: 30(L) = 30
        const testCase = {
            id: '131',
            lawyerConfirmed: true,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('PARTIALLY_READY');
    });
    test('should map to HIGH_RISK when score is between 0-29', () => {
        // Score: 20(W) = 20
        const testCase = {
            id: '132',
            lawyerConfirmed: false,
            witnessConfirmed: true,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('HIGH_RISK');
    });
    test('should update score when lawyer status changes', () => {
        const testCase = {
            id: '133',
            lawyerConfirmed: false,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        const initialScore = (0, scoringService_1.calculateReadinessScore)(testCase);
        expect(initialScore).toBe(0);
        testCase.lawyerConfirmed = true;
        const newScore = (0, scoringService_1.calculateReadinessScore)(testCase);
        expect(newScore).toBe(30);
    });
    test('should update score when documents become ready', () => {
        const testCase = {
            id: '134',
            lawyerConfirmed: false,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(0);
        testCase.documentsReady = true;
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(20);
    });
    test('should update score when mediation willingness changes', () => {
        const testCase = {
            id: '135',
            lawyerConfirmed: false,
            witnessConfirmed: false,
            documentsReady: false,
            mediationWilling: 'NONE'
        };
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(0);
        testCase.mediationWilling = 'BOTH';
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(30);
    });
    test('should handle empty object gracefully (defaults to 0)', () => {
        // @ts-ignore
        const testCase = {};
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(0);
    });
    test('should handle invalid mediation willingness string gracefully', () => {
        const testCase = {
            id: '136',
            lawyerConfirmed: true,
            witnessConfirmed: false,
            documentsReady: false,
            // @ts-ignore
            mediationWilling: 'UNKNOWN_VALUE'
        };
        // Should ignore invalid value and just count lawyer (30)
        expect((0, scoringService_1.calculateReadinessScore)(testCase)).toBe(30);
    });
    test('should return HIGH_RISK for minimal/empty case', () => {
        // @ts-ignore
        const testCase = {};
        expect((0, scoringService_1.getReadinessStatus)(testCase)).toBe('HIGH_RISK');
    });
});
//# sourceMappingURL=readiness-scoring.test.js.map
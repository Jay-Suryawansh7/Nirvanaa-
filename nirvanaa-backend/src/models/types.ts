export type ReadinessStatus = 'READY' | 'MEDIATION_READY' | 'WAITING' | 'PARTIALLY_READY' | 'HIGH_RISK';

export interface Case {
    id: string;
    lawyerConfirmed: boolean;
    witnessConfirmed: boolean;
    documentsReady: boolean;
    mediationWilling: 'NONE' | 'ONE_PARTY' | 'BOTH';
}

import { Request, Response } from 'express';
import { calculateReadinessScore, getReadinessStatus } from '../services/scoringService';
// In a real app, we'd import the Case model and update DB.
// For now, we will just simulate the update on a mock case object.

export const receiveConfirmation = (req: Request, res: Response) => {
    const { caseId, response, responder } = req.body;

    // Simulate Case Retrieval
    const mockCase = {
        id: caseId,
        lawyerConfirmed: false,
        witnessConfirmed: false,
        documentsReady: true,
        mediationWilling: 'NONE' as const
    };

    console.log(`[Confirmation Webhook] Received ${response} from ${responder} for Case ${caseId}`);

    if (response.toUpperCase() === 'YES') {
        mockCase.lawyerConfirmed = true;
    } else {
        mockCase.lawyerConfirmed = false;
    }

    const newScore = calculateReadinessScore(mockCase);
    const newStatus = getReadinessStatus(mockCase);

    // In read world: await db.cases.update(...)

    res.json({
        success: true,
        message: 'Confirmation received',
        updatedCase: {
            ...mockCase,
            score: newScore,
            status: newStatus
        }
    });
};

export const manualRemind = (req: Request, res: Response) => {
    const { id } = req.params;
    // In real app, look up phone number
    console.log(`[Manual Trigger] Reminder scheduled for Lawyer of Case ${id}`);
    
    res.json({ success: true, message: 'Reminder queued' });
};

export const triggerJobs = async (req: Request, res: Response) => {
    const { type } = req.body; // 'daily' or 'hourly'
    if (type === 'daily') {
        await require('../services/reminderScheduler').runDailyJob();
    } else if (type === 'hourly') {
        await require('../services/reminderScheduler').runHourlyJob();
    }
    res.json({ success: true, message: `Job ${type} triggered` });
};

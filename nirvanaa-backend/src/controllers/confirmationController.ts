import { Request, Response } from 'express';
import { calculateReadinessScore, getReadinessStatus } from '../services/scoringService';

import { db } from '../config/drizzle';
import { cases } from '../models/schema';
import { eq } from 'drizzle-orm';

export const receiveConfirmation = async (req: Request, res: Response) => {
    try {
        const { caseId, response, responder } = req.body; // specific case ID and response logic

        console.log(`[Confirmation Webhook] Received ${response} from ${responder} for Case ${caseId}`);

        // Find the case
        const caseResult = await db.select().from(cases).where(eq(cases.id, caseId));
        if (caseResult.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }
        
        const currentCase = caseResult[0];
        let updates: any = {};

        if (response.toUpperCase() === 'YES') {
            updates.lawyerConfirmed = true;
        } else {
            updates.lawyerConfirmed = false;
        }

        // Recalculate score (simple logic for now)
        // Ideally we fetch the scoring service logic but for now let's just update the flag
        // The getCases controller calculates score if needed, or we explicitly update readinessScore here.

        await db.update(cases).set(updates).where(eq(cases.id, caseId));

        res.json({
            success: true,
            message: 'Confirmation received and case updated',
        });
    } catch (error: any) {
        console.error('Error in confirmation:', error);
        res.status(500).json({ error: 'Failed to process confirmation' });
    }
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

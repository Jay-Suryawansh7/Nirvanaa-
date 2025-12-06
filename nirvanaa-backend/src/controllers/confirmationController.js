"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerJobs = exports.manualRemind = exports.receiveConfirmation = void 0;
const scoringService_1 = require("../services/scoringService");
// In a real app, we'd import the Case model and update DB.
// For now, we will just simulate the update on a mock case object.
const receiveConfirmation = (req, res) => {
    const { caseId, response, responder } = req.body;
    // Simulate Case Retrieval
    const mockCase = {
        id: caseId,
        lawyerConfirmed: false,
        witnessConfirmed: false,
        documentsReady: true,
        mediationWilling: 'NONE'
    };
    console.log(`[Confirmation Webhook] Received ${response} from ${responder} for Case ${caseId}`);
    if (response.toUpperCase() === 'YES') {
        mockCase.lawyerConfirmed = true;
    }
    else {
        mockCase.lawyerConfirmed = false;
    }
    const newScore = (0, scoringService_1.calculateReadinessScore)(mockCase);
    const newStatus = (0, scoringService_1.getReadinessStatus)(mockCase);
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
exports.receiveConfirmation = receiveConfirmation;
const manualRemind = (req, res) => {
    const { id } = req.params;
    // In real app, look up phone number
    console.log(`[Manual Trigger] Reminder scheduled for Lawyer of Case ${id}`);
    res.json({ success: true, message: 'Reminder queued' });
};
exports.manualRemind = manualRemind;
const triggerJobs = async (req, res) => {
    const { type } = req.body; // 'daily' or 'hourly'
    if (type === 'daily') {
        await require('../services/reminderScheduler').runDailyJob();
    }
    else if (type === 'hourly') {
        await require('../services/reminderScheduler').runHourlyJob();
    }
    res.json({ success: true, message: `Job ${type} triggered` });
};
exports.triggerJobs = triggerJobs;
//# sourceMappingURL=confirmationController.js.map
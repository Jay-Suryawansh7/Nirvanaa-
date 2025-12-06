"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHourlyJob = exports.runDailyJob = void 0;
const notificationService_1 = require("./notificationService");
// Mock function to simulate a daily job
const runDailyJob = async () => {
    console.log('[Scheduler] Running Daily 24h Reminder Job...');
    // In real app, query DB for cases with hearing tomorrow
    // const cases = await db.cases.find({ hearingDate: tomorrow });
    // Mock iteration
    const mockCases = [{ id: 'C104', lawyer: 'Adv. Sharma', phone: '+919876543210' }];
    for (const c of mockCases) {
        await (0, notificationService_1.sendReminder)(c.id, c.lawyer, c.phone, 24);
    }
    console.log('[Scheduler] Daily Job Complete.');
};
exports.runDailyJob = runDailyJob;
// Mock function to simulate hourly job
const runHourlyJob = async () => {
    console.log('[Scheduler] Running Urgent 1h Reminder Job...');
    // In real app, query DB for cases with hearing in 1h
    // Mock iteration
    const mockCases = [{ id: 'C105', lawyer: 'Adv. Verma', phone: '+919876543211' }];
    for (const c of mockCases) {
        await (0, notificationService_1.sendReminder)(c.id, c.lawyer, c.phone, 1);
    }
    console.log('[Scheduler] Hourly Job Complete.');
};
exports.runHourlyJob = runHourlyJob;
//# sourceMappingURL=reminderScheduler.js.map
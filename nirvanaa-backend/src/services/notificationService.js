"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReminder = exports.sendSMS = void 0;
const sendSMS = async (phoneNumber, message) => {
    // Mock SMS Sending
    console.log(`[Mock SMS] To: ${phoneNumber}, Message: "${message}"`);
    return true; // Simulate success
};
exports.sendSMS = sendSMS;
const sendReminder = async (caseId, lawyerName, phoneNumber, hoursBefore) => {
    const message = `REMINDER: Hearing for Case ${caseId} is in ${hoursBefore} hours. Please confirm attendance by replying YES.`;
    return (0, exports.sendSMS)(phoneNumber, message);
};
exports.sendReminder = sendReminder;
//# sourceMappingURL=notificationService.js.map
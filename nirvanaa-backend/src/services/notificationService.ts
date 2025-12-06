export const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
    // Mock SMS Sending
    console.log(`[Mock SMS] To: ${phoneNumber}, Message: "${message}"`);
    return true; // Simulate success
};

export const sendReminder = async (caseId: string, lawyerName: string, phoneNumber: string, hoursBefore: number): Promise<boolean> => {
    const message = `REMINDER: Hearing for Case ${caseId} is in ${hoursBefore} hours. Please confirm attendance by replying YES.`;
    return sendSMS(phoneNumber, message);
};

export const sendNotification = async (to: string, message: string) => {
  // SMS Notification (Twilio)
  // In a real implementation: history of notifications would be saved here
  console.log(`[SMS/Twilio] Sending to ${to}: ${message}`);
  
  // Return mock success
  return true;
};

// Deprecated or removed functions
export const sendWhatsAppNotification = async (to: string, message: string) => {
    return sendNotification(to, message);
};

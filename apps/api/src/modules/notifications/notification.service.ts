export interface PushNotificationPayload {
  recipientToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface EmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface INotificationService {
  sendPush(payload: PushNotificationPayload): Promise<{ success: boolean; messageId: string }>;
  sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }>;
}

export class MockNotificationService implements INotificationService {
  async sendPush(payload: PushNotificationPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[FCM-MOCK] Push sent to ${payload.recipientToken}: ${payload.title} - ${payload.body}`);
    return { success: true, messageId: `msg_fcm_${Date.now()}` };
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[EMAIL-MOCK] Email sent to ${payload.to}: ${payload.subject}`);
    return { success: true, messageId: `msg_email_${Date.now()}` };
  }
}

export const notificationService = new MockNotificationService();

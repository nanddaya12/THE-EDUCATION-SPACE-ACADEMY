export interface NotificationPayload {
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  body: string;
  metadata?: any;
}

export interface ChannelDeliveryResult {
  success: boolean;
  channel: string;
  providerTxId?: string;
  error?: string;
}

export interface IChannelProvider {
  send(payload: NotificationPayload): Promise<ChannelDeliveryResult>;
}

export class InAppChannelProvider implements IChannelProvider {
  public async send(payload: NotificationPayload): Promise<ChannelDeliveryResult> {
    // Delivers real-time in-app notification to user inbox
    return {
      success: true,
      channel: 'IN_APP',
      providerTxId: `inapp-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
  }
}

export class EmailChannelProvider implements IChannelProvider {
  public async send(payload: NotificationPayload): Promise<ChannelDeliveryResult> {
    if (!payload.recipientEmail && !payload.recipientId) {
      return { success: false, channel: 'EMAIL', error: 'Missing recipient email address' };
    }
    // SMTP / Email gateway dispatch simulation
    return {
      success: true,
      channel: 'EMAIL',
      providerTxId: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
  }
}

export class SMSChannelProvider implements IChannelProvider {
  public async send(payload: NotificationPayload): Promise<ChannelDeliveryResult> {
    if (!payload.recipientPhone && !payload.recipientId) {
      return { success: false, channel: 'SMS', error: 'Missing recipient phone number' };
    }
    // Mobile SMS Gateway dispatch simulation
    return {
      success: true,
      channel: 'SMS',
      providerTxId: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
  }
}

export class ChannelFactory {
  private static providers: Record<string, IChannelProvider> = {
    IN_APP: new InAppChannelProvider(),
    EMAIL: new EmailChannelProvider(),
    SMS: new SMSChannelProvider()
  };

  public static getProvider(channel: string): IChannelProvider {
    const provider = this.providers[channel.toUpperCase()];
    if (!provider) {
      return this.providers.IN_APP;
    }
    return provider;
  }
}

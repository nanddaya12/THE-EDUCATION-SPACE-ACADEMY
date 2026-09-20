import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';
import { ChannelFactory } from './channels.js';

export interface NotificationTemplate {
  id: string;
  event: string; // e.g. STUDENT_ABSENT, FEE_GENERATED, FEE_OVERDUE, RESULT_PUBLISHED, ADMISSION_STATUS_CHANGED, ANNOUNCEMENT_PUBLISHED
  titleTemplate: string;
  bodyTemplate: string;
  channels: string[]; // ['IN_APP', 'EMAIL', 'SMS']
}

export interface UserPreferences {
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

export interface DeliveryLog {
  id: string;
  recipientId: string;
  event: string;
  channel: string;
  title: string;
  body: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  retryCount: number;
  maxRetries: number;
  scheduledFor?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const memoryTemplates: NotificationTemplate[] = [
  {
    id: 'tmpl-absent',
    event: 'STUDENT_ABSENT',
    titleTemplate: 'Student Absence Notification - {{studentName}}',
    bodyTemplate: 'Dear Guardian, {{studentName}} was marked ABSENT on {{date}} for Grade {{classGrade}}.',
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'tmpl-fee-gen',
    event: 'FEE_GENERATED',
    titleTemplate: 'New Fee Invoice Generated - {{billingPeriod}}',
    bodyTemplate: 'Fee Invoice {{invoiceNumber}} for Rs. {{amount}} has been issued for {{studentName}}. Due Date: {{dueDate}}.',
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'tmpl-fee-overdue',
    event: 'FEE_OVERDUE',
    titleTemplate: 'URGENT: Fee Payment Overdue - {{invoiceNumber}}',
    bodyTemplate: 'Fee Invoice {{invoiceNumber}} for Rs. {{amount}} for {{studentName}} is past due date {{dueDate}}. Late fee charges apply.',
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'tmpl-result-pub',
    event: 'RESULT_PUBLISHED',
    titleTemplate: 'Official Exam Results Published - {{examTitle}}',
    bodyTemplate: 'Examination results for {{examTitle}} have been officially published. Grade for {{studentName}}: {{grade}} (GPA: {{gpa}}).',
    channels: ['IN_APP', 'EMAIL']
  },
  {
    id: 'tmpl-adm-status',
    event: 'ADMISSION_STATUS_CHANGED',
    titleTemplate: 'Admission Application Status Updated',
    bodyTemplate: 'Your admission application for applicant {{applicantName}} has been updated to {{status}}.',
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'tmpl-announcement',
    event: 'ANNOUNCEMENT_PUBLISHED',
    titleTemplate: 'Campus Announcement: {{headline}}',
    bodyTemplate: '{{announcementContent}}',
    channels: ['IN_APP', 'EMAIL']
  }
];

const memoryPreferences: Record<string, UserPreferences> = {};
const memoryDeliveryLogs: DeliveryLog[] = [];
const memoryQueue: DeliveryLog[] = [];

export class NotificationsRepository {
  // 1. Templates
  public async listTemplates() {
    return memoryTemplates;
  }

  public async getTemplateByEvent(event: string) {
    const tmpl = memoryTemplates.find(t => t.event.toUpperCase() === event.toUpperCase());
    if (!tmpl) {
      return {
        id: `tmpl-default`,
        event,
        titleTemplate: `Notification Alert: ${event}`,
        bodyTemplate: `System notification event '${event}' triggered for {{studentName}}.`,
        channels: ['IN_APP', 'EMAIL']
      };
    }
    return tmpl;
  }

  public async createTemplate(data: NotificationTemplate) {
    const existingIdx = memoryTemplates.findIndex(t => t.event === data.event);
    if (existingIdx >= 0) {
      memoryTemplates[existingIdx] = data;
      return data;
    }
    memoryTemplates.push(data);
    return data;
  }

  // 2. User Preferences
  public async getUserPreferences(userId: string): Promise<UserPreferences> {
    if (memoryPreferences[userId]) return memoryPreferences[userId];
    return {
      userId,
      inAppEnabled: true,
      emailEnabled: true,
      smsEnabled: true
    };
  }

  public async updateUserPreferences(userId: string, prefs: Partial<UserPreferences>) {
    const current = await this.getUserPreferences(userId);
    const updated = { ...current, ...prefs };
    memoryPreferences[userId] = updated;
    return updated;
  }

  // 3. Notification History & Delivery Status
  public async listHistory(recipientId?: string, status?: string) {
    return memoryDeliveryLogs.filter(log => {
      if (recipientId && log.recipientId !== recipientId) return false;
      if (status && log.status !== status) return false;
      return true;
    });
  }

  public async getInbox(userId: string) {
    return memoryDeliveryLogs.filter(
      log => log.recipientId === userId && log.channel === 'IN_APP'
    );
  }

  // 4. Asynchronous Queue & Background Worker
  public async enqueueNotification(data: {
    recipientId: string;
    event: string;
    channel: string;
    title: string;
    body: string;
    scheduledFor?: Date;
  }) {
    const log: DeliveryLog = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientId: data.recipientId,
      event: data.event,
      channel: data.channel,
      title: data.title,
      body: data.body,
      status: 'QUEUED',
      retryCount: 0,
      maxRetries: 3,
      scheduledFor: data.scheduledFor,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryDeliveryLogs.unshift(log);
    memoryQueue.push(log);

    // Trigger async queue processing
    this.processQueue();
    return log;
  }

  public async processQueue() {
    while (memoryQueue.length > 0) {
      const job = memoryQueue.shift();
      if (!job) break;

      // Check scheduled date
      if (job.scheduledFor && new Date(job.scheduledFor) > new Date()) {
        continue;
      }

      // Verify recipient preferences
      const prefs = await this.getUserPreferences(job.recipientId);
      if (job.channel === 'EMAIL' && !prefs.emailEnabled) {
        job.status = 'FAILED';
        job.error = 'Suppressed by user email channel preference';
        continue;
      }
      if (job.channel === 'SMS' && !prefs.smsEnabled) {
        job.status = 'FAILED';
        job.error = 'Suppressed by user SMS channel preference';
        continue;
      }
      if (job.channel === 'IN_APP' && !prefs.inAppEnabled) {
        job.status = 'FAILED';
        job.error = 'Suppressed by user In-App channel preference';
        continue;
      }

      // Dispatch via Channel Provider
      const provider = ChannelFactory.getProvider(job.channel);
      const result = await provider.send({
        recipientId: job.recipientId,
        title: job.title,
        body: job.body
      });

      if (result.success) {
        job.status = 'DELIVERED';
        job.updatedAt = new Date();
      } else {
        job.status = 'FAILED';
        job.error = result.error || 'Provider delivery error';
        job.updatedAt = new Date();
      }
    }
  }

  // 5. Retry Handling Engine
  public async retryFailedNotifications() {
    const failedLogs = memoryDeliveryLogs.filter(
      log => log.status === 'FAILED' && log.retryCount < log.maxRetries
    );

    for (const log of failedLogs) {
      log.retryCount += 1;
      log.status = 'QUEUED';
      memoryQueue.push(log);
    }

    await this.processQueue();
    return { retriedCount: failedLogs.length };
  }

  // 6. System Event Trigger Handler
  public async triggerEvent(event: string, payload: any) {
    const template = await this.getTemplateByEvent(event);

    // Substitute template placeholders e.g. {{studentName}}, {{feeAmount}}, {{dueDate}}
    let title = template.titleTemplate;
    let body = template.bodyTemplate;

    for (const key of Object.keys(payload)) {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(payload[key]));
      body = body.replace(new RegExp(placeholder, 'g'), String(payload[key]));
    }

    const recipients = Array.isArray(payload.recipientIds)
      ? payload.recipientIds
      : [payload.recipientId || 'st-1'];

    const dispatchedLogs: DeliveryLog[] = [];

    for (const recipientId of recipients) {
      for (const channel of template.channels) {
        const log = await this.enqueueNotification({
          recipientId,
          event,
          channel,
          title,
          body,
          scheduledFor: payload.scheduledFor ? new Date(payload.scheduledFor) : undefined
        });
        dispatchedLogs.push(log);
      }
    }

    return { event, totalDispatched: dispatchedLogs.length, logs: dispatchedLogs };
  }
}

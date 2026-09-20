import { NotificationsRepository, NotificationTemplate } from './repository.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class NotificationsService {
  private repo = new NotificationsRepository();

  public async getTemplates() {
    return await this.repo.listTemplates();
  }

  public async createTemplate(data: NotificationTemplate) {
    if (!data.event || !data.titleTemplate || !data.bodyTemplate) {
      throw new BadRequestError('Event name, title template, and body template are required.');
    }
    return await this.repo.createTemplate(data);
  }

  public async getUserPreferences(userId: string) {
    return await this.repo.getUserPreferences(userId);
  }

  public async updateUserPreferences(userId: string, prefs: any) {
    return await this.repo.updateUserPreferences(userId, prefs);
  }

  public async getHistory(recipientId?: string, status?: string) {
    return await this.repo.listHistory(recipientId, status);
  }

  public async getInbox(userId: string) {
    return await this.repo.getInbox(userId);
  }

  public async triggerEvent(event: string, payload: any) {
    const validEvents = [
      'STUDENT_ABSENT',
      'FEE_GENERATED',
      'FEE_OVERDUE',
      'RESULT_PUBLISHED',
      'ADMISSION_STATUS_CHANGED',
      'ANNOUNCEMENT_PUBLISHED'
    ];

    if (!validEvents.includes(event.toUpperCase())) {
      throw new BadRequestError(`Invalid event '${event}'. Allowed: ${validEvents.join(', ')}`);
    }

    return await this.repo.triggerEvent(event.toUpperCase(), payload || {});
  }

  public async scheduleNotification(data: any) {
    if (!data.scheduledFor) {
      throw new BadRequestError('scheduledFor timestamp is required for scheduled notifications.');
    }
    return await this.repo.triggerEvent(data.event || 'ANNOUNCEMENT_PUBLISHED', data);
  }

  public async sendBulkNotification(data: any) {
    if (!data.recipientIds || !Array.isArray(data.recipientIds)) {
      throw new BadRequestError('recipientIds array is required for bulk notification dispatch.');
    }
    return await this.repo.triggerEvent(data.event || 'ANNOUNCEMENT_PUBLISHED', data);
  }

  public async retryFailedNotifications() {
    return await this.repo.retryFailedNotifications();
  }
}

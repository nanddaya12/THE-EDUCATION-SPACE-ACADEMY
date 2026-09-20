import { Response, NextFunction } from 'express';
import { NotificationsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class NotificationsController {
  private service = new NotificationsService();

  public async getInbox(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const inbox = await this.service.getInbox(userId);
      return res.status(200).json({ success: true, data: inbox });
    } catch (err) {
      return next(err);
    }
  }

  public async getTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const templates = await this.service.getTemplates();
      return res.status(200).json({ success: true, data: templates });
    } catch (err) {
      return next(err);
    }
  }

  public async createTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const template = await this.service.createTemplate(req.body);
      return res.status(201).json({ success: true, data: template });
    } catch (err) {
      return next(err);
    }
  }

  public async getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const prefs = await this.service.getUserPreferences(userId);
      return res.status(200).json({ success: true, data: prefs });
    } catch (err) {
      return next(err);
    }
  }

  public async updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const prefs = await this.service.updateUserPreferences(userId, req.body);
      return res.status(200).json({ success: true, data: prefs });
    } catch (err) {
      return next(err);
    }
  }

  public async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recipientId = req.query.recipientId as string;
      const status = req.query.status as string;
      const history = await this.service.getHistory(recipientId, status);
      return res.status(200).json({ success: true, data: history });
    } catch (err) {
      return next(err);
    }
  }

  public async triggerEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { event, payload } = req.body;
      const result = await this.service.triggerEvent(event, payload);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async scheduleNotification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.scheduleNotification(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async sendBulk(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.sendBulkNotification(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async retryFailed(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.retryFailedNotifications();
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

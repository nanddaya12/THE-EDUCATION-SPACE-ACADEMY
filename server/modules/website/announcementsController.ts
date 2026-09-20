import { Request, Response, NextFunction } from 'express';
import { AnnouncementsService } from './announcementsService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AnnouncementsController {
  private service = new AnnouncementsService();

  // Public Endpoints
  public async getPublicAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const query = req.query.q as string;
      const announcements = await this.service.getPublicAnnouncements({ category, query });
      return res.status(200).json({ success: true, data: announcements });
    } catch (err) { return next(err); }
  }

  public async getFeaturedAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const featured = await this.service.getFeaturedAnnouncements();
      return res.status(200).json({ success: true, data: featured });
    } catch (err) { return next(err); }
  }

  public async getAnnouncementBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const ann = await this.service.getAnnouncementBySlug(slug);
      return res.status(200).json({ success: true, data: ann });
    } catch (err) { return next(err); }
  }

  // Admin CMS Endpoints
  public async listAdminAnnouncements(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const items = await this.service.listAdminAnnouncements(status, category);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const author = {
        id: req.user?.userId || 'admin-1',
        name: req.user?.email || 'System Admin',
        role: req.user?.role || 'SUPER_ADMIN'
      };
      const ann = await this.service.createAnnouncement({ ...req.body, author });
      return res.status(201).json({ success: true, data: ann });
    } catch (err) { return next(err); }
  }

  public async updateAnnouncement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updated = await this.service.updateAnnouncement(id, req.body, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async updateAnnouncementStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateAnnouncementStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }
}

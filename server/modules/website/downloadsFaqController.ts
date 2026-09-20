import { Request, Response, NextFunction } from 'express';
import { DownloadsFaqService } from './downloadsFaqService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class DownloadsFaqController {
  private service = new DownloadsFaqService();

  // Public Downloads Handlers
  public async getPublicDownloads(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const query = req.query.q as string;
      const downloads = await this.service.getPublicDownloads(category, query);
      return res.status(200).json({ success: true, data: downloads });
    } catch (err) { return next(err); }
  }

  public async trackDownload(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.trackDownload(id);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // Public FAQs Handlers
  public async getPublicFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const query = req.query.q as string;
      const faqs = await this.service.getPublicFaqs(category, query);
      return res.status(200).json({ success: true, data: faqs });
    } catch (err) { return next(err); }
  }

  // Admin Downloads Management Handlers
  public async listAdminDownloads(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const items = await this.service.listAdminDownloads(status, category);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createDownload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const doc = await this.service.createDownload(req.body, userId);
      return res.status(201).json({ success: true, data: doc });
    } catch (err) { return next(err); }
  }

  public async updateDownloadStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateDownloadStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async deleteDownload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.deleteDownload(id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // Admin FAQs Management Handlers
  public async listAdminFaqs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const items = await this.service.listAdminFaqs(status, category);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createFaq(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const faq = await this.service.createFaq(req.body, userId);
      return res.status(201).json({ success: true, data: faq });
    } catch (err) { return next(err); }
  }

  public async updateFaq(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updated = await this.service.updateFaq(id, req.body, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async updateFaqStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateFaqStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async reorderFaqs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orders } = req.body;
      const userId = req.user?.userId;
      const faqs = await this.service.reorderFaqs(orders, userId);
      return res.status(200).json({ success: true, data: faqs });
    } catch (err) { return next(err); }
  }

  public async deleteFaq(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.deleteFaq(id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }
}

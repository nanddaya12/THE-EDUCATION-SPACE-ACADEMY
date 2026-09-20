import { Request, Response, NextFunction } from 'express';
import { NewsService } from './newsService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class NewsController {
  private service = new NewsService();

  // Public Endpoints
  public async getPublicNews(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const query = req.query.q as string;
      const news = await this.service.getPublicNews({ category, query });
      return res.status(200).json({ success: true, data: news });
    } catch (err) { return next(err); }
  }

  public async getLatestNews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const latest = await this.service.getLatestNews(limit);
      return res.status(200).json({ success: true, data: latest });
    } catch (err) { return next(err); }
  }

  public async getNewsBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const article = await this.service.getNewsBySlug(slug);
      return res.status(200).json({ success: true, data: article });
    } catch (err) { return next(err); }
  }

  public async getRelatedNews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const related = await this.service.getRelatedNews(id, limit);
      return res.status(200).json({ success: true, data: related });
    } catch (err) { return next(err); }
  }

  // Admin CMS Endpoints
  public async listAdminNews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const items = await this.service.listAdminNews(status, category);
      return res.status(200).json({ success: true, data: items });
    } catch (err) { return next(err); }
  }

  public async createNewsArticle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const author = {
        id: req.user?.userId || 'admin-1',
        name: req.user?.email || 'System Editor',
        role: req.user?.role || 'SUPER_ADMIN'
      };
      const article = await this.service.createNewsArticle({ ...req.body, author });
      return res.status(201).json({ success: true, data: article });
    } catch (err) { return next(err); }
  }

  public async updateNewsArticle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updated = await this.service.updateNewsArticle(id, req.body, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async updateNewsStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const updated = await this.service.updateNewsStatus(id, status, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }

  public async deleteNewsArticle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.deleteNewsArticle(id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }
}

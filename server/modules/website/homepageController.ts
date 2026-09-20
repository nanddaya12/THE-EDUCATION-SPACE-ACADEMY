import { Request, Response, NextFunction } from 'express';
import { HomepageService } from './homepageService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class HomepageController {
  private service = new HomepageService();

  public async getPublicHomepage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getPublicHomepage();
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getAdminHomepage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getAdminHomepage();
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async updateAdminHomepage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const updated = await this.service.updateAdminHomepage(req.body, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) { return next(err); }
  }
}

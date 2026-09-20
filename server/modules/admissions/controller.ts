import { Request, Response, NextFunction } from 'express';
import { AdmissionsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AdmissionsController {
  private service = new AdmissionsService();

  public async getApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      const result = await this.service.getApplications({ campusId, search, status, page, limit });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getApplicationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const app = await this.service.getApplicationById(id);
      return res.status(200).json({ success: true, data: app });
    } catch (err) {
      return next(err);
    }
  }

  public async createApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const institutionId = req.user?.institutionId || 'inst-1';
      const campusId = req.user?.campusId || req.body.campusId || 'camp-north';
      const appData = { ...req.body, institutionId, campusId };

      const app = await this.service.createApplication(appData);
      return res.status(201).json({ success: true, data: app });
    } catch (err) {
      return next(err);
    }
  }

  public async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updated = await this.service.updateStatus(id, { ...req.body, userId });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async convertApplicantToStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.service.convertApplicantToStudent(id, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

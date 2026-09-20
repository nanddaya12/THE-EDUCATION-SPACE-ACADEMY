import { Response, NextFunction } from 'express';
import { AuditService } from './auditService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AuditController {
  private service = new AuditService();

  public async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        module: req.query.module as string,
        action: req.query.action as string,
        userEmail: req.query.userEmail as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        q: req.query.q as string,
        page: parseInt(req.query.page as string || '1'),
        limit: parseInt(req.query.limit as string || '20')
      };

      const data = await this.service.getAuditLogs(filters);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }
}

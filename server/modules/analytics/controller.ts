import { Response, NextFunction } from 'express';
import { AnalyticsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AnalyticsController {
  private service = new AnalyticsService();

  private resolveCampusScope(req: AuthenticatedRequest): string | undefined {
    // If CAMPUS_ADMIN, enforce user campusId
    if (req.user?.role === 'CAMPUS_ADMIN' && req.user?.campusId) {
      return req.user.campusId;
    }
    // Otherwise allow optional query param for SUPER_ADMIN
    return req.query.campusId as string | undefined;
  }

  public async getExecutiveDashboardData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = this.resolveCampusScope(req);
      const data = await this.service.getExecutiveDashboardData(campusId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getStudentAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = this.resolveCampusScope(req);
      const data = await this.service.getStudentAnalytics(campusId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getAttendanceAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = this.resolveCampusScope(req);
      const data = await this.service.getAttendanceAnalytics(campusId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getFinanceAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = this.resolveCampusScope(req);
      const data = await this.service.getFinanceAnalytics(campusId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getAcademicAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = this.resolveCampusScope(req);
      const data = await this.service.getAcademicAnalytics(campusId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }
}

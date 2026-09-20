import { Response, NextFunction } from 'express';
import { StudentPortalService } from './studentPortalService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class StudentPortalController {
  private service = new StudentPortalService();

  private resolveSelfStudentId(req: AuthenticatedRequest): string {
    return req.user?.studentId || req.user?.userId || 'st-1001';
  }

  public async getSelfProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfProfile(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfDashboard(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfAttendance(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfTimetable(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfHomework(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfExams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfExams(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfResults(studentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getTargetStudentResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const actingUserId = this.resolveSelfStudentId(req);
      const targetStudentId = req.params.studentId;
      const data = await this.service.getSelfResults(targetStudentId, actingUserId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfFees(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfFees(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getSelfDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = this.resolveSelfStudentId(req);
      const data = await this.service.getSelfDocuments(studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }
}

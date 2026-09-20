import { Response, NextFunction } from 'express';
import { ParentService } from './parentService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class ParentController {
  private service = new ParentService();

  private resolveParentId(req: AuthenticatedRequest): string {
    return req.user?.userId || 'parent-1';
  }

  public async getLinkedChildren(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const data = await this.service.getLinkedChildren(parentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildDashboard(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildAttendance(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildFees(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildFees(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildResults(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildTimetable(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildHomework(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getChildMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentId = this.resolveParentId(req);
      const studentId = req.params.studentId;
      const data = await this.service.getChildMessages(parentId, studentId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }
}

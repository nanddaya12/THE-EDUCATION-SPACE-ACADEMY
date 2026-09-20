import { Response, NextFunction } from 'express';
import { TeacherPortalService } from './teacherPortalService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class TeacherPortalController {
  private service = new TeacherPortalService();

  private resolveTeacherId(req: AuthenticatedRequest): string {
    return req.user?.teacherId || req.user?.userId || 'teacher-101';
  }

  public async getTeacherDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.getTeacherDashboard(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getTeacherSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.getTeacherSchedule(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async getClassStudents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const classId = req.params.classId;
      const data = await this.service.getClassStudents(teacherId, classId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async markClassAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const classId = req.params.classId;
      const data = await this.service.markClassAttendance(teacherId, classId, req.body.records || []);
      return res.status(200).json({ success: true, message: 'Attendance marked successfully!', data });
    } catch (err) { return next(err); }
  }

  public async getHomeworkList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.getHomeworkList(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async createHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.createHomework(teacherId, req.body);
      return res.status(201).json({ success: true, message: 'Homework assignment created!', data });
    } catch (err) { return next(err); }
  }

  public async getExamsList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.getExamsList(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async enterExamMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const examId = req.params.examId;
      const data = await this.service.enterExamMarks(teacherId, examId, req.body);
      return res.status(200).json({ success: true, message: 'Student exam marks published!', data });
    } catch (err) { return next(err); }
  }

  public async getLeaveRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.getLeaveRequests(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async submitLeaveRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = this.resolveTeacherId(req);
      const data = await this.service.submitLeaveRequest(teacherId, req.body);
      return res.status(201).json({ success: true, message: 'Leave application submitted!', data });
    } catch (err) { return next(err); }
  }
}

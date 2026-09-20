import { Response, NextFunction } from 'express';
import { AttendanceService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AttendanceController {
  private service = new AttendanceService();

  public async markDaily(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = {
        userId: req.user!.userId,
        role: req.user!.role,
        campusId: req.user!.campusId || undefined
      };
      const record = await this.service.markDailyAttendance(req.body, user);
      return res.status(200).json({ success: true, data: record });
    } catch (err) {
      return next(err);
    }
  }

  public async markBulk(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = {
        userId: req.user!.userId,
        role: req.user!.role,
        campusId: req.user!.campusId || undefined
      };
      const records = await this.service.markBulkAttendance(req.body, user);
      return res.status(200).json({ success: true, data: records });
    } catch (err) {
      return next(err);
    }
  }

  public async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;
      const studentId = req.query.studentId as string;
      const staffId = req.query.staffId as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const status = req.query.status as string;

      const history = await this.service.getHistory({
        campusId,
        classId,
        sectionId,
        studentId,
        staffId,
        startDate,
        endDate,
        status
      });

      return res.status(200).json({ success: true, data: history });
    } catch (err) {
      return next(err);
    }
  }

  public async getStudentAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const data = await this.service.getStudentAttendance(studentId, { startDate, endDate });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  public async getTeacherAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { staffId } = req.params;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const data = await this.service.getTeacherAttendance(staffId, { startDate, endDate });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  public async requestCorrection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const correction = await this.service.requestCorrection(req.body, userId);
      return res.status(201).json({ success: true, data: correction });
    } catch (err) {
      return next(err);
    }
  }

  public async listCorrections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const corrections = await this.service.listCorrections(status);
      return res.status(200).json({ success: true, data: corrections });
    } catch (err) {
      return next(err);
    }
  }

  public async approveCorrection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const approvedBy = req.user!.userId;
      const updated = await this.service.approveCorrection(id, approvedBy);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async rejectCorrection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rejectedBy = req.user!.userId;
      const updated = await this.service.rejectCorrection(id, rejectedBy);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async getReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;
      const studentId = req.query.studentId as string;
      const staffId = req.query.staffId as string;

      const report = await this.service.getReport({ campusId, classId, sectionId, studentId, staffId });
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  public async getMonthlyReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const month = req.query.month ? Number(req.query.month) : undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;

      const report = await this.service.getMonthlyReport({ month, year, classId, sectionId, campusId });
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  public async getTermReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const termId = req.query.termId as string;
      const sessionId = req.query.sessionId as string;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;

      const report = await this.service.getTermReport({ termId, sessionId, classId, sectionId });
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  public async getClassReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const classId = req.query.classId as string || 'c1';
      const sectionId = req.query.sectionId as string;
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;

      const report = await this.service.getClassReport({ classId, sectionId, campusId });
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  public async ingestBiometricScan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.processBiometricScan(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

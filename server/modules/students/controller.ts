import { Request, Response, NextFunction } from 'express';
import { StudentService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class StudentController {
  private service = new StudentService();

  public async getStudents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      const result = await this.service.getStudents({ campusId, search, status, page, limit });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getStudentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await this.service.getStudentById(id);
      return res.status(200).json({ success: true, data: student });
    } catch (err) {
      return next(err);
    }
  }

  public async createStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const institutionId = req.user?.institutionId || 'inst-1';
      const campusId = req.user?.campusId || req.body.campusId || 'camp-north';
      const studentData = { ...req.body, institutionId, campusId };

      const student = await this.service.createStudent(studentData);
      return res.status(201).json({ success: true, data: student });
    } catch (err) {
      return next(err);
    }
  }

  public async updateStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await this.service.updateStudent(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async archiveStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const archived = await this.service.archiveStudent(id);
      return res.status(200).json({ success: true, data: archived });
    } catch (err) {
      return next(err);
    }
  }

  public async bulkAction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { action, ids, status } = req.body;
      const result = await this.service.bulkAction(action, ids, status);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

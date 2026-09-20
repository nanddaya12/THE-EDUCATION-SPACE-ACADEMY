import { Request, Response, NextFunction } from 'express';
import { AcademicsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AcademicsController {
  private service = new AcademicsService();

  public async getSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessions = await this.service.getSessions(req.user?.institutionId);
      return res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      return next(err);
    }
  }

  public async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const session = await this.service.createSession(req.body);
      return res.status(201).json({ success: true, data: session });
    } catch (err) {
      return next(err);
    }
  }

  public async getTerms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.query;
      const terms = await this.service.getTerms(sessionId as string);
      return res.status(200).json({ success: true, data: terms });
    } catch (err) {
      return next(err);
    }
  }

  public async createTerm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const term = await this.service.createTerm(req.body);
      return res.status(201).json({ success: true, data: term });
    } catch (err) {
      return next(err);
    }
  }

  public async getClasses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const classes = await this.service.getClasses(campusId);
      return res.status(200).json({ success: true, data: classes });
    } catch (err) {
      return next(err);
    }
  }

  public async createClass(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = req.user?.campusId || req.body.campusId;
      const createdClass = await this.service.createClass({ ...req.body, campusId });
      return res.status(201).json({ success: true, data: createdClass });
    } catch (err) {
      return next(err);
    }
  }

  public async getSections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { classId } = req.query;
      const sections = await this.service.getSections(classId as string);
      return res.status(200).json({ success: true, data: sections });
    } catch (err) {
      return next(err);
    }
  }

  public async createSection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const section = await this.service.createSection(req.body);
      return res.status(201).json({ success: true, data: section });
    } catch (err) {
      return next(err);
    }
  }

  public async getSubjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { classId } = req.query;
      const subjects = await this.service.getSubjects(classId as string);
      return res.status(200).json({ success: true, data: subjects });
    } catch (err) {
      return next(err);
    }
  }

  public async createSubject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const subject = await this.service.createSubject(req.body);
      return res.status(201).json({ success: true, data: subject });
    } catch (err) {
      return next(err);
    }
  }

  public async getTeacherAssignedCourses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherUserId = req.user!.userId;
      const courses = await this.service.getTeacherAssignedCourses(teacherUserId);
      return res.status(200).json({ success: true, data: courses });
    } catch (err) {
      return next(err);
    }
  }
}

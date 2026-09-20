import { Response, NextFunction } from 'express';
import { HomeworkRepository } from './homeworkRepository.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class HomeworkController {
  private repo = new HomeworkRepository();

  public async getHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;
      const status = req.query.status as string;

      // If user is STUDENT, default to status=PUBLISHED if not specified
      const finalStatus = (req.user?.role === 'STUDENT' && !status) ? 'PUBLISHED' : status;

      const items = await this.repo.listHomework({ campusId, classId, sectionId, status: finalStatus });
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      return next(err);
    }
  }

  public async createHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teacherId = req.user!.userId;
      const dueDate = new Date(req.body.dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000);
      const hw = await this.repo.createHomework({ ...req.body, teacherId, dueDate });
      return res.status(201).json({ success: true, data: hw });
    } catch (err) {
      return next(err);
    }
  }

  public async updateHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teacherId = req.user!.userId;
      const dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;
      const updated = await this.repo.updateHomework(id, teacherId, { ...req.body, dueDate });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async publishHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teacherId = req.user!.userId;
      const published = await this.repo.publishHomework(id, teacherId);
      return res.status(200).json({ success: true, data: published });
    } catch (err) {
      return next(err);
    }
  }

  public async submitHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // homeworkId
      const studentId = req.user!.userId;
      const submission = await this.repo.submitHomework({ ...req.body, homeworkId: id, studentId });
      return res.status(201).json({ success: true, data: submission });
    } catch (err) {
      return next(err);
    }
  }

  public async getHomeworkSubmissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const submissions = await this.repo.getHomeworkSubmissions(id);
      return res.status(200).json({ success: true, data: submissions });
    } catch (err) {
      return next(err);
    }
  }

  public async reviewSubmission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { submissionId } = req.params;
      const teacherId = req.user!.userId;
      const reviewed = await this.repo.reviewSubmission({ ...req.body, submissionId, teacherId });
      return res.status(200).json({ success: true, data: reviewed });
    } catch (err) {
      return next(err);
    }
  }

  public async getChildHomework(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const parentUserId = req.user!.userId;
      const items = await this.repo.getChildHomework(parentUserId, studentId);
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      return next(err);
    }
  }
}

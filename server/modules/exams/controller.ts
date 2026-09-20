import { Response, NextFunction } from 'express';
import { ExamsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class ExamsController {
  private service = new ExamsService();

  public async getExamTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const types = await this.service.getExamTypes();
      return res.status(200).json({ success: true, data: types });
    } catch (err) {
      return next(err);
    }
  }

  public async createExamType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const type = await this.service.createExamType(req.body);
      return res.status(201).json({ success: true, data: type });
    } catch (err) {
      return next(err);
    }
  }

  public async getGradingSchemes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const schemes = await this.service.getGradingSchemes();
      return res.status(200).json({ success: true, data: schemes });
    } catch (err) {
      return next(err);
    }
  }

  public async createGradingScheme(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const scheme = await this.service.createGradingScheme(req.body);
      return res.status(201).json({ success: true, data: scheme });
    } catch (err) {
      return next(err);
    }
  }

  public async getExams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const status = req.query.status as string;

      const exams = await this.service.getExams({ campusId, status });
      return res.status(200).json({ success: true, data: exams });
    } catch (err) {
      return next(err);
    }
  }

  public async createExam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = req.body.campusId || req.user?.campusId || undefined;
      const exam = await this.service.createExam({ ...req.body, campusId });
      return res.status(201).json({ success: true, data: exam });
    } catch (err) {
      return next(err);
    }
  }

  public async transitionWorkflow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = { userId: req.user!.userId, role: req.user!.role };
      const updated = await this.service.transitionWorkflow(id, status, user);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async createSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await this.service.createSchedule(req.body);
      return res.status(201).json({ success: true, data: schedule });
    } catch (err) {
      return next(err);
    }
  }

  public async createComponent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const comp = await this.service.createComponent(req.body);
      return res.status(201).json({ success: true, data: comp });
    } catch (err) {
      return next(err);
    }
  }

  public async enterMark(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = { userId: req.user!.userId, role: req.user!.role };
      const record = await this.service.enterMark(req.body, user);
      return res.status(200).json({ success: true, data: record });
    } catch (err) {
      return next(err);
    }
  }

  public async overrideMark(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = { userId: req.user!.userId, role: req.user!.role };
      const record = await this.service.overridePublishedMark(req.body, user);
      return res.status(200).json({ success: true, data: record });
    } catch (err) {
      return next(err);
    }
  }

  public async enterBulkMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = { userId: req.user!.userId, role: req.user!.role };
      const records = await this.service.enterBulkMarks(req.body, user);
      return res.status(200).json({ success: true, data: records });
    } catch (err) {
      return next(err);
    }
  }

  public async calculateResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.calculateExamResults(id);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getReportCard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, studentId } = req.params;
      const reportCard = await this.service.getReportCard(id, studentId);
      return res.status(200).json({ success: true, data: reportCard });
    } catch (err) {
      return next(err);
    }
  }

  public async getTranscript(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const transcript = await this.service.getTranscript(studentId);
      return res.status(200).json({ success: true, data: transcript });
    } catch (err) {
      return next(err);
    }
  }
}

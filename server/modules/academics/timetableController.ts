import { Response, NextFunction } from 'express';
import { TimetableRepository } from './timetableRepository.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class TimetableController {
  private repo = new TimetableRepository();

  public async getSlots(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;
      const teacherId = req.query.teacherId as string;
      const dayOfWeek = req.query.dayOfWeek as string;

      const slots = await this.repo.listSlots({ campusId, classId, sectionId, teacherId, dayOfWeek });
      return res.status(200).json({ success: true, data: slots });
    } catch (err) {
      return next(err);
    }
  }

  public async createSlot(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = req.user?.campusId || req.body.campusId;
      const slot = await this.repo.createSlot({ ...req.body, campusId });
      return res.status(201).json({ success: true, data: slot });
    } catch (err) {
      return next(err);
    }
  }

  public async getMyTimetable(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const slots = await this.repo.getMyTimetable(userId, role);
      return res.status(200).json({ success: true, data: slots });
    } catch (err) {
      return next(err);
    }
  }

  public async deleteSlot(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.repo.deleteSlot(id);
      return res.status(200).json({ success: true, message: 'Timetable slot deleted' });
    } catch (err) {
      return next(err);
    }
  }
}

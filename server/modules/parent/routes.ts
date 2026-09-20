import { Router } from 'express';
import { ParentController } from './parentController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';

export const parentRouter = Router();
const controller = new ParentController();

parentRouter.get('/status', (req, res) => res.json({ success: true, module: 'parent', initialized: true }));

parentRouter.get('/children', authenticate, (req, res, next) =>
  controller.getLinkedChildren(req, res, next)
);

parentRouter.get('/children/:studentId/dashboard', authenticate, (req, res, next) =>
  controller.getChildDashboard(req, res, next)
);

parentRouter.get('/children/:studentId/attendance', authenticate, (req, res, next) =>
  controller.getChildAttendance(req, res, next)
);

parentRouter.get('/children/:studentId/fees', authenticate, (req, res, next) =>
  controller.getChildFees(req, res, next)
);

parentRouter.get('/children/:studentId/results', authenticate, (req, res, next) =>
  controller.getChildResults(req, res, next)
);

parentRouter.get('/children/:studentId/timetable', authenticate, (req, res, next) =>
  controller.getChildTimetable(req, res, next)
);

parentRouter.get('/children/:studentId/homework', authenticate, (req, res, next) =>
  controller.getChildHomework(req, res, next)
);

parentRouter.get('/children/:studentId/messages', authenticate, (req, res, next) =>
  controller.getChildMessages(req, res, next)
);

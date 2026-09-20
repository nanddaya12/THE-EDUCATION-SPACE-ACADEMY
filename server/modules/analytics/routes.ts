import { Router } from 'express';
import { AnalyticsController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission } from '../../core/middleware/permissionMiddleware.js';

export const analyticsRouter = Router();
const controller = new AnalyticsController();

analyticsRouter.get('/status', (req, res) => res.json({ success: true, module: 'analytics', initialized: true }));

analyticsRouter.get('/dashboard', authenticate, (req, res, next) =>
  controller.getExecutiveDashboardData(req, res, next)
);

analyticsRouter.get('/students', authenticate, (req, res, next) =>
  controller.getStudentAnalytics(req, res, next)
);

analyticsRouter.get('/attendance', authenticate, (req, res, next) =>
  controller.getAttendanceAnalytics(req, res, next)
);

analyticsRouter.get('/finance', authenticate, (req, res, next) =>
  controller.getFinanceAnalytics(req, res, next)
);

analyticsRouter.get('/academics', authenticate, (req, res, next) =>
  controller.getAcademicAnalytics(req, res, next)
);

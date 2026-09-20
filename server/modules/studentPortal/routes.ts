import { Router } from 'express';
import { StudentPortalController } from './studentPortalController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';

export const studentPortalRouter = Router();
const controller = new StudentPortalController();

studentPortalRouter.get('/status', (req, res) => res.json({ success: true, module: 'student-portal', initialized: true }));

// Logged-in Student Self Service Endpoints
studentPortalRouter.get('/me/profile', authenticate, (req, res, next) =>
  controller.getSelfProfile(req, res, next)
);

studentPortalRouter.get('/me/dashboard', authenticate, (req, res, next) =>
  controller.getSelfDashboard(req, res, next)
);

studentPortalRouter.get('/me/attendance', authenticate, (req, res, next) =>
  controller.getSelfAttendance(req, res, next)
);

studentPortalRouter.get('/me/timetable', authenticate, (req, res, next) =>
  controller.getSelfTimetable(req, res, next)
);

studentPortalRouter.get('/me/homework', authenticate, (req, res, next) =>
  controller.getSelfHomework(req, res, next)
);

studentPortalRouter.get('/me/exams', authenticate, (req, res, next) =>
  controller.getSelfExams(req, res, next)
);

studentPortalRouter.get('/me/results', authenticate, (req, res, next) =>
  controller.getSelfResults(req, res, next)
);

studentPortalRouter.get('/me/fees', authenticate, (req, res, next) =>
  controller.getSelfFees(req, res, next)
);

studentPortalRouter.get('/me/documents', authenticate, (req, res, next) =>
  controller.getSelfDocuments(req, res, next)
);

// Target Student Access Endpoint (Guarded by Self Access Validation)
studentPortalRouter.get('/:studentId/results', authenticate, (req, res, next) =>
  controller.getTargetStudentResults(req, res, next)
);

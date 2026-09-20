import { Router } from 'express';
import { TeacherPortalController } from './teacherPortalController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';

export const teacherPortalRouter = Router();
const controller = new TeacherPortalController();

teacherPortalRouter.get('/status', (req, res) => res.json({ success: true, module: 'teacher-portal', initialized: true }));

teacherPortalRouter.get('/dashboard', authenticate, (req, res, next) =>
  controller.getTeacherDashboard(req, res, next)
);

teacherPortalRouter.get('/schedule', authenticate, (req, res, next) =>
  controller.getTeacherSchedule(req, res, next)
);

teacherPortalRouter.get('/classes/:classId/students', authenticate, (req, res, next) =>
  controller.getClassStudents(req, res, next)
);

teacherPortalRouter.post('/classes/:classId/attendance', authenticate, (req, res, next) =>
  controller.markClassAttendance(req, res, next)
);

teacherPortalRouter.get('/homework', authenticate, (req, res, next) =>
  controller.getHomeworkList(req, res, next)
);

teacherPortalRouter.post('/homework', authenticate, (req, res, next) =>
  controller.createHomework(req, res, next)
);

teacherPortalRouter.get('/exams', authenticate, (req, res, next) =>
  controller.getExamsList(req, res, next)
);

teacherPortalRouter.post('/exams/:examId/marks', authenticate, (req, res, next) =>
  controller.enterExamMarks(req, res, next)
);

teacherPortalRouter.get('/leave-requests', authenticate, (req, res, next) =>
  controller.getLeaveRequests(req, res, next)
);

teacherPortalRouter.post('/leave-requests', authenticate, (req, res, next) =>
  controller.submitLeaveRequest(req, res, next)
);

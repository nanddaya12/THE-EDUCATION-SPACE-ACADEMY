import { Router } from 'express';
import { AttendanceController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess } from '../../core/middleware/permissionMiddleware.js';

export const attendanceRouter = Router();
const controller = new AttendanceController();

attendanceRouter.get('/status', (req, res) => res.json({ success: true, module: 'attendance', initialized: true }));

attendanceRouter.post('/mark-daily', authenticate, hasPermission('attendance.mark'), verifyCampusAccess, (req, res, next) =>
  controller.markDaily(req, res, next)
);

attendanceRouter.post('/mark-bulk', authenticate, hasPermission('attendance.mark'), verifyCampusAccess, (req, res, next) =>
  controller.markBulk(req, res, next)
);

attendanceRouter.get('/history', authenticate, hasPermission('attendance.view'), verifyCampusAccess, (req, res, next) =>
  controller.getHistory(req, res, next)
);

attendanceRouter.get('/student/:studentId', authenticate, hasPermission('attendance.view'), (req, res, next) =>
  controller.getStudentAttendance(req, res, next)
);

attendanceRouter.get('/teacher/:staffId', authenticate, hasPermission('attendance.view'), (req, res, next) =>
  controller.getTeacherAttendance(req, res, next)
);

attendanceRouter.post('/corrections', authenticate, (req, res, next) =>
  controller.requestCorrection(req, res, next)
);

attendanceRouter.get('/corrections', authenticate, hasPermission('attendance.view'), (req, res, next) =>
  controller.listCorrections(req, res, next)
);

attendanceRouter.patch('/corrections/:id/approve', authenticate, hasPermission('attendance.edit'), verifyCampusAccess, (req, res, next) =>
  controller.approveCorrection(req, res, next)
);

attendanceRouter.patch('/corrections/:id/reject', authenticate, hasPermission('attendance.edit'), verifyCampusAccess, (req, res, next) =>
  controller.rejectCorrection(req, res, next)
);

attendanceRouter.get('/report', authenticate, hasPermission('attendance.view'), verifyCampusAccess, (req, res, next) =>
  controller.getReport(req, res, next)
);

attendanceRouter.get('/reports/monthly', authenticate, hasPermission('attendance.view'), verifyCampusAccess, (req, res, next) =>
  controller.getMonthlyReport(req, res, next)
);

attendanceRouter.get('/reports/term', authenticate, hasPermission('attendance.view'), verifyCampusAccess, (req, res, next) =>
  controller.getTermReport(req, res, next)
);

attendanceRouter.get('/reports/class', authenticate, hasPermission('attendance.view'), verifyCampusAccess, (req, res, next) =>
  controller.getClassReport(req, res, next)
);

attendanceRouter.post('/biometric/ingest', authenticate, (req, res, next) =>
  controller.ingestBiometricScan(req, res, next)
);

attendanceRouter.post('/device-ingest', authenticate, (req, res, next) =>
  controller.ingestBiometricScan(req, res, next)
);

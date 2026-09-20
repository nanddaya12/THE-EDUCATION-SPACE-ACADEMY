import { Router } from 'express';
import { HRController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission } from '../../core/middleware/permissionMiddleware.js';

export const hrRouter = Router();
const controller = new HRController();

hrRouter.get('/status', (req, res) => res.json({ success: true, module: 'hr', initialized: true }));

hrRouter.get('/departments', authenticate, (req, res, next) =>
  controller.getDepartments(req, res, next)
);

hrRouter.post('/departments', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createDepartment(req, res, next)
);

hrRouter.get('/designations', authenticate, (req, res, next) =>
  controller.getDesignations(req, res, next)
);

hrRouter.post('/designations', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createDesignation(req, res, next)
);

hrRouter.get('/staff', authenticate, (req, res, next) =>
  controller.getStaff(req, res, next)
);

hrRouter.post('/staff', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createStaff(req, res, next)
);

hrRouter.post('/attendance', authenticate, (req, res, next) =>
  controller.markAttendance(req, res, next)
);

hrRouter.get('/leaves', authenticate, (req, res, next) =>
  controller.getLeaves(req, res, next)
);

hrRouter.post('/leaves', authenticate, (req, res, next) =>
  controller.submitLeave(req, res, next)
);

hrRouter.patch('/leaves/:id/review', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.reviewLeave(req, res, next)
);

hrRouter.get('/salary-structures/:staffId', authenticate, (req, res, next) =>
  controller.getSalaryStructure(req, res, next)
);

hrRouter.post('/salary-structures', authenticate, hasPermission('payroll.manage'), (req, res, next) =>
  controller.setSalaryStructure(req, res, next)
);

hrRouter.post('/payroll/process', authenticate, hasPermission('payroll.manage'), (req, res, next) =>
  controller.processPayroll(req, res, next)
);

hrRouter.patch('/payroll/runs/:id/workflow', authenticate, hasPermission('payroll.manage'), (req, res, next) =>
  controller.transitionPayroll(req, res, next)
);

hrRouter.get('/payroll/history', authenticate, hasPermission('payroll.manage'), (req, res, next) =>
  controller.getPayrollHistory(req, res, next)
);

hrRouter.get('/payroll/payslips/:id', authenticate, (req, res, next) =>
  controller.getPayslip(req, res, next)
);

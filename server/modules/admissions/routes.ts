import { Router } from 'express';
import { AdmissionsController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess } from '../../core/middleware/permissionMiddleware.js';

export const admissionsRouter = Router();
const controller = new AdmissionsController();

admissionsRouter.get('/', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.getApplications(req, res, next)
);

admissionsRouter.post('/', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.createApplication(req, res, next)
);

admissionsRouter.get('/:id', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.getApplicationById(req, res, next)
);

admissionsRouter.patch('/:id/status', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.updateStatus(req, res, next)
);

admissionsRouter.post('/:id/convert', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.convertApplicantToStudent(req, res, next)
);

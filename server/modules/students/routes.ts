import { Router } from 'express';
import { StudentController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess, verifyStudentOwnership } from '../../core/middleware/permissionMiddleware.js';

export const studentsRouter = Router();
const controller = new StudentController();

studentsRouter.get('/', authenticate, hasPermission('students.view'), verifyCampusAccess, (req, res, next) =>
  controller.getStudents(req, res, next)
);

studentsRouter.post('/', authenticate, hasPermission('students.create'), verifyCampusAccess, (req, res, next) =>
  controller.createStudent(req, res, next)
);

studentsRouter.post('/bulk-action', authenticate, hasPermission('students.update'), verifyCampusAccess, (req, res, next) =>
  controller.bulkAction(req, res, next)
);

studentsRouter.get('/:id', authenticate, hasPermission('students.view'), verifyStudentOwnership, (req, res, next) =>
  controller.getStudentById(req, res, next)
);

studentsRouter.put('/:id', authenticate, hasPermission('students.update'), verifyCampusAccess, (req, res, next) =>
  controller.updateStudent(req, res, next)
);

studentsRouter.delete('/:id', authenticate, hasPermission('students.archive'), verifyCampusAccess, (req, res, next) =>
  controller.archiveStudent(req, res, next)
);

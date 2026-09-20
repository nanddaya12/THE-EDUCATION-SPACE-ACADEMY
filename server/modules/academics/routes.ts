import { Router } from 'express';
import { AcademicsController } from './controller.js';
import { TimetableController } from './timetableController.js';
import { HomeworkController } from './homeworkController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess } from '../../core/middleware/permissionMiddleware.js';

export const academicsRouter = Router();
const controller = new AcademicsController();
const timetableController = new TimetableController();
const homeworkController = new HomeworkController();

// Teacher Assigned Courses Endpoint (Guarded by authenticate)
academicsRouter.get('/my-assigned-courses', authenticate, (req, res, next) =>
  controller.getTeacherAssignedCourses(req, res, next)
);

// Academic Sessions Endpoints
academicsRouter.get('/sessions', authenticate, hasPermission('students.view'), (req, res, next) =>
  controller.getSessions(req, res, next)
);
academicsRouter.post('/sessions', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createSession(req, res, next)
);

// Academic Terms Endpoints
academicsRouter.get('/terms', authenticate, hasPermission('students.view'), (req, res, next) =>
  controller.getTerms(req, res, next)
);
academicsRouter.post('/terms', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createTerm(req, res, next)
);

// Classes Endpoints
academicsRouter.get('/classes', authenticate, hasPermission('students.view'), verifyCampusAccess, (req, res, next) =>
  controller.getClasses(req, res, next)
);
academicsRouter.post('/classes', authenticate, hasPermission('roles.manage'), verifyCampusAccess, (req, res, next) =>
  controller.createClass(req, res, next)
);

// Sections Endpoints
academicsRouter.get('/sections', authenticate, hasPermission('students.view'), (req, res, next) =>
  controller.getSections(req, res, next)
);
academicsRouter.post('/sections', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createSection(req, res, next)
);

// Subjects Endpoints
academicsRouter.get('/subjects', authenticate, hasPermission('students.view'), (req, res, next) =>
  controller.getSubjects(req, res, next)
);
academicsRouter.post('/subjects', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createSubject(req, res, next)
);

// Timetable Endpoints
academicsRouter.get('/timetable/my-timetable', authenticate, (req, res, next) =>
  timetableController.getMyTimetable(req, res, next)
);
academicsRouter.get('/timetable', authenticate, hasPermission('students.view'), verifyCampusAccess, (req, res, next) =>
  timetableController.getSlots(req, res, next)
);
academicsRouter.post('/timetable', authenticate, hasPermission('roles.manage'), verifyCampusAccess, (req, res, next) =>
  timetableController.createSlot(req, res, next)
);
academicsRouter.delete('/timetable/:id', authenticate, hasPermission('roles.manage'), verifyCampusAccess, (req, res, next) =>
  timetableController.deleteSlot(req, res, next)
);

// Homework & Assignments Endpoints
academicsRouter.get('/homework/child/:studentId', authenticate, (req, res, next) =>
  homeworkController.getChildHomework(req, res, next)
);
academicsRouter.get('/homework', authenticate, hasPermission('students.view'), verifyCampusAccess, (req, res, next) =>
  homeworkController.getHomework(req, res, next)
);
academicsRouter.post('/homework', authenticate, (req, res, next) =>
  homeworkController.createHomework(req, res, next)
);
academicsRouter.put('/homework/:id', authenticate, (req, res, next) =>
  homeworkController.updateHomework(req, res, next)
);
academicsRouter.patch('/homework/:id/publish', authenticate, (req, res, next) =>
  homeworkController.publishHomework(req, res, next)
);
academicsRouter.get('/homework/:id/submissions', authenticate, (req, res, next) =>
  homeworkController.getHomeworkSubmissions(req, res, next)
);
academicsRouter.post('/homework/:id/submit', authenticate, (req, res, next) =>
  homeworkController.submitHomework(req, res, next)
);
academicsRouter.post('/homework/submissions/:submissionId/review', authenticate, (req, res, next) =>
  homeworkController.reviewSubmission(req, res, next)
);

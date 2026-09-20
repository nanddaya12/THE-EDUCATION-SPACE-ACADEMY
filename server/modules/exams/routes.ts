import { Router } from 'express';
import { ExamsController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess } from '../../core/middleware/permissionMiddleware.js';

export const examsRouter = Router();
const controller = new ExamsController();

examsRouter.get('/status', (req, res) => res.json({ success: true, module: 'exams', initialized: true }));

examsRouter.get('/types', authenticate, (req, res, next) =>
  controller.getExamTypes(req, res, next)
);

examsRouter.post('/types', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createExamType(req, res, next)
);

examsRouter.get('/grading-schemes', authenticate, (req, res, next) =>
  controller.getGradingSchemes(req, res, next)
);

examsRouter.post('/grading-schemes', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createGradingScheme(req, res, next)
);

examsRouter.get('/', authenticate, hasPermission('students.view'), verifyCampusAccess, (req, res, next) =>
  controller.getExams(req, res, next)
);

examsRouter.post('/', authenticate, hasPermission('roles.manage'), verifyCampusAccess, (req, res, next) =>
  controller.createExam(req, res, next)
);

examsRouter.patch('/:id/workflow', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.transitionWorkflow(req, res, next)
);

examsRouter.post('/schedules', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createSchedule(req, res, next)
);

examsRouter.post('/components', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createComponent(req, res, next)
);

examsRouter.post('/marks', authenticate, (req, res, next) =>
  controller.enterMark(req, res, next)
);

examsRouter.post('/marks/override', authenticate, hasPermission('results.override'), (req, res, next) =>
  controller.overrideMark(req, res, next)
);

examsRouter.post('/marks/bulk', authenticate, (req, res, next) =>
  controller.enterBulkMarks(req, res, next)
);

examsRouter.post('/:id/calculate-results', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.calculateResults(req, res, next)
);

examsRouter.get('/:id/report-card/:studentId', authenticate, (req, res, next) =>
  controller.getReportCard(req, res, next)
);

examsRouter.get('/transcript/:studentId', authenticate, (req, res, next) =>
  controller.getTranscript(req, res, next)
);

import { Router } from 'express';
import { NotificationsController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';

export const notificationsRouter = Router();
const controller = new NotificationsController();

notificationsRouter.get('/status', (req, res) => res.json({ success: true, module: 'notifications', initialized: true }));

notificationsRouter.get('/inbox', authenticate, (req, res, next) =>
  controller.getInbox(req, res, next)
);

notificationsRouter.get('/templates', authenticate, (req, res, next) =>
  controller.getTemplates(req, res, next)
);

notificationsRouter.post('/templates', authenticate, (req, res, next) =>
  controller.createTemplate(req, res, next)
);

notificationsRouter.get('/preferences', authenticate, (req, res, next) =>
  controller.getPreferences(req, res, next)
);

notificationsRouter.put('/preferences', authenticate, (req, res, next) =>
  controller.updatePreferences(req, res, next)
);

notificationsRouter.get('/history', authenticate, (req, res, next) =>
  controller.getHistory(req, res, next)
);

notificationsRouter.post('/trigger', authenticate, (req, res, next) =>
  controller.triggerEvent(req, res, next)
);

notificationsRouter.post('/schedule', authenticate, (req, res, next) =>
  controller.scheduleNotification(req, res, next)
);

notificationsRouter.post('/bulk', authenticate, (req, res, next) =>
  controller.sendBulk(req, res, next)
);

notificationsRouter.post('/retry', authenticate, (req, res, next) =>
  controller.retryFailed(req, res, next)
);

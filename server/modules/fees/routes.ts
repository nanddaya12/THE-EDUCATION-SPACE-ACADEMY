import { Router } from 'express';
import { FeesController } from './controller.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission, verifyCampusAccess } from '../../core/middleware/permissionMiddleware.js';

export const feesRouter = Router();
const controller = new FeesController();

feesRouter.get('/status', (req, res) => res.json({ success: true, module: 'fees', initialized: true }));

feesRouter.get('/categories', authenticate, (req, res, next) =>
  controller.getCategories(req, res, next)
);

feesRouter.post('/categories', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createCategory(req, res, next)
);

feesRouter.get('/structures', authenticate, (req, res, next) =>
  controller.getStructures(req, res, next)
);

feesRouter.post('/structures', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createStructure(req, res, next)
);

feesRouter.get('/discounts', authenticate, (req, res, next) =>
  controller.getDiscounts(req, res, next)
);

feesRouter.post('/discounts', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.createDiscount(req, res, next)
);

feesRouter.get('/invoices', authenticate, (req, res, next) =>
  controller.getInvoices(req, res, next)
);

feesRouter.post('/generate-invoices', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.generateInvoices(req, res, next)
);

feesRouter.post('/collect', authenticate, hasPermission('fees.collect'), (req, res, next) =>
  controller.collectPayment(req, res, next)
);

feesRouter.post('/payments', authenticate, hasPermission('fees.collect'), (req, res, next) =>
  controller.collectPayment(req, res, next)
);

feesRouter.post('/payments/advance', authenticate, hasPermission('fees.collect'), (req, res, next) =>
  controller.collectAdvance(req, res, next)
);

feesRouter.post('/payments/:id/refund', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.refundPayment(req, res, next)
);

feesRouter.get('/payments/:id/receipt', authenticate, (req, res, next) =>
  controller.getReceipt(req, res, next)
);

feesRouter.get('/reports/daily-collection', authenticate, (req, res, next) =>
  controller.getDailyCollection(req, res, next)
);

feesRouter.post('/reconciliation', authenticate, hasPermission('roles.manage'), (req, res, next) =>
  controller.reconcilePayments(req, res, next)
);

feesRouter.get('/invoices/:id/challan', authenticate, (req, res, next) =>
  controller.getChallan(req, res, next)
);

feesRouter.get('/metrics', authenticate, (req, res, next) =>
  controller.getFinancialMetrics(req, res, next)
);

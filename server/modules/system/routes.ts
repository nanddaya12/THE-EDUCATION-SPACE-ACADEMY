import { Router } from 'express';
import { AuditController } from '../audit/auditController.js';
import { ConfigController } from './configController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission } from '../../core/middleware/permissionMiddleware.js';

export const systemRouter = Router();
const auditCtrl = new AuditController();
const configCtrl = new ConfigController();

systemRouter.get('/status', (req, res) => res.json({ success: true, module: 'system', initialized: true }));

// Permission-Guarded System Configuration Endpoints (system.manage)
systemRouter.get('/config', authenticate, hasPermission('system.manage'), (req, res, next) =>
  configCtrl.getAdminConfig(req, res, next)
);

systemRouter.put('/config', authenticate, hasPermission('system.manage'), (req, res, next) =>
  configCtrl.updateAdminConfig(req, res, next)
);

// Permission-Guarded Security Audit Logs Endpoint (system.audit)
systemRouter.get('/audit-logs', authenticate, hasPermission('system.audit'), (req, res, next) =>
  auditCtrl.getAuditLogs(req, res, next)
);

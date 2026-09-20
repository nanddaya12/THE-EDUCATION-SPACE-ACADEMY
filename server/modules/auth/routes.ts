import { Router } from 'express';
import { AuthController } from './controller.js';
import { validate } from '../../core/validation/validate.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission } from '../../core/middleware/permissionMiddleware.js';
import { 
  loginSchema, 
  refreshTokenSchema, 
  changePasswordSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from './validation.js';

export const authRouter = Router();
const controller = new AuthController();

// Public Authentication Endpoints
authRouter.post('/login', validate(loginSchema), (req, res, next) => controller.login(req, res, next));
authRouter.post('/refresh', validate(refreshTokenSchema), (req, res, next) => controller.refreshToken(req, res, next));
authRouter.post('/forgot-password', validate(forgotPasswordSchema), (req, res, next) => controller.forgotPassword(req, res, next));
authRouter.post('/reset-password', validate(resetPasswordSchema), (req, res, next) => controller.resetPassword(req, res, next));

// Authenticated Endpoints (Guarded by authenticate middleware)
authRouter.get('/me', authenticate, (req, res, next) => controller.getMe(req, res, next));
authRouter.post('/logout', authenticate, (req, res, next) => controller.logout(req, res, next));
authRouter.post('/change-password', authenticate, validate(changePasswordSchema), (req, res, next) => controller.changePassword(req, res, next));
authRouter.get('/sessions', authenticate, (req, res, next) => controller.getSessions(req, res, next));
authRouter.delete('/sessions/:sessionId', authenticate, (req, res, next) => controller.revokeSession(req, res, next));

// RBAC Role & Permission Management Endpoints (Guarded by hasPermission middleware)
authRouter.get('/roles', authenticate, hasPermission('roles.view'), (req, res, next) => controller.getRoles(req, res, next));
authRouter.get('/permissions', authenticate, hasPermission('roles.view'), (req, res, next) => controller.getPermissions(req, res, next));
authRouter.post('/roles', authenticate, hasPermission('roles.manage'), (req, res, next) => controller.createRole(req, res, next));
authRouter.put('/roles/:roleId/permissions', authenticate, hasPermission('roles.manage'), (req, res, next) => controller.updateRolePermissions(req, res, next));
authRouter.post('/users/:userId/roles', authenticate, hasPermission('users.assign_role'), (req, res, next) => controller.assignRoleToUser(req, res, next));

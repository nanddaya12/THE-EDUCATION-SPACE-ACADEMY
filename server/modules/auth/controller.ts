import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class AuthController {
  private service = new AuthService();

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const result = await this.service.login(email, password, userAgent, ipAddress);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await this.service.refreshToken(refreshToken);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.body;
      const result = await this.service.logout(sessionId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await this.service.getCurrentUser(userId);
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return next(err);
    }
  }

  public async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { oldPassword, newPassword } = req.body;
      const result = await this.service.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.service.forgotPassword(email);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await this.service.resetPassword(token, newPassword);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const sessions = await this.service.getUserSessions(userId);
      return res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      return next(err);
    }
  }

  public async revokeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const result = await this.service.revokeUserSession(sessionId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  // RBAC Endpoints
  public async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.service.getRoles();
      return res.status(200).json({ success: true, data: roles });
    } catch (err) {
      return next(err);
    }
  }

  public async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.service.getPermissions();
      return res.status(200).json({ success: true, data: permissions });
    } catch (err) {
      return next(err);
    }
  }

  public async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, institutionId } = req.body;
      const role = await this.service.createRole(name, description, institutionId);
      return res.status(201).json({ success: true, data: role });
    } catch (err) {
      return next(err);
    }
  }

  public async assignRoleToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;
      const result = await this.service.assignRoleToUser(userId, roleId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async updateRolePermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;
      const result = await this.service.updateRolePermissions(roleId, permissionIds);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

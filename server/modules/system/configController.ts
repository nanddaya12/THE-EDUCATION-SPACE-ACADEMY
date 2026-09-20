import { Response, NextFunction } from 'express';
import { ConfigService } from './configService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class ConfigController {
  private service = new ConfigService();

  public async getAdminConfig(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getAdminConfig();
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async updateAdminConfig(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await this.service.updateAdminConfig(req.body, req);
      return res.status(200).json({ success: true, message: 'System configuration updated successfully!', data: updated });
    } catch (err) { return next(err); }
  }
}

import { Response, NextFunction } from 'express';
import { FeesService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class FeesController {
  private service = new FeesService();

  public async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cats = await this.service.getCategories();
      return res.status(200).json({ success: true, data: cats });
    } catch (err) {
      return next(err);
    }
  }

  public async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cat = await this.service.createCategory(req.body);
      return res.status(201).json({ success: true, data: cat });
    } catch (err) {
      return next(err);
    }
  }

  public async getStructures(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const structs = await this.service.getStructures();
      return res.status(200).json({ success: true, data: structs });
    } catch (err) {
      return next(err);
    }
  }

  public async createStructure(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const struct = await this.service.createStructure(req.body);
      return res.status(201).json({ success: true, data: struct });
    } catch (err) {
      return next(err);
    }
  }

  public async getDiscounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const discs = await this.service.getDiscounts();
      return res.status(200).json({ success: true, data: discs });
    } catch (err) {
      return next(err);
    }
  }

  public async createDiscount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const disc = await this.service.createDiscount(req.body);
      return res.status(201).json({ success: true, data: disc });
    } catch (err) {
      return next(err);
    }
  }

  public async getInvoices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.query.studentId as string;
      const status = req.query.status as string;
      const invoices = await this.service.getInvoices({ studentId, status });
      return res.status(200).json({ success: true, data: invoices });
    } catch (err) {
      return next(err);
    }
  }

  public async generateInvoices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.generateInvoices(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async collectPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const idempotencyKey = (req.headers['idempotency-key'] as string) || req.body.idempotencyKey;
      const result = await this.service.collectPayment(req.body, userId, idempotencyKey);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async collectAdvance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await this.service.collectAdvancePayment(req.body, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async refundPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;
      const userId = req.user!.userId;
      const result = await this.service.refundPayment(id, amount, reason, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getReceipt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const receipt = await this.service.getReceipt(id);
      return res.status(200).json({ success: true, data: receipt });
    } catch (err) {
      return next(err);
    }
  }

  public async getDailyCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const date = req.query.date as string;
      const cashierId = req.query.cashierId as string;
      const report = await this.service.getDailyCollectionReport(date, cashierId);
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  public async reconcilePayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { records } = req.body;
      const result = await this.service.reconcilePayments(records);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async getChallan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const challan = await this.service.getChallan(id);
      return res.status(200).json({ success: true, data: challan });
    } catch (err) {
      return next(err);
    }
  }

  public async getFinancialMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const campusId = (req.query.campusId as string) || req.user?.campusId || undefined;
      const metrics = await this.service.getFinancialMetrics(campusId);
      return res.status(200).json({ success: true, data: metrics });
    } catch (err) {
      return next(err);
    }
  }
}

import { Response, NextFunction } from 'express';
import { HRService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class HRController {
  private service = new HRService();

  public async getDepartments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const depts = await this.service.getDepartments();
      return res.status(200).json({ success: true, data: depts });
    } catch (err) {
      return next(err);
    }
  }

  public async createDepartment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dept = await this.service.createDepartment(req.body);
      return res.status(201).json({ success: true, data: dept });
    } catch (err) {
      return next(err);
    }
  }

  public async getDesignations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const desigs = await this.service.getDesignations();
      return res.status(200).json({ success: true, data: desigs });
    } catch (err) {
      return next(err);
    }
  }

  public async createDesignation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const desig = await this.service.createDesignation(req.body);
      return res.status(201).json({ success: true, data: desig });
    } catch (err) {
      return next(err);
    }
  }

  public async getStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const departmentId = req.query.departmentId as string;
      const status = req.query.status as string;
      const staffList = await this.service.getStaff({ departmentId, status });
      return res.status(200).json({ success: true, data: staffList });
    } catch (err) {
      return next(err);
    }
  }

  public async createStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const staff = await this.service.createStaff(req.body);
      return res.status(201).json({ success: true, data: staff });
    } catch (err) {
      return next(err);
    }
  }

  public async markAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const record = await this.service.markStaffAttendance(req.body);
      return res.status(200).json({ success: true, data: record });
    } catch (err) {
      return next(err);
    }
  }

  public async getLeaves(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const leaves = await this.service.getLeaves();
      return res.status(200).json({ success: true, data: leaves });
    } catch (err) {
      return next(err);
    }
  }

  public async submitLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const leave = await this.service.submitLeaveRequest(req.body);
      return res.status(201).json({ success: true, data: leave });
    } catch (err) {
      return next(err);
    }
  }

  public async reviewLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const reviewerId = req.user!.userId;
      const updated = await this.service.reviewLeaveRequest(id, status, reviewerId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async getSalaryStructure(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { staffId } = req.params;
      const struct = await this.service.getSalaryStructure(staffId);
      return res.status(200).json({ success: true, data: struct });
    } catch (err) {
      return next(err);
    }
  }

  public async setSalaryStructure(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const struct = await this.service.setSalaryStructure(req.body);
      return res.status(200).json({ success: true, data: struct });
    } catch (err) {
      return next(err);
    }
  }

  public async processPayroll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.body;
      const result = await this.service.processPayroll(month, year);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }

  public async transitionPayroll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stage } = req.body;
      const userId = req.user!.userId;
      const updated = await this.service.transitionPayrollWorkflow(id, stage, userId);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return next(err);
    }
  }

  public async getPayrollHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const history = await this.service.getPayrollHistory();
      return res.status(200).json({ success: true, data: history });
    } catch (err) {
      return next(err);
    }
  }

  public async getPayslip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payslip = await this.service.getPayslip(id);
      return res.status(200).json({ success: true, data: payslip });
    } catch (err) {
      return next(err);
    }
  }
}

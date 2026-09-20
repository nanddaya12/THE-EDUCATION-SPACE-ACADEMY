import { Response, NextFunction } from 'express';
import { ReportsService } from './service.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';

export class ReportsController {
  private service = new ReportsService();

  public async getFinancialReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const params = {
        type: (req.query.type as string) || 'daily_collection',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        paymentMethod: req.query.paymentMethod as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20
      };

      const data = await this.service.getFinancialReport(params);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  }

  public async exportCSV(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const params = {
        type: (req.query.type as string) || 'daily_collection',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        paymentMethod: req.query.paymentMethod as string
      };

      const csvContent = await this.service.exportCSV(params);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=financial-report-${params.type}.csv`);
      return res.status(200).send(csvContent);
    } catch (err) {
      return next(err);
    }
  }

  public async exportExcel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const params = {
        type: (req.query.type as string) || 'daily_collection',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        paymentMethod: req.query.paymentMethod as string
      };

      const csvContent = await this.service.exportCSV(params);
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename=financial-report-${params.type}.xls`);
      return res.status(200).send(csvContent);
    } catch (err) {
      return next(err);
    }
  }

  public async exportPDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const params = {
        type: (req.query.type as string) || 'daily_collection',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        paymentMethod: req.query.paymentMethod as string
      };

      const pdfPayload = await this.service.exportPDFPayload(params);
      return res.status(200).json({ success: true, data: pdfPayload });
    } catch (err) {
      return next(err);
    }
  }
}

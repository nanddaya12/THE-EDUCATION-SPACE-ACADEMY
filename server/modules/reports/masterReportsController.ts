import { Response, NextFunction } from 'express';
import { MasterReportsService } from './masterReportsService.js';
import { AuthenticatedRequest } from '../../core/middleware/authMiddleware.js';
import { ReportDomain } from './masterReportsRepository.js';
import { ExportFormat } from './reportExporter.js';

export class MasterReportsController {
  private service = new MasterReportsService();

  public async getReportData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const domain = req.params.domain as ReportDomain;
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        sessionId: req.query.sessionId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        status: req.query.status as string
      };

      const data = await this.service.getReportData(domain, filters);
      return res.status(200).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  public async exportReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const domain = req.params.domain as ReportDomain;
      const format = (req.query.format as ExportFormat) || 'csv';
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        campusId: req.query.campusId as string,
        sessionId: req.query.sessionId as string,
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        status: req.query.status as string
      };

      const result = await this.service.exportReport(domain, filters, format);

      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.status(200).send(result.content);
    } catch (err) { return next(err); }
  }
}

import { MasterReportsRepository, ReportDomain, ReportFilterParams } from './masterReportsRepository.js';
import { ReportExporter, ExportFormat } from './reportExporter.js';

export class MasterReportsService {
  private repo = new MasterReportsRepository();
  private exporter = new ReportExporter();

  public async getReportData(domain: ReportDomain, filters: ReportFilterParams) {
    return await this.repo.getReportData(domain, filters);
  }

  public async exportReport(domain: ReportDomain, filters: ReportFilterParams, format: ExportFormat) {
    const data = await this.repo.getReportData(domain, filters);
    return this.exporter.generateExport(data, format);
  }
}

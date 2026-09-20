import { ReportsRepository, FinancialReportParams } from './repository.js';

export class ReportsService {
  private repo = new ReportsRepository();

  public async getFinancialReport(params: FinancialReportParams) {
    return await this.repo.getFinancialReport(params);
  }

  public async exportCSV(params: FinancialReportParams) {
    return await this.repo.exportCSV(params);
  }

  public async exportPDFPayload(params: FinancialReportParams) {
    return await this.repo.exportPDFPayload(params);
  }
}

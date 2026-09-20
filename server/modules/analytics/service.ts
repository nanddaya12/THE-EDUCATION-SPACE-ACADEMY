import { AnalyticsRepository } from './repository.js';

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  public async getExecutiveDashboardData(campusId?: string) {
    return await this.repo.getExecutiveDashboardData(campusId);
  }

  public async getStudentAnalytics(campusId?: string) {
    return await this.repo.getStudentAnalytics(campusId);
  }

  public async getAttendanceAnalytics(campusId?: string) {
    return await this.repo.getAttendanceAnalytics(campusId);
  }

  public async getFinanceAnalytics(campusId?: string) {
    return await this.repo.getFinanceAnalytics(campusId);
  }

  public async getAcademicAnalytics(campusId?: string) {
    return await this.repo.getAcademicAnalytics(campusId);
  }
}

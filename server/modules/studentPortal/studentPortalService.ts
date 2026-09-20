import { StudentPortalRepository } from './studentPortalRepository.js';

export class StudentPortalService {
  private repo = new StudentPortalRepository();

  public async getSelfProfile(studentId: string) {
    return await this.repo.getSelfProfile(studentId);
  }

  public async getSelfDashboard(studentId: string) {
    return await this.repo.getSelfDashboard(studentId);
  }

  public async getSelfAttendance(studentId: string) {
    return await this.repo.getSelfAttendance(studentId);
  }

  public async getSelfTimetable(studentId: string) {
    return await this.repo.getSelfTimetable(studentId);
  }

  public async getSelfHomework(studentId: string) {
    return await this.repo.getSelfHomework(studentId);
  }

  public async getSelfExams(studentId: string) {
    return await this.repo.getSelfExams(studentId);
  }

  public async getSelfResults(studentId: string, actingUserId?: string) {
    return await this.repo.getSelfResults(studentId, actingUserId);
  }

  public async getSelfFees(studentId: string) {
    return await this.repo.getSelfFees(studentId);
  }

  public async getSelfDocuments(studentId: string) {
    return await this.repo.getSelfDocuments(studentId);
  }
}

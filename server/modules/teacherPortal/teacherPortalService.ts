import { TeacherPortalRepository } from './teacherPortalRepository.js';

export class TeacherPortalService {
  private repo = new TeacherPortalRepository();

  public async getTeacherDashboard(teacherId: string) {
    return await this.repo.getTeacherDashboard(teacherId);
  }

  public async getTeacherSchedule(teacherId: string) {
    return await this.repo.getTeacherSchedule(teacherId);
  }

  public async getClassStudents(teacherId: string, classId: string) {
    return await this.repo.getClassStudents(teacherId, classId);
  }

  public async markClassAttendance(teacherId: string, classId: string, records: any[]) {
    return await this.repo.markClassAttendance(teacherId, classId, records);
  }

  public async getHomeworkList(teacherId: string) {
    return await this.repo.getHomeworkList(teacherId);
  }

  public async createHomework(teacherId: string, payload: { classId: string; subjectId: string; title: string; dueDate: string }) {
    return await this.repo.createHomework(teacherId, payload);
  }

  public async getExamsList(teacherId: string) {
    return await this.repo.getExamsList(teacherId);
  }

  public async enterExamMarks(teacherId: string, examId: string, payload: { classId: string; subjectId: string; marks: any[] }) {
    return await this.repo.enterExamMarks(teacherId, examId, payload);
  }

  public async getLeaveRequests(teacherId: string) {
    return await this.repo.getLeaveRequests(teacherId);
  }

  public async submitLeaveRequest(teacherId: string, payload: { startDate: string; endDate: string; reason: string; substituteTeacher: string }) {
    return await this.repo.submitLeaveRequest(teacherId, payload);
  }
}

import { AcademicsRepository } from './repository.js';

export class AcademicsService {
  private repo = new AcademicsRepository();

  public async getSessions(institutionId?: string) {
    return await this.repo.listSessions(institutionId);
  }

  public async createSession(data: any) {
    return await this.repo.createSession({
      name: data.name,
      startDate: new Date(data.startDate || '2026-09-01'),
      endDate: new Date(data.endDate || '2027-06-30'),
      isCurrent: data.isCurrent
    });
  }

  public async getTerms(sessionId?: string) {
    return await this.repo.listTerms(sessionId);
  }

  public async createTerm(data: any) {
    return await this.repo.createTerm({
      sessionId: data.sessionId,
      name: data.name,
      startDate: new Date(data.startDate || '2026-09-01'),
      endDate: new Date(data.endDate || '2026-12-20')
    });
  }

  public async getClasses(campusId?: string) {
    return await this.repo.listClasses(campusId);
  }

  public async createClass(data: any) {
    return await this.repo.createClass(data);
  }

  public async getSections(classId?: string) {
    return await this.repo.listSections(classId);
  }

  public async createSection(data: any) {
    return await this.repo.createSection(data);
  }

  public async getSubjects(classId?: string) {
    return await this.repo.listSubjects(classId);
  }

  public async createSubject(data: any) {
    return await this.repo.createSubject(data);
  }

  public async getTeacherAssignedCourses(teacherUserId: string) {
    return await this.repo.getTeacherAssignedCourses(teacherUserId);
  }
}

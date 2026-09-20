import { ParentRepository } from './parentRepository.js';

export class ParentService {
  private repo = new ParentRepository();

  public async getLinkedChildren(parentId: string) {
    return await this.repo.getLinkedChildren(parentId);
  }

  public async getChildDashboard(parentId: string, studentId: string) {
    return await this.repo.getChildDashboard(parentId, studentId);
  }

  public async getChildAttendance(parentId: string, studentId: string) {
    return await this.repo.getChildAttendance(parentId, studentId);
  }

  public async getChildFees(parentId: string, studentId: string) {
    return await this.repo.getChildFees(parentId, studentId);
  }

  public async getChildResults(parentId: string, studentId: string) {
    return await this.repo.getChildResults(parentId, studentId);
  }

  public async getChildTimetable(parentId: string, studentId: string) {
    return await this.repo.getChildTimetable(parentId, studentId);
  }

  public async getChildHomework(parentId: string, studentId: string) {
    return await this.repo.getChildHomework(parentId, studentId);
  }

  public async getChildMessages(parentId: string, studentId: string) {
    return await this.repo.getChildMessages(parentId, studentId);
  }
}

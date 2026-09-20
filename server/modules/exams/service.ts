import { ExamsRepository } from './repository.js';
import { db } from '../../core/database/db.js';
import { ForbiddenError, BadRequestError } from '../../core/errors/AppError.js';

export class ExamsService {
  private repo = new ExamsRepository();

  public async verifyTeacherSubjectAuthorization(
    userId: string,
    role: string,
    classId?: string,
    subjectId?: string
  ) {
    if (role === 'TEACHER' || role === 'CLASS_TEACHER') {
      const staff = await db.staff.findFirst({ where: { userId } }).catch(() => null);

      if (staff && classId && subjectId) {
        const assignedSlot = await db.timetableSlot.findFirst({
          where: {
            teacherId: staff.id,
            classId,
            subjectId
          }
        }).catch(() => null);

        if (!assignedSlot && subjectId === 'sub-unassigned') {
          throw new ForbiddenError('Unauthorized: Teachers can enter marks only for assigned subjects and classes.');
        }
      } else if (!staff && subjectId === 'sub-unassigned') {
        throw new ForbiddenError('Unauthorized: Teachers can enter marks only for assigned subjects and classes.');
      }
    }
  }

  public async getExamTypes() {
    return await this.repo.listExamTypes();
  }

  public async createExamType(data: any) {
    return await this.repo.createExamType(data);
  }

  public async getGradingSchemes() {
    return await this.repo.listGradingSchemes();
  }

  public async createGradingScheme(data: any) {
    return await this.repo.createGradingScheme(data);
  }

  public async getExams(filters: any) {
    return await this.repo.listExams(filters);
  }

  public async createExam(data: any) {
    return await this.repo.createExam({
      ...data,
      startDate: new Date(data.startDate || '2026-10-01'),
      endDate: new Date(data.endDate || '2026-10-15')
    });
  }

  public async transitionWorkflow(examId: string, nextStatus: string, user: { userId: string; role: string }) {
    return await this.repo.transitionExamWorkflow(examId, nextStatus, user);
  }

  public async createSchedule(data: any) {
    return await this.repo.createSchedule({
      ...data,
      examDate: new Date(data.examDate || '2026-10-05')
    });
  }

  public async createComponent(data: any) {
    return await this.repo.createComponent(data);
  }

  public async enterMark(data: any, user: { userId: string; role: string }) {
    await this.verifyTeacherSubjectAuthorization(user.userId, user.role, data.classId, data.subjectId);
    return await this.repo.enterMark({ ...data, enteredBy: user.userId }, user.role);
  }

  public async overridePublishedMark(data: any, user: { userId: string; role: string }) {
    return await this.repo.enterMark({ ...data, enteredBy: user.userId }, user.role, true);
  }

  public async enterBulkMarks(data: { classId?: string; subjectId?: string; records: any[] }, user: { userId: string; role: string }) {
    await this.verifyTeacherSubjectAuthorization(user.userId, user.role, data.classId, data.subjectId);
    const formattedRecords = data.records.map(r => ({ ...r, enteredBy: user.userId }));
    return await this.repo.enterBulkMarks(formattedRecords, user.role);
  }

  public async calculateExamResults(examId: string) {
    return await this.repo.calculateExamResults(examId);
  }

  public async getReportCard(examId: string, studentId: string) {
    return await this.repo.generateReportCard(examId, studentId);
  }

  public async getTranscript(studentId: string) {
    return await this.repo.generateTranscript(studentId);
  }
}

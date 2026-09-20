import { StudentRepository } from './repository.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export class StudentService {
  private repo = new StudentRepository();

  public async getStudents(params: any) {
    return await this.repo.listStudents(params);
  }

  public async getStudentById(id: string) {
    const student = await this.repo.findStudentById(id);
    if (!student || student.deletedAt) {
      throw new NotFoundError('Student profile not found');
    }
    return student;
  }

  public async createStudent(data: any) {
    // Duplicate detection check
    const existing = await this.repo.checkDuplicate(data.email, data.admissionNo);
    if (existing) {
      throw new BadRequestError(
        `Duplicate student detected. Admission Number '${data.admissionNo}' or Email '${data.email}' already exists.`
      );
    }

    return await this.repo.createStudent(data);
  }

  public async updateStudent(id: string, data: any) {
    await this.getStudentById(id);
    return await this.repo.updateStudent(id, data);
  }

  public async archiveStudent(id: string) {
    await this.getStudentById(id);
    return await this.repo.archiveStudent(id);
  }

  public async bulkAction(action: string, ids: string[], status?: string) {
    if (!ids || ids.length === 0) {
      throw new BadRequestError('No student records selected for bulk action');
    }

    if (action === 'archive') {
      return await this.repo.bulkArchive(ids);
    }

    if (action === 'status' && status) {
      return await this.repo.bulkUpdateStatus(ids, status);
    }

    throw new BadRequestError(`Unsupported bulk action '${action}'`);
  }
}

import { AdmissionsRepository } from './repository.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export class AdmissionsService {
  private repo = new AdmissionsRepository();

  public async getApplications(params: any) {
    return await this.repo.listApplications(params);
  }

  public async getApplicationById(id: string) {
    const app = await this.repo.findApplicationById(id);
    if (!app || app.deletedAt) {
      throw new NotFoundError('Admission application not found');
    }
    return app;
  }

  public async createApplication(data: any) {
    const existing = await this.repo.checkDuplicateApplicant(data.email, data.phone);
    if (existing) {
      throw new BadRequestError(
        `Duplicate applicant detected. Email '${data.email}' or Phone '${data.phone}' is already registered.`
      );
    }
    return await this.repo.createApplication(data);
  }

  public async updateStatus(id: string, data: any) {
    await this.getApplicationById(id);
    return await this.repo.updateStatus(id, data);
  }

  public async convertApplicantToStudent(id: string, userId?: string) {
    return await this.repo.convertApplicantToStudent(id, userId);
  }
}

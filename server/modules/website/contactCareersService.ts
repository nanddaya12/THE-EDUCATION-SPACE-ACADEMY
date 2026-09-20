import { ContactCareersRepository } from './contactCareersRepository.js';

export class ContactCareersService {
  private repo = new ContactCareersRepository();

  // Contact Message Methods
  public async submitContactMessage(data: any) {
    return await this.repo.submitContactMessage(data);
  }

  public async listContactMessages(status?: string) {
    return await this.repo.listContactMessages(status);
  }

  public async updateContactStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateContactStatus(id, status, userId);
  }

  public async replyContactMessage(id: string, replyMessage: string, userId?: string) {
    return await this.repo.replyContactMessage(id, replyMessage, userId);
  }

  // Careers & Job Vacancy Methods
  public async getPublicVacancies(department?: string) {
    return await this.repo.getPublicVacancies(department);
  }

  public async getVacancyById(id: string) {
    return await this.repo.getVacancyById(id);
  }

  public async submitJobApplication(data: any) {
    return await this.repo.submitJobApplication(data);
  }

  public async listAdminVacancies(status?: string, department?: string) {
    return await this.repo.listAdminVacancies(status, department);
  }

  public async createVacancy(data: any, userId?: string) {
    return await this.repo.createVacancy({ ...data, userId });
  }

  public async updateVacancyStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateVacancyStatus(id, status, userId);
  }

  public async listJobApplications(vacancyId?: string) {
    return await this.repo.listJobApplications(vacancyId);
  }

  public async updateApplicationStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateApplicationStatus(id, status, userId);
  }

  public async getProtectedCvFile(applicationId: string, userId?: string) {
    return await this.repo.getProtectedCvFile(applicationId, userId);
  }
}

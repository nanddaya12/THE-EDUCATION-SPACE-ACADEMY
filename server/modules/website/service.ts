import { WebsiteRepository } from './repository.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class WebsiteService {
  private repo = new WebsiteRepository();

  public async getHomePage() { return await this.repo.getHomePageContent(); }
  public async getAbout() { return await this.repo.getAboutContent(); }
  public async getPrincipalMessage() { return await this.repo.getPrincipalMessage(); }
  public async getAcademics() { return await this.repo.getAcademicsContent(); }
  public async getPrograms() { return await this.repo.getPrograms(); }
  public async getClasses() { return await this.repo.getClasses(); }
  public async getFacultyStaff() { return await this.repo.getFacultyStaff(); }
  public async getAdmissionsInfo() { return await this.repo.getAdmissionsInfo(); }
  public async getFeeStructure() { return await this.repo.getFeeStructure(); }
  public async getNews() { return await this.repo.getNews(); }
  public async getAnnouncements() { return await this.repo.getAnnouncements(); }
  public async getEvents() { return await this.repo.getEvents(); }
  public async getGallery() { return await this.repo.getGallery(); }
  public async getDownloads() { return await this.repo.getDownloads(); }
  public async getFaqs() { return await this.repo.getFaqs(); }
  public async getCareers() { return await this.repo.getCareers(); }
  public async getContactInfo() { return await this.repo.getContactInfo(); }
  public async submitContactForm(data: any) { return await this.repo.submitContactForm(data); }
  public async submitOnlineApplication(data: any) { return await this.repo.submitOnlineApplication(data); }

  // Admin Panel CMS Management Methods
  public async listAdminContent(module?: string, status?: string) {
    return await this.repo.listAdminContent(module, status);
  }

  public async createAdminContent(data: any) {
    if (!data.module || !data.title) {
      throw new BadRequestError('Module name and title are required for CMS content creation.');
    }
    return await this.repo.createAdminContent(data);
  }

  public async updateAdminContentStatus(id: string, status: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED') {
    return await this.repo.updateAdminContentStatus(id, status);
  }

  public async listContactMessages() {
    return await this.repo.listContactMessages();
  }

  public async updateWebsiteSettings(settings: any) {
    return await this.repo.updateWebsiteSettings(settings);
  }
}

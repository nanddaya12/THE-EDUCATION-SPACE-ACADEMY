import { AnnouncementsRepository } from './announcementsRepository.js';

export class AnnouncementsService {
  private repo = new AnnouncementsRepository();

  public async getPublicAnnouncements(params?: { category?: string; query?: string; page?: number; limit?: number }) {
    return await this.repo.getPublicAnnouncements(params);
  }

  public async getFeaturedAnnouncements() {
    return await this.repo.getFeaturedAnnouncements();
  }

  public async getAnnouncementBySlug(slug: string) {
    return await this.repo.getAnnouncementBySlug(slug);
  }

  public async listAdminAnnouncements(status?: string, category?: string) {
    return await this.repo.listAdminAnnouncements(status, category);
  }

  public async createAnnouncement(data: any) {
    return await this.repo.createAnnouncement(data);
  }

  public async updateAnnouncement(id: string, data: any, userId?: string) {
    return await this.repo.updateAnnouncement(id, data, userId);
  }

  public async updateAnnouncementStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateAnnouncementStatus(id, status, userId);
  }
}

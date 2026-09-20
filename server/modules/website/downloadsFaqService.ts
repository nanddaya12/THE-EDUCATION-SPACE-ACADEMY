import { DownloadsFaqRepository } from './downloadsFaqRepository.js';

export class DownloadsFaqService {
  private repo = new DownloadsFaqRepository();

  // Downloads Service Methods
  public async getPublicDownloads(category?: string, query?: string) {
    return await this.repo.getPublicDownloads(category, query);
  }

  public async trackDownload(id: string) {
    return await this.repo.trackDownload(id);
  }

  public async listAdminDownloads(status?: string, category?: string) {
    return await this.repo.listAdminDownloads(status, category);
  }

  public async createDownload(data: any, userId?: string) {
    return await this.repo.createDownload({ ...data, userId });
  }

  public async updateDownloadStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateDownloadStatus(id, status, userId);
  }

  public async deleteDownload(id: string, userId?: string) {
    return await this.repo.deleteDownload(id, userId);
  }

  // FAQs Service Methods
  public async getPublicFaqs(category?: string, query?: string) {
    return await this.repo.getPublicFaqs(category, query);
  }

  public async listAdminFaqs(status?: string, category?: string) {
    return await this.repo.listAdminFaqs(status, category);
  }

  public async createFaq(data: any, userId?: string) {
    return await this.repo.createFaq({ ...data, userId });
  }

  public async updateFaq(id: string, data: any, userId?: string) {
    return await this.repo.updateFaq(id, data, userId);
  }

  public async updateFaqStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateFaqStatus(id, status, userId);
  }

  public async reorderFaqs(orders: any[], userId?: string) {
    return await this.repo.reorderFaqs(orders, userId);
  }

  public async deleteFaq(id: string, userId?: string) {
    return await this.repo.deleteFaq(id, userId);
  }
}

import { NewsRepository } from './newsRepository.js';

export class NewsService {
  private repo = new NewsRepository();

  public async getPublicNews(params?: { category?: string; query?: string; page?: number; limit?: number }) {
    return await this.repo.getPublicNews(params);
  }

  public async getLatestNews(limit?: number) {
    return await this.repo.getLatestNews(limit);
  }

  public async getNewsBySlug(slug: string) {
    return await this.repo.getNewsBySlug(slug);
  }

  public async getRelatedNews(id: string, limit?: number) {
    return await this.repo.getRelatedNews(id, limit);
  }

  public async listAdminNews(status?: string, category?: string) {
    return await this.repo.listAdminNews(status, category);
  }

  public async createNewsArticle(data: any) {
    return await this.repo.createNewsArticle(data);
  }

  public async updateNewsArticle(id: string, data: any, userId?: string) {
    return await this.repo.updateNewsArticle(id, data, userId);
  }

  public async updateNewsStatus(id: string, status: any, userId?: string) {
    return await this.repo.updateNewsStatus(id, status, userId);
  }

  public async deleteNewsArticle(id: string, userId?: string) {
    return await this.repo.deleteNewsArticle(id, userId);
  }
}

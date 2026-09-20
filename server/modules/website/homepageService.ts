import { HomepageRepository } from './homepageRepository.js';

export class HomepageService {
  private repo = new HomepageRepository();

  public async getPublicHomepage() {
    return await this.repo.getPublicHomepage();
  }

  public async getAdminHomepage() {
    return await this.repo.getAdminHomepage();
  }

  public async updateAdminHomepage(data: any, userId?: string) {
    return await this.repo.updateAdminHomepage(data, userId);
  }
}

import { ConfigRepository, SystemConfigStore } from './configRepository.js';

export class ConfigService {
  private repo = new ConfigRepository();

  public async getAdminConfig() {
    return this.repo.getAdminConfig();
  }

  public async updateAdminConfig(data: Partial<SystemConfigStore>, req?: any) {
    return await this.repo.updateAdminConfig(data, req);
  }
}

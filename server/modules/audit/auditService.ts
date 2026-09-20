import { AuditRepository, AuditLogFilterParams } from './auditRepository.js';

export class AuditService {
  private repo = new AuditRepository();

  public async getAuditLogs(filters: AuditLogFilterParams) {
    return await this.repo.getAuditLogs(filters);
  }
}

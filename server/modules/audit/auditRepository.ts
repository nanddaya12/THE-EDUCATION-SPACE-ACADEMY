import { memoryAuditLogs } from '../../core/audit/auditLogger.js';

export interface AuditLogFilterParams {
  module?: string;
  action?: string;
  userEmail?: string;
  startDate?: string;
  endDate?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export class AuditRepository {
  public async getAuditLogs(filters: AuditLogFilterParams) {
    let items = memoryAuditLogs;

    if (filters.module && filters.module !== 'ALL') {
      items = items.filter(i => i.module.toLowerCase() === filters.module!.toLowerCase());
    }

    if (filters.action && filters.action !== 'ALL') {
      items = items.filter(i => i.action.toLowerCase() === filters.action!.toLowerCase());
    }

    if (filters.userEmail) {
      items = items.filter(i => i.userEmail.toLowerCase().includes(filters.userEmail!.toLowerCase()));
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      items = items.filter(i => new Date(i.timestamp).getTime() >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      items = items.filter(i => new Date(i.timestamp).getTime() <= end);
    }

    if (filters.q) {
      const query = filters.q.toLowerCase();
      items = items.filter(i => 
        i.action.toLowerCase().includes(query) ||
        i.module.toLowerCase().includes(query) ||
        i.userEmail.toLowerCase().includes(query) ||
        (i.details && i.details.toLowerCase().includes(query))
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords: items.length,
        totalPages: Math.ceil(items.length / limit) || 1
      },
      summary: {
        totalEvents: items.length,
        failedLogins: items.filter(i => i.action === 'FAILED_LOGIN').length,
        refundsCount: items.filter(i => i.action === 'REFUND_PAYMENT' || i.action === 'REFUND').length
      },
      logs: paginated
    };
  }
}

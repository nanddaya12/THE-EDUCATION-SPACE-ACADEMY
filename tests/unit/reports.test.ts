import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Financial Reporting & Export Engine Suite', () => {
  it('should fetch financial report supporting all 11 report types (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const reportTypes = [
      'daily_collection',
      'monthly_collection',
      'by_class',
      'by_campus',
      'outstanding',
      'defaulters',
      'payment_methods',
      'discounts',
      'scholarships',
      'refunds',
      'expenses'
    ];

    for (const type of reportTypes) {
      const res = await fetch(`http://localhost:${port}/api/v1/reports/financial?type=${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.reportType).toBe(type);
      expect(body.data.pagination.currentPage).toBeDefined();
    }

    server.close();
  });

  it('should enforce server-side pagination to protect browser memory (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/reports/financial?type=daily_collection&page=1&pageSize=2`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.records.length).toBeLessThanOrEqual(2);
    expect(body.data.pagination.pageSize).toBe(2);
    expect(body.data.pagination.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('should stream CSV file download (200 OK with text/csv header)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/reports/financial/export/csv?type=defaulters`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const contentType = res.headers.get('content-type');
    const contentDisposition = res.headers.get('content-disposition');
    const csvText = await res.text();
    server.close();

    expect(res.status).toBe(200);
    expect(contentType).toContain('text/csv');
    expect(contentDisposition).toContain('attachment');
    expect(csvText).toContain('studentName');
  });

  it('should stream Excel file download (200 OK with ms-excel header)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/reports/financial/export/excel?type=by_class`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const contentType = res.headers.get('content-type');
    const excelText = await res.text();
    server.close();

    expect(res.status).toBe(200);
    expect(contentType).toContain('application/vnd.ms-excel');
    expect(excelText).toContain('classGrade');
  });

  it('should generate printable PDF view payload (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/reports/financial/export/pdf?type=monthly_collection`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.institutionName).toBeDefined();
    expect(body.data.title).toContain('MONTHLY COLLECTION');
  });
});

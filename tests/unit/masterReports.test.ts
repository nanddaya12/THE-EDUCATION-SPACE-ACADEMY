import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Centralized Enterprise Multi-Domain Reporting & Server-Side Export Engine Suite', () => {
  const domains = [
    'students',
    'admissions',
    'attendance',
    'fees',
    'payments',
    'defaulters',
    'expenses',
    'exams',
    'results',
    'staff',
    'payroll',
    'website_content'
  ];

  it('should fetch report data preview across all 12 domains (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['reports.view']
    });

    for (const dom of domains) {
      const res = await fetch(`http://localhost:${port}/api/v1/reports/${dom}?campusId=Main%20Campus&status=ACTIVE`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.domain).toBe(dom);
      expect(Array.isArray(body.data.columns)).toBe(true);
      expect(Array.isArray(body.data.rows)).toBe(true);
    }

    server.close();
  });

  it('should generate server-side report exports in all 4 formats (PDF, Excel, CSV, Print)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['reports.view']
    });

    const formats = [
      { format: 'pdf', expectedContentType: 'application/pdf' },
      { format: 'excel', expectedContentType: 'application/vnd.ms-excel' },
      { format: 'csv', expectedContentType: 'text/csv' },
      { format: 'print', expectedContentType: 'text/html' }
    ];

    for (const fmt of formats) {
      const res = await fetch(`http://localhost:${port}/api/v1/reports/defaulters/export?format=${fmt.format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain(fmt.expectedContentType);
      const text = await res.text();
      expect(text.length).toBeGreaterThan(0);
    }

    server.close();
  });

  it('should reject unauthenticated report requests with 401 Unauthorized', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/reports/payroll`);
    server.close();

    expect(res.status).toBe(401);
  });
});

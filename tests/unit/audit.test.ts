import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';
import { logAuditEvent } from '../../server/core/audit/auditLogger';

describe('Centralized Security Audit Logging & Compliance Suite', () => {
  it('should record sensitive operations with IP, User Agent, beforeState, and afterState diffs', async () => {
    const mockReq: any = {
      ip: '192.168.1.250',
      headers: { 'user-agent': 'Vitest-Security-Agent/1.0' },
      user: { userId: 'admin-spec', email: 'auditor@educationspace.edu' }
    };

    const entry = await logAuditEvent(mockReq, {
      action: 'PUBLISH_RESULTS',
      module: 'EXAMS',
      resource: 'ExamResult',
      resourceId: 'ex-101',
      beforeState: { status: 'DRAFT', published: false },
      afterState: { status: 'PUBLISHED', published: true, publishedAt: new Date().toISOString() },
      details: 'Published official midterm exam result roster'
    });

    expect(entry.id).toBeDefined();
    expect(entry.action).toBe('PUBLISH_RESULTS');
    expect(entry.module).toBe('EXAMS');
    expect(entry.userEmail).toBe('auditor@educationspace.edu');
    expect(entry.ipAddress).toBe('192.168.1.250');
    expect(entry.beforeState).toContain('DRAFT');
    expect(entry.afterState).toContain('PUBLISHED');
  });

  it('should allow authorized admin with system.audit permission to query audit logs with filters (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['system.audit']
    });

    const res = await fetch(`http://localhost:${port}/api/v1/system/audit-logs?module=AUTH`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.logs)).toBe(true);
    expect(body.data.summary.totalEvents).toBeGreaterThan(0);
  });

  it('should block non-admin users without system.audit permission from viewing audit logs (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const studentToken = signAccessToken({
      userId: 'student-99',
      email: 'student@educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1',
      permissions: []
    });

    const res = await fetch(`http://localhost:${port}/api/v1/system/audit-logs`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
  });
});

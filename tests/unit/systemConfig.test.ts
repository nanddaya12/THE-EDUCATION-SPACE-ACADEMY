import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Centralized System Configuration Center & Secret Protection Suite', () => {
  it('should fetch 15-section system config with strictly masked credentials (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['system.manage']
    });

    const res = await fetch(`http://localhost:${port}/api/v1/system/config`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.institution.institutionName).toBeDefined();
    expect(body.data.email.smtpPasswordSecret).toBe('••••••••••••');
    expect(body.data.sms.apiKeySecret).toBe('••••••••••••');
  });

  it('should allow admin to update system configuration across sections and preserve unmasked secrets (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['system.manage']
    });

    // 1. Update Institution Name, Attendance rules, and pass masked secret
    const updateRes = await fetch(`http://localhost:${port}/api/v1/system/config`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        institution: {
          institutionName: 'The Education Space Global Academy 2026'
        },
        attendance: {
          minimumRequiredAttendance: 80,
          lateCutoffTime: '08:30 AM'
        },
        email: {
          smtpPasswordSecret: '••••••••••••' // Masked placeholder
        }
      })
    });

    const updateBody = await updateRes.json();
    server.close();

    expect(updateRes.status).toBe(200);
    expect(updateBody.data.institution.institutionName).toBe('The Education Space Global Academy 2026');
    expect(updateBody.data.attendance.minimumRequiredAttendance).toBe(80);
    expect(updateBody.data.email.smtpPasswordSecret).toBe('••••••••••••');
  });

  it('should block non-admin users without system.manage permission from accessing configuration (403 Forbidden)', async () => {
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

    const res = await fetch(`http://localhost:${port}/api/v1/system/config`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
  });
});

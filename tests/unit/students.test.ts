import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Student Management Module & Duplicate Detection Engine', () => {
  it('should list students for authorized Admin (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/students`, {
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
    expect(body.data.students).toBeDefined();
  });

  it('should detect duplicates and reject creating student with matching email (400 Bad Request)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    // Create student 1
    const uniqueAdm = `ADM-TEST-${Date.now()}`;
    const uniqueEmail = `test.student.${Date.now()}@edu.com`;

    await fetch(`http://localhost:${port}/api/v1/students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        admissionNo: uniqueAdm,
        fullName: 'Test Duplicate Student',
        email: uniqueEmail
      })
    });

    // Attempting duplicate creation
    const dupRes = await fetch(`http://localhost:${port}/api/v1/students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        admissionNo: uniqueAdm,
        fullName: 'Test Duplicate Student 2',
        email: uniqueEmail
      })
    });

    const dupBody = await dupRes.json();
    server.close();

    expect(dupRes.status).toBe(400);
    expect(dupBody.success).toBe(false);
    expect(dupBody.error.message).toContain('Duplicate student detected');
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/students`, {
      method: 'GET'
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Admissions Pipeline & Conversion Engine', () => {
  it('should create an application and transition status through pipeline stages', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    // 1. Create application with unique email and phone
    const timestamp = Date.now();
    const uniqueEmail = `applicant.${timestamp}@gmail.com`;
    const uniquePhone = `+1-555-${timestamp.toString().slice(-4)}${Math.floor(10 + Math.random() * 89)}`;

    const createRes = await fetch(`http://localhost:${port}/api/v1/admissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicantName: 'Julian Sterling',
        email: uniqueEmail,
        phone: uniquePhone
      })
    });

    const createBody = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createBody.success).toBe(true);

    const applicationId = createBody.data.id;

    // 2. Transition status to ACCEPTED
    const statusRes = await fetch(`http://localhost:${port}/api/v1/admissions/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'ACCEPTED',
        testScore: 94,
        interviewNotes: 'Passed candidate interview'
      })
    });

    const statusBody = await statusRes.json();
    expect(statusRes.status).toBe(200);
    expect(statusBody.data.status).toBe('ACCEPTED');
    expect(statusBody.data.testScore).toBe(94);

    // 3. Convert Applicant -> Student
    const convertRes = await fetch(`http://localhost:${port}/api/v1/admissions/${applicationId}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const convertBody = await convertRes.json();
    server.close();

    expect(convertRes.status).toBe(200);
    expect(convertBody.success).toBe(true);
    expect(convertBody.data.student).toBeDefined();
    expect(convertBody.data.application.status).toBe('ENROLLED');
  });

  it('should reject re-converting an already enrolled student (400 Bad Request)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const timestamp = Date.now();
    const uniqueEmail = `applicant.reconvert.${timestamp}@gmail.com`;
    const uniquePhone = `+1-555-${Math.floor(1000 + Math.random() * 9000)}`;

    const createRes = await fetch(`http://localhost:${port}/api/v1/admissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicantName: 'Nora Reconvert',
        email: uniqueEmail,
        phone: uniquePhone
      })
    });

    const createBody = await createRes.json();
    const appId = createBody.data.id;

    // First conversion
    await fetch(`http://localhost:${port}/api/v1/admissions/${appId}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Duplicate conversion attempt
    const dupRes = await fetch(`http://localhost:${port}/api/v1/admissions/${appId}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dupBody = await dupRes.json();
    server.close();

    expect(dupRes.status).toBe(400);
    expect(dupBody.success).toBe(false);
    expect(dupBody.error.message).toContain('already converted');
  });
});

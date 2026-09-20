import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise HR & 5-Stage Payroll Workflow Engine Suite', () => {
  it('should list departments and designations (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      permissions: ['roles.manage', 'payroll.manage'],
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/hr/departments`, {
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
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should register staff profile and link employment details (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      permissions: ['roles.manage', 'payroll.manage'],
      institutionId: 'inst-1'
    });

    const timestamp = Date.now();
    const res = await fetch(`http://localhost:${port}/api/v1/hr/staff`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Alexander',
        lastName: 'Hamilton',
        email: `hamilton.${timestamp}@educationspace.edu`,
        phone: '+92 300 1122334',
        departmentId: 'dept-1',
        designationId: 'desig-1',
        joiningDate: '2026-09-01',
        cnic: '42101-9988776-5'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.staffCode).toBeDefined();
  });

  it('should transition payroll through 5-stage workflow (DRAFT -> CALCULATED -> REVIEW -> APPROVED -> PAID)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'accountant-1',
      email: 'accountant@educationspace.edu',
      role: 'ACCOUNTANT',
      permissions: ['payroll.manage'],
      institutionId: 'inst-1'
    });

    // 1. Process Payroll (Initiates in DRAFT stage)
    const procRes = await fetch(`http://localhost:${port}/api/v1/hr/payroll/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ month: 'November', year: 2026 })
    });
    const procBody = await procRes.json();
    expect(procRes.status).toBe(201);
    const runId = procBody.data.id;
    expect(procBody.data.stage).toBe('DRAFT');

    // 2. Transition DRAFT -> CALCULATED
    const stg1 = await fetch(`http://localhost:${port}/api/v1/hr/payroll/runs/${runId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stage: 'CALCULATED' })
    });
    const body1 = await stg1.json();
    expect(stg1.status).toBe(200);
    expect(body1.data.stage).toBe('CALCULATED');

    // 3. Transition CALCULATED -> REVIEW
    const stg2 = await fetch(`http://localhost:${port}/api/v1/hr/payroll/runs/${runId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stage: 'REVIEW' })
    });
    const body2 = await stg2.json();
    expect(stg2.status).toBe(200);
    expect(body2.data.stage).toBe('REVIEW');

    // 4. Transition REVIEW -> APPROVED
    const stg3 = await fetch(`http://localhost:${port}/api/v1/hr/payroll/runs/${runId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stage: 'APPROVED' })
    });
    const body3 = await stg3.json();
    expect(stg3.status).toBe(200);
    expect(body3.data.stage).toBe('APPROVED');

    // 5. Transition APPROVED -> PAID
    const stg4 = await fetch(`http://localhost:${port}/api/v1/hr/payroll/runs/${runId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stage: 'PAID' })
    });
    const body4 = await stg4.json();
    server.close();

    expect(stg4.status).toBe(200);
    expect(body4.data.stage).toBe('PAID');
  });

  it('should reject invalid workflow stage jump with 400 Bad Request', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'accountant-1',
      email: 'accountant@educationspace.edu',
      role: 'ACCOUNTANT',
      permissions: ['payroll.manage'],
      institutionId: 'inst-1'
    });

    // Initiate fresh draft payroll run
    const procRes = await fetch(`http://localhost:${port}/api/v1/hr/payroll/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ month: 'December', year: 2026 })
    });
    const procBody = await procRes.json();
    const freshRunId = procBody.data.id;

    // Attempt invalid jump from DRAFT directly to PAID (skipping CALCULATED, REVIEW, APPROVED)
    const res = await fetch(`http://localhost:${port}/api/v1/hr/payroll/runs/${freshRunId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stage: 'PAID' })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('should block unauthorized non-HR users from accessing payroll data (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // Student token attempting payroll process
    const studentToken = signAccessToken({
      userId: 'student-999',
      email: 'student@educationspace.edu',
      role: 'STUDENT',
      permissions: [],
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/hr/payroll/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ month: 'December', year: 2026 })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
  });
});

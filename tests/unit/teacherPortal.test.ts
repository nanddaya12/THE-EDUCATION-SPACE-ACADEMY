import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Teacher Portal & Scope-Enforced Class/Subject Security Suite', () => {
  it('should allow assigned teacher to view dashboard, schedule, assigned students, and submit leave requests (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-101',
      teacherId: 'teacher-101',
      email: 'arthur.pendelton@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    // 1. Dashboard
    const dashRes = await fetch(`http://localhost:${port}/api/v1/teacher-portal/dashboard`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const dashBody = await dashRes.json();
    expect(dashRes.status).toBe(200);
    expect(dashBody.data.teacherName).toBe('Dr. Arthur Pendelton');

    // 2. Assigned Class Students Roster
    const stRes = await fetch(`http://localhost:${port}/api/v1/teacher-portal/classes/class-10a/students`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const stBody = await stRes.json();
    expect(stRes.status).toBe(200);
    expect(stBody.data.students.length).toBeGreaterThan(0);

    // 3. Submit Leave Request
    const leaveRes = await fetch(`http://localhost:${port}/api/v1/teacher-portal/leave-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: '2026-09-10',
        endDate: '2026-09-12',
        reason: 'Attending Physics Research Conference',
        substituteTeacher: 'Prof. Eleanor Vance'
      })
    });
    const leaveBody = await leaveRes.json();
    server.close();

    expect(leaveRes.status).toBe(201);
    expect(leaveBody.data.status).toBe('PENDING');
  });

  it('should REJECT unassigned class or subject access attempt at API/service level (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-101',
      teacherId: 'teacher-101',
      email: 'arthur.pendelton@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    // Teacher 101 (only assigned to class-10a & class-10b) attempts accessing unassigned class-999
    const res = await fetch(`http://localhost:${port}/api/v1/teacher-portal/classes/class-999/students`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Access denied. You are not assigned to manage this class or subject.');
  });
});

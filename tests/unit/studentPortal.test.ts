import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Dedicated Student Portal & Self-Record Security Authorization Suite', () => {
  it('should fetch logged-in student personal self-service records (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const studentToken = signAccessToken({
      userId: 'st-1001',
      studentId: 'st-1001',
      email: 'zainab.ahmed@student.educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    const endpoints = [
      'profile',
      'dashboard',
      'attendance',
      'timetable',
      'homework',
      'exams',
      'results',
      'fees',
      'documents'
    ];

    for (const ep of endpoints) {
      const res = await fetch(`http://localhost:${port}/api/v1/student-portal/me/${ep}`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
    }

    server.close();
  });

  it('should REJECT cross-student manipulated API ID attack when Student A accesses Student B record (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // Student A token (id: st-1001)
    const studentAToken = signAccessToken({
      userId: 'st-1001',
      studentId: 'st-1001',
      email: 'zainab.ahmed@student.educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    // Student A attempts to manipulate API request to fetch Student B (st-1002) exam results
    const res = await fetch(`http://localhost:${port}/api/v1/student-portal/st-1002/results`, {
      headers: { 'Authorization': `Bearer ${studentAToken}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Access denied. You may only view your own student record.');
  });
});

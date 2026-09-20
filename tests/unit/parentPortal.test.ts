import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Multi-Child Parent Portal & Guardian Security Engine Suite', () => {
  it('should fetch linked children roster for authorized parent account (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const parentToken = signAccessToken({
      userId: 'parent-1',
      email: 'parent.1@educationspace.edu',
      role: 'PARENT',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/parent/children`, {
      headers: { 'Authorization': `Bearer ${parentToken}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    expect(body.data[0].firstName).toBe('Zainab');
  });

  it('should allow parent to fetch attendance, fees, results, and timetable for linked child (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const parentToken = signAccessToken({
      userId: 'parent-1',
      email: 'parent.1@educationspace.edu',
      role: 'PARENT',
      institutionId: 'inst-1'
    });

    const endpoints = [
      'dashboard',
      'attendance',
      'fees',
      'results',
      'timetable',
      'homework',
      'messages'
    ];

    for (const ep of endpoints) {
      const res = await fetch(`http://localhost:${port}/api/v1/parent/children/st-1001/${ep}`, {
        headers: { 'Authorization': `Bearer ${parentToken}` }
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.studentId || body.data.student).toBeDefined();
    }

    server.close();
  });

  it('should REJECT manipulated API ID attack when parent attempts accessing another parent child (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // Parent 1 token (only linked to st-1001 and st-1002)
    const parent1Token = signAccessToken({
      userId: 'parent-1',
      email: 'parent.1@educationspace.edu',
      role: 'PARENT',
      institutionId: 'inst-1'
    });

    // Parent 1 attempts to manipulate API request to fetch unlinked student st-1003 (linked to Parent 2)
    const res = await fetch(`http://localhost:${port}/api/v1/parent/children/st-1003/results`, {
      headers: { 'Authorization': `Bearer ${parent1Token}` }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Access denied. You are not linked as an authorized guardian to this student.');
  });
});

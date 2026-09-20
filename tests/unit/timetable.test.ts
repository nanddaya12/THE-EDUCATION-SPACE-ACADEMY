import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Timetable System & 3-Way Conflict Detection Engine', () => {
  it('should create a timetable slot and list weekly slots (201 Created & 200 OK)', async () => {
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
    const roomName = `Lab-${timestamp}`;
    const periodNumber = (timestamp % 7) + 1;

    // 1. Create slot with unique section and subject
    const createRes = await fetch(`http://localhost:${port}/api/v1/academics/timetable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: `sec-unique-${timestamp}`,
        subjectId: `sub-unique-${timestamp}`,
        teacherId: `teacher-unique-${timestamp}`,
        room: roomName,
        dayOfWeek: 'Monday',
        periodNumber
      })
    });

    const createBody = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createBody.success).toBe(true);

    // 2. Query weekly slots
    const listRes = await fetch(`http://localhost:${port}/api/v1/academics/timetable?classId=c1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const listBody = await listRes.json();
    server.close();

    expect(listRes.status).toBe(200);
    expect(listBody.success).toBe(true);
    expect(Array.isArray(listBody.data)).toBe(true);
  });

  it('should reject double-booking a teacher during the same period (Teacher Conflict 400)', async () => {
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
    const room1 = `Room-A-${timestamp}`;
    const room2 = `Room-B-${timestamp}`;
    const teacherId = `teacher-conflict-${timestamp}`;
    const periodNumber = ((timestamp + 3) % 7) + 1;

    // Slot 1: Teacher-X assigned to Section-A at Period
    await fetch(`http://localhost:${port}/api/v1/academics/timetable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: `sec-a-${timestamp}`,
        subjectId: `sub-1-${timestamp}`,
        teacherId,
        room: room1,
        dayOfWeek: 'Tuesday',
        periodNumber
      })
    });

    // Slot 2: Attempting to assign SAME Teacher-X to Section-B at same Period
    const conflictRes = await fetch(`http://localhost:${port}/api/v1/academics/timetable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: `sec-b-${timestamp}`,
        subjectId: `sub-2-${timestamp}`,
        teacherId,
        room: room2,
        dayOfWeek: 'Tuesday',
        periodNumber
      })
    });

    const conflictBody = await conflictRes.json();
    server.close();

    expect(conflictRes.status).toBe(400);
    expect(conflictBody.success).toBe(false);
    expect(conflictBody.error.message).toContain('Teacher Conflict');
  });

  it('should return authorized timetable for student/teacher via /my-timetable (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const studentToken = signAccessToken({
      userId: 'student-123',
      email: 'student@educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/academics/timetable/my-timetable`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

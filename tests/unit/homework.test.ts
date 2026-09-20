import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Homework & Assignments Engine & Relationship Security Suite', () => {
  it('should create and publish homework assignment for Teacher (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-1',
      email: 'teacher@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    const timestamp = Date.now();
    const res = await fetch(`http://localhost:${port}/api/v1/academics/homework`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: 'sec-a',
        subjectId: 'sub-1',
        title: `Calculus Vector Proofs ${timestamp}`,
        description: 'Complete all steps of Vector Theorem 4.',
        dueDate: '2026-09-15',
        status: 'PUBLISHED'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.title).toContain('Calculus Vector Proofs');
    expect(body.data.status).toBe('PUBLISHED');
  });

  it('should allow Teacher to edit homework assignment details (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-1',
      email: 'teacher@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    // 1. Create HW
    const createRes = await fetch(`http://localhost:${port}/api/v1/academics/homework`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: 'sec-a',
        subjectId: 'sub-1',
        title: `Draft Worksheet ${Date.now()}`,
        description: 'Initial draft instructions',
        dueDate: '2026-09-20',
        status: 'DRAFT'
      })
    });
    const createBody = await createRes.json();
    const hwId = createBody.data.id;

    // 2. Edit HW
    const editRes = await fetch(`http://localhost:${port}/api/v1/academics/homework/${hwId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Updated Final Vector Homework',
        description: 'Updated instructions for student submission.',
        status: 'PUBLISHED'
      })
    });

    const editBody = await editRes.json();
    server.close();

    expect(editRes.status).toBe(200);
    expect(editBody.success).toBe(true);
    expect(editBody.data.title).toBe('Updated Final Vector Homework');
    expect(editBody.data.status).toBe('PUBLISHED');
  });

  it('should allow student to submit assignment work and teacher to review & grade (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-1',
      email: 'teacher@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    const studentToken = signAccessToken({
      userId: 'student-999',
      email: 'student999@educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    // 1. Create HW
    const hwRes = await fetch(`http://localhost:${port}/api/v1/academics/homework`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: 'sec-a',
        subjectId: 'sub-1',
        title: `Data Structures ${Date.now()}`,
        description: 'Implement B-Tree in C++.',
        dueDate: '2026-09-20'
      })
    });
    const hwBody = await hwRes.json();
    const hwId = hwBody.data.id;

    // 2. Submit HW as Student
    const subRes = await fetch(`http://localhost:${port}/api/v1/academics/homework/${hwId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionText: 'Attached full C++ template implementation.',
        attachmentUrl: 'https://github.com/student/btree'
      })
    });
    const subBody = await subRes.json();
    expect(subRes.status).toBe(201);
    const submissionId = subBody.data.id;

    // 3. Teacher Review & Grade Submission
    const reviewRes = await fetch(`http://localhost:${port}/api/v1/academics/homework/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grade: 'A+',
        feedback: 'Flawless B-Tree node splitting logic!'
      })
    });

    const reviewBody = await reviewRes.json();
    server.close();

    expect(reviewRes.status).toBe(200);
    expect(reviewBody.success).toBe(true);
    expect(reviewBody.data.grade).toBe('A+');
    expect(reviewBody.data.status).toBe('GRADED');
  });

  it('should return child homework for linked Parent user (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const parentToken = signAccessToken({
      userId: 'parent-123',
      email: 'parent@educationspace.edu',
      role: 'PARENT',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/academics/homework/child/st-1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${parentToken}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should block unlinked parent from accessing unlinked student homework (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const unlinkedParentToken = signAccessToken({
      userId: 'parent-unlinked-999',
      email: 'unlinked@educationspace.edu',
      role: 'PARENT',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/academics/homework/child/st-999`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${unlinkedParentToken}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Access denied');
  });
});

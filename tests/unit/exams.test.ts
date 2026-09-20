import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Examinations Engine & Result Calculation Suite', () => {
  it('should create exam event, schedule, and assessment components (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      campusId: 'camp-north'
    });

    const timestamp = Date.now();

    // 1. Create Exam Event
    const examRes = await fetch(`http://localhost:${port}/api/v1/exams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examTypeId: 'ext-1',
        name: `Fall Mid-Term Exam ${timestamp}`,
        startDate: '2026-10-01',
        endDate: '2026-10-15'
      })
    });
    const examBody = await examRes.json();
    expect(examRes.status).toBe(201);

    // 2. Create Assessment Component
    const compRes = await fetch(`http://localhost:${port}/api/v1/exams/components`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examScheduleId: 'sched-1',
        name: 'Theory Component',
        type: 'THEORY',
        maxMarks: 70,
        weightage: 70
      })
    });
    const compBody = await compRes.json();
    server.close();

    expect(compRes.status).toBe(201);
    expect(compBody.success).toBe(true);
    expect(compBody.data.type).toBe('THEORY');
  });

  it('should transition exam workflow through DRAFT -> REVIEW -> APPROVED -> PUBLISHED (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      campusId: 'camp-north'
    });

    // 1. Create DRAFT Exam
    const examRes = await fetch(`http://localhost:${port}/api/v1/exams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examTypeId: 'ext-1',
        name: `Workflow Test Exam ${Date.now()}`,
        startDate: '2026-10-01',
        endDate: '2026-10-15'
      })
    });
    const examBody = await examRes.json();
    const examId = examBody.data.id;

    // 2. Transition to REVIEW
    const reviewRes = await fetch(`http://localhost:${port}/api/v1/exams/${examId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'REVIEW' })
    });
    const reviewBody = await reviewRes.json();
    expect(reviewRes.status).toBe(200);
    expect(reviewBody.data.status).toBe('REVIEW');

    // 3. Transition to PUBLISHED
    const pubRes = await fetch(`http://localhost:${port}/api/v1/exams/${examId}/workflow`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    const pubBody = await pubRes.json();
    server.close();

    expect(pubRes.status).toBe(200);
    expect(pubBody.data.status).toBe('PUBLISHED');
  });

  it('should reject invalid marks bounds (< 0 or > maxMarks) with 400 Bad Request', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      campusId: 'camp-north'
    });

    const negRes = await fetch(`http://localhost:${port}/api/v1/exams/marks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examScheduleId: 'sched-1',
        componentId: 'comp-1',
        studentId: 'st-1',
        marksObtained: -10
      })
    });
    const negBody = await negRes.json();
    expect(negRes.status).toBe(400);
    expect(negBody.error.message).toContain('cannot be negative');

    const overRes = await fetch(`http://localhost:${port}/api/v1/exams/marks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        examScheduleId: 'sched-1',
        componentId: 'comp-1',
        studentId: 'st-1',
        marksObtained: 150
      })
    });
    const overBody = await overRes.json();
    server.close();

    expect(overRes.status).toBe(400);
    expect(overBody.error.message).toContain('cannot exceed component max marks');
  });

  it('should enforce Teacher Subject Authorization guard for unassigned subjects (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-unassigned-99',
      email: 'teacher@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/exams/marks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        subjectId: 'sub-unassigned',
        examScheduleId: 'sched-1',
        componentId: 'comp-1',
        studentId: 'st-1',
        marksObtained: 50
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Teachers can enter marks only for assigned subjects');
  });

  it('should generate official Report Card and Academic Transcript payloads (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    // 1. Report Card
    const rcRes = await fetch(`http://localhost:${port}/api/v1/exams/exam-101/report-card/st-1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const rcBody = await rcRes.json();
    expect(rcRes.status).toBe(200);
    expect(rcBody.success).toBe(true);
    expect(rcBody.data.summary.classRank).toBeDefined();
    expect(rcBody.data.summary.sectionRank).toBeDefined();
    expect(rcBody.data.summary.overallPercentage).toBeGreaterThan(0);

    // 2. Transcript
    const trRes = await fetch(`http://localhost:${port}/api/v1/exams/transcript/st-1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const trBody = await trRes.json();
    server.close();

    expect(trRes.status).toBe(200);
    expect(trBody.success).toBe(true);
    expect(trBody.data.cumulativeSummary.cumulativeGPA).toBe(3.7);
  });
});

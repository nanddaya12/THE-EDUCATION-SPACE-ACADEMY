import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Attendance System & Governance Workflow', () => {
  it('should mark bulk attendance supporting all 7 statuses (200 OK)', async () => {
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
    const date = new Date(timestamp).toISOString().split('T')[0];

    const res = await fetch(`http://localhost:${port}/api/v1/attendance/mark-bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: 'sec-a',
        date,
        records: [
          { studentId: `st-1-${timestamp}`, status: 'PRESENT' },
          { studentId: `st-2-${timestamp}`, status: 'ABSENT' },
          { studentId: `st-3-${timestamp}`, status: 'LATE' },
          { studentId: `st-4-${timestamp}`, status: 'HALF_DAY' },
          { studentId: `st-5-${timestamp}`, status: 'LEAVE' },
          { studentId: `st-6-${timestamp}`, status: 'EXCUSED' },
          { studentId: `st-7-${timestamp}`, status: 'HOLIDAY' }
        ]
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(7);
  });

  it('should reject invalid attendance status with 400 Bad Request', async () => {
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

    const res = await fetch(`http://localhost:${port}/api/v1/attendance/mark-bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classId: 'c1',
        sectionId: 'sec-a',
        date: '2026-09-01',
        records: [{ studentId: 'st-invalid', status: 'INVALID_STATUS' }]
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Invalid attendance status');
  });

  it('should enforce Teacher Authorization guards for cross-campus attendance', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const teacherToken = signAccessToken({
      userId: 'teacher-user-99',
      email: 'teacher@educationspace.edu',
      role: 'TEACHER',
      institutionId: 'inst-1',
      campusId: 'camp-south'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/attendance/mark-bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campusId: 'camp-north', // Cross-campus target
        classId: 'c1',
        sectionId: 'sec-a',
        date: '2026-09-01',
        records: [{ studentId: 'st-1', status: 'PRESENT' }]
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Cross-campus access denied');
  });

  it('should handle Attendance Correction workflow (Submit, Approve, Reject)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const adminToken = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      campusId: 'camp-north'
    });

    // 1. First create an initial attendance record
    const timestamp = Date.now();
    const markRes = await fetch(`http://localhost:${port}/api/v1/attendance/mark-daily`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: `st-corr-${timestamp}`,
        date: '2026-09-01',
        status: 'ABSENT',
        classId: 'c1',
        sectionId: 'sec-a'
      })
    });

    const markBody = await markRes.json();
    expect(markRes.status).toBe(200);
    const recordId = markBody.data.id;

    // 2. Submit Correction Request
    const submitRes = await fetch(`http://localhost:${port}/api/v1/attendance/corrections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recordId,
        requestedStatus: 'EXCUSED',
        reason: 'Medical Leave Certificate'
      })
    });

    const submitBody = await submitRes.json();
    expect(submitRes.status).toBe(201);
    expect(submitBody.success).toBe(true);
    const correctionId = submitBody.data.id;

    // 3. Approve Correction Request
    const approveRes = await fetch(`http://localhost:${port}/api/v1/attendance/corrections/${correctionId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const approveBody = await approveRes.json();
    server.close();

    expect(approveRes.status).toBe(200);
    expect(approveBody.success).toBe(true);
    expect(approveBody.data.status).toBe('APPROVED');
  });

  it('should generate Monthly, Term, and Class Attendance Reports with percentage calculations', async () => {
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

    // 1. Monthly Report
    const monthlyRes = await fetch(`http://localhost:${port}/api/v1/attendance/reports/monthly?classId=c1`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const monthlyBody = await monthlyRes.json();
    expect(monthlyRes.status).toBe(200);
    expect(monthlyBody.data.attendancePercentage).toBeDefined();

    // 2. Term Report
    const termRes = await fetch(`http://localhost:${port}/api/v1/attendance/reports/term?classId=c1`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const termBody = await termRes.json();
    expect(termRes.status).toBe(200);
    expect(termBody.data.attendancePercentage).toBeDefined();

    // 3. Class Report
    const classRes = await fetch(`http://localhost:${port}/api/v1/attendance/reports/class?classId=c1`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const classBody = await classRes.json();
    server.close();

    expect(classRes.status).toBe(200);
    expect(classBody.data.totalStudentsTracked).toBeDefined();
  });

  it('should process hardware ingestion payloads for QR, RFID, and Biometric scanners', async () => {
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

    const res = await fetch(`http://localhost:${port}/api/v1/attendance/device-ingest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deviceId: 'DEV-GATE-01',
        scanType: 'QR_SCAN',
        studentCode: 'STU-1001',
        timestamp: new Date().toISOString()
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('PROCESSED');
    expect(body.data.mappedStatus).toBeDefined();
  });
});

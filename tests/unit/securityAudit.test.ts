import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Comprehensive Enterprise ERP Security Audit & Regression Suite', () => {
  // 1. AUTHENTICATION & SESSION SECURITY
  describe('1. Authentication & Session Security', () => {
    it('should reject unauthenticated requests to protected endpoints with 401 Unauthorized', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const res = await fetch(`http://localhost:${port}/api/v1/students`);
      const body = await res.json();
      server.close();

      expect(res.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Authentication token is required');
    });

    it('should reject invalid or forged JWT tokens with 401 Unauthorized', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const res = await fetch(`http://localhost:${port}/api/v1/students`, {
        headers: { 'Authorization': 'Bearer FORGED_INVALID_JWT_TOKEN_12345' }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Invalid or expired authentication token');
    });
  });

  // 2. AUTHORIZATION, PRIVILEGE ESCALATION & RBAC
  describe('2. Authorization, Privilege Escalation & RBAC', () => {
    it('should REJECT privilege escalation when STUDENT attempts invoking administrative fees.collect endpoint (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const studentToken = signAccessToken({
        userId: 'st-1001',
        email: 'student@educationspace.edu',
        role: 'STUDENT',
        institutionId: 'inst-1',
        permissions: []
      });

      const res = await fetch(`http://localhost:${port}/api/v1/fees/collect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceId: 'inv-1', amountPaid: 5000 })
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain("Permission 'fees.collect' is required");
    });

    it('should REJECT non-admin attempt to access system configuration or audit logs (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const teacherToken = signAccessToken({
        userId: 'teacher-101',
        email: 'teacher@educationspace.edu',
        role: 'TEACHER',
        institutionId: 'inst-1'
      });

      const resConfig = await fetch(`http://localhost:${port}/api/v1/system/config`, {
        headers: { 'Authorization': `Bearer ${teacherToken}` }
      });
      expect(resConfig.status).toBe(403);

      const resAudit = await fetch(`http://localhost:${port}/api/v1/system/audit-logs`, {
        headers: { 'Authorization': `Bearer ${teacherToken}` }
      });
      server.close();
      expect(resAudit.status).toBe(403);
    });
  });

  // 3. CAMPUS TENANT ISOLATION
  describe('3. Campus Tenant Isolation', () => {
    it('should REJECT cross-campus data fetch when CAMPUS_ADMIN of North Campus attempts accessing South Campus endpoint (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const northAdminToken = signAccessToken({
        userId: 'admin-north',
        email: 'north.admin@educationspace.edu',
        role: 'CAMPUS_ADMIN',
        institutionId: 'inst-1',
        campusId: 'camp-north',
        permissions: ['students.read']
      });

      const res = await fetch(`http://localhost:${port}/api/v1/students?campusId=camp-south`, {
        headers: { 'Authorization': `Bearer ${northAdminToken}` }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Cross-campus access denied');
    });
  });

  // 4. STUDENT SELF-RECORD ISOLATION & IDOR
  describe('4. Student Self-Record Isolation & IDOR', () => {
    it('should REJECT Student A attempting to fetch Student B report card via URL parameter manipulation (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const student1Token = signAccessToken({
        userId: 'st-1001',
        studentId: 'st-1001',
        email: 'student1@educationspace.edu',
        role: 'STUDENT',
        institutionId: 'inst-1'
      });

      const resPortal = await fetch(`http://localhost:${port}/api/v1/student-portal/st-1002/results`, {
        headers: { 'Authorization': `Bearer ${student1Token}` }
      });
      const portalBody = await resPortal.json();
      server.close();

      expect(resPortal.status).toBe(403);
      expect(portalBody.error.message).toContain('You may only view your own student record');
    });
  });

  // 5. PARENT-CHILD AUTHORIZATION & MANIPULATED API IDs
  describe('5. Parent-Child Authorization Security', () => {
    it('should REJECT Parent A accessing Student C (linked to Parent B) via API ID manipulation (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const parent1Token = signAccessToken({
        userId: 'parent-1',
        email: 'parent1@educationspace.edu',
        role: 'PARENT',
        institutionId: 'inst-1'
      });

      const res = await fetch(`http://localhost:${port}/api/v1/parent/children/st-1003/results`, {
        headers: { 'Authorization': `Bearer ${parent1Token}` }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('You are not linked as an authorized guardian');
    });
  });

  // 6. TEACHER CLASS & SUBJECT SCOPE AUTHORIZATION
  describe('6. Teacher Class & Subject Scope Authorization', () => {
    it('should REJECT teacher accessing unassigned class or subject at API/service level (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const teacherToken = signAccessToken({
        userId: 'teacher-101',
        teacherId: 'teacher-101',
        email: 'teacher101@educationspace.edu',
        role: 'TEACHER',
        institutionId: 'inst-1'
      });

      const res = await fetch(`http://localhost:${port}/api/v1/teacher-portal/classes/class-unassigned-999/students`, {
        headers: { 'Authorization': `Bearer ${teacherToken}` }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('You are not assigned to manage this class or subject');
    });
  });

  // 7. FILE ACCESS SECURITY & FILE UPLOAD RESTRICTIONS
  describe('7. File Access & Upload Security', () => {
    it('should REJECT unauthenticated/unauthorized access to private documents and CV applications (401/403)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      // 1. CV Download unauthenticated
      const cvRes = await fetch(`http://localhost:${port}/api/v1/website/admin/careers/applications/app-1/cv`);
      expect(cvRes.status).toBe(401);

      // 2. Private Document Download unauthorized user
      const student2Token = signAccessToken({
        userId: 'st-1002',
        email: 'student2@educationspace.edu',
        role: 'STUDENT',
        institutionId: 'inst-1'
      });
      const docRes = await fetch(`http://localhost:${port}/api/v1/documents/doc-101/download`, {
        headers: { 'Authorization': `Bearer ${student2Token}` }
      });
      server.close();

      expect(docRes.status).toBe(403);
    });

    it('should REJECT upload of executable or invalid file extensions (400 Bad Request)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const adminToken = signAccessToken({
        userId: 'admin-1',
        email: 'admin@educationspace.edu',
        role: 'SUPER_ADMIN',
        institutionId: 'inst-1',
        permissions: ['website.manage']
      });

      const res = await fetch(`http://localhost:${port}/api/v1/website/admin/downloads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Malicious Payload Test',
          category: 'other',
          fileUrl: '/files/payload.exe'
        })
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Invalid file extension');
    });
  });

  // 8. SENSITIVE DATA EXPOSURE & SECRET MASKING
  describe('8. Sensitive Data Exposure & Secret Masking', () => {
    it('should MASK sensitive secrets (SMTP passwords, SMS API keys) in system configuration (200 OK)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const adminToken = signAccessToken({
        userId: 'admin-1',
        email: 'admin@educationspace.edu',
        role: 'SUPER_ADMIN',
        institutionId: 'inst-1',
        permissions: ['system.manage']
      });

      const res = await fetch(`http://localhost:${port}/api/v1/system/config`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(200);
      expect(body.data.email.smtpPasswordSecret).toBe('••••••••••••');
      expect(body.data.sms.apiKeySecret).toBe('••••••••••••');
    });
  });

  // 9. FINANCIAL DATA INTEGRITY & MANIPULATION
  describe('9. Financial Data Integrity & Manipulation', () => {
    it('should REJECT negative fee payment amounts or invalid bounds (400 Bad Request)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const accountantToken = signAccessToken({
        userId: 'acc-1',
        email: 'accountant@educationspace.edu',
        role: 'ACCOUNTANT',
        institutionId: 'inst-1',
        permissions: ['fees.collect']
      });

      const res = await fetch(`http://localhost:${port}/api/v1/fees/collect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accountantToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: 'st-1001',
          feeHeaderId: 'header-tuition',
          amountPaid: -5000,
          paymentMethod: 'CASH'
        })
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Payment amount must be greater than zero');
    });
  });

  // 10. ACADEMIC MARKS & ATTENDANCE INTEGRITY
  describe('10. Academic Marks & Attendance Integrity', () => {
    it('should REJECT invalid attendance status strings (400 Bad Request)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const adminToken = signAccessToken({
        userId: 'admin-1',
        email: 'admin@educationspace.edu',
        role: 'SUPER_ADMIN',
        institutionId: 'inst-1',
        permissions: ['attendance.mark']
      });

      const res = await fetch(`http://localhost:${port}/api/v1/attendance/mark-bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classId: 'cls-1',
          sectionId: 'sec-1',
          date: '2026-08-20',
          records: [{ studentId: 'st-1001', status: 'INVALID_CORRUPT_STATUS' }]
        })
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Invalid attendance status');
    });
  });

  // 11. CMS AUTHORIZATION & CONTENT LIFECYCLE
  describe('11. CMS Authorization & Content Lifecycle', () => {
    it('should REJECT unauthorized news deletion without website.delete permission (403 Forbidden)', async () => {
      const app = createApp();
      const server = app.listen(0);
      const port = (server.address() as any).port;

      const editorToken = signAccessToken({
        userId: 'editor-1',
        email: 'editor@educationspace.edu',
        role: 'SUPERVISOR',
        institutionId: 'inst-1',
        permissions: ['website.manage'] // Missing website.delete
      });

      const res = await fetch(`http://localhost:${port}/api/v1/website/admin/news/news-2`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${editorToken}` }
      });
      const body = await res.json();
      server.close();

      expect(res.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain("Permission 'website.delete' is required");
    });
  });
});

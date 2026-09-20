import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Document Management & Certificate System Suite', () => {
  it('should upload categorized student and staff documents (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const adminToken = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['documents.manage']
    });

    // 1. Upload Student Admission Document
    const stDocRes = await fetch(`http://localhost:${port}/api/v1/documents/student/st-1001`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Original Matriculation Certificate',
        category: 'ADMISSION',
        fileUrl: '/files/student/matric-1001.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1548576,
        securityLevel: 'PRIVATE'
      })
    });
    const stDocBody = await stDocRes.json();
    expect(stDocRes.status).toBe(201);
    expect(stDocBody.data.category).toBe('ADMISSION');

    // 2. Upload Staff Employment Document
    const sfDocRes = await fetch(`http://localhost:${port}/api/v1/documents/staff/teacher-101`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Faculty Appointment Letter',
        category: 'EMPLOYMENT',
        fileUrl: '/files/staff/appointment-101.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048576,
        securityLevel: 'PRIVATE'
      })
    });
    const sfDocBody = await sfDocRes.json();
    server.close();

    expect(sfDocRes.status).toBe(201);
    expect(sfDocBody.data.category).toBe('EMPLOYMENT');
  });

  it('should issue certificate with auto serial numbering, revoke status, and verify public QR code (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const adminToken = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['documents.manage']
    });

    // 1. Issue Certificate
    const issueRes = await fetch(`http://localhost:${port}/api/v1/documents/certificates/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: 'tpl-merit',
        recipientId: 'st-1001',
        recipientName: 'Zainab Ahmed',
        recipientRole: 'STUDENT',
        title: 'Highest Distinction in Mathematics 2026',
        issuedDate: '2026-08-20'
      })
    });
    const issueBody = await issueRes.json();
    expect(issueRes.status).toBe(201);
    expect(issueBody.data.serialNumber).toMatch(/^CERT-2026-\d+$/);
    const serial = issueBody.data.serialNumber;

    // 2. Verify via Public QR Verification endpoint (no auth required)
    const pubVerifyRes = await fetch(`http://localhost:${port}/api/v1/public/certificates/verify/${serial}`);
    const pubVerifyBody = await pubVerifyRes.json();
    expect(pubVerifyRes.status).toBe(200);
    expect(pubVerifyBody.data.isValid).toBe(true);
    expect(pubVerifyBody.data.recipientName).toBe('Zainab Ahmed');

    // 3. Revoke Certificate
    const revokeRes = await fetch(`http://localhost:${port}/api/v1/documents/certificates/${serial}/revoke`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason: 'Reissued with corrected distinction title.' })
    });
    const revokeBody = await revokeRes.json();
    expect(revokeRes.status).toBe(200);
    expect(revokeBody.data.status).toBe('REVOKED');

    // 4. Verify QR Scanner reflects Revoked status
    const pubVerifyRevRes = await fetch(`http://localhost:${port}/api/v1/public/certificates/verify/${serial}`);
    const pubVerifyRevBody = await pubVerifyRevRes.json();
    server.close();

    expect(pubVerifyRevRes.status).toBe(200);
    expect(pubVerifyRevBody.data.isValid).toBe(false);
    expect(pubVerifyRevBody.data.verificationStatus).toBe('REVOKED');
  });

  it('should REJECT unauthorized access to private document file downloads (401/403)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // 1. Unauthenticated request
    const unauthRes = await fetch(`http://localhost:${port}/api/v1/documents/doc-101/download`);
    expect(unauthRes.status).toBe(401);

    // 2. Unauthorized student attempting to download another user's private doc
    const student2Token = signAccessToken({
      userId: 'st-1002',
      email: 'hamza@student.educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    const forbiddenRes = await fetch(`http://localhost:${port}/api/v1/documents/doc-101/download`, {
      headers: { 'Authorization': `Bearer ${student2Token}` }
    });
    const forbiddenBody = await forbiddenRes.json();
    server.close();

    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenBody.success).toBe(false);
    expect(forbiddenBody.error.message).toContain('Access denied');
  });
});

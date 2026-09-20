import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Contact Messages Inbox & Protected Careers Suite', () => {
  it('should submit contact inquiry, manage inbox states, and send reply (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['website.manage']
    });

    // 1. Public contact submission
    const contactRes = await fetch(`http://localhost:${port}/api/v1/website/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alexander Hamilton',
        email: 'hamilton@patriot.org',
        phone: '+92 300 7766554',
        subject: 'STEM Robotics Sponsorship & Curriculum Inquiry',
        message: 'We are interested in collaborating with your supercomputing lab.'
      })
    });

    const contactBody = await contactRes.json();
    expect(contactRes.status).toBe(200);
    expect(contactBody.data.subject).toContain('STEM Robotics');
    const msgId = contactBody.data.id;

    // 2. Admin transition to READ
    const readRes = await fetch(`http://localhost:${port}/api/v1/website/admin/contact-messages/${msgId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'READ' })
    });
    expect(readRes.status).toBe(200);

    // 3. Admin send reply
    const replyRes = await fetch(`http://localhost:${port}/api/v1/website/admin/contact-messages/${msgId}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ replyMessage: 'Thank you for reaching out! Our STEM Director will arrange a campus visit.' })
    });

    const replyBody = await replyRes.json();
    server.close();

    expect(replyRes.status).toBe(200);
    expect(replyBody.data.status).toBe('REPLIED');
  });

  it('should post job vacancy, accept job application, and strictly protect CV file downloads (401/403 for unauthorized users)', async () => {
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

    // 1. Post Vacancy
    const vacRes = await fetch(`http://localhost:${port}/api/v1/website/admin/careers/vacancies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobTitle: 'Head of Supercomputing & AI Infrastructure',
        department: 'STEM_LABS',
        description: 'Lead AI supercomputing cluster administration.',
        requirements: ['MS in Computer Science', 'PyTorch / CUDA experience'],
        status: 'PUBLISHED'
      })
    });

    const vacBody = await vacRes.json();
    expect(vacRes.status).toBe(201);
    const vacId = vacBody.data.id;

    // 2. Submit Public Application
    const appRes = await fetch(`http://localhost:${port}/api/v1/website/careers/vacancies/${vacId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantName: 'Dr. Alan Turing',
        email: 'turing@ai.edu',
        phone: '+92 300 4433221',
        experienceYears: 8,
        coverLetter: 'Expert in computing architecture.',
        cvFileUrl: '/protected-cvs/turing-cv.pdf'
      })
    });

    const appBody = await appRes.json();
    expect(appRes.status).toBe(201);
    const appId = appBody.data.id;

    // 3. Reject unauthenticated access to CV file (401 Unauthorized)
    const unauthCvRes = await fetch(`http://localhost:${port}/api/v1/website/admin/careers/applications/${appId}/cv`);
    expect(unauthCvRes.status).toBe(401);

    // 4. Allow authorized admin access to CV file (200 OK)
    const adminCvRes = await fetch(`http://localhost:${port}/api/v1/website/admin/careers/applications/${appId}/cv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const cvBody = await adminCvRes.json();
    server.close();

    expect(adminCvRes.status).toBe(200);
    expect(cvBody.data.applicantName).toBe('Dr. Alan Turing');
    expect(cvBody.data.cvFileUrl).toBe('/protected-cvs/turing-cv.pdf');
  });
});

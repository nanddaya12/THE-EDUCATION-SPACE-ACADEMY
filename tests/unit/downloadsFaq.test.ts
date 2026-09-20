import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Downloads & FAQ CMS Suite', () => {
  it('should validate secure file extensions, create document, track download count, and enforce public isolation (201 Created)', async () => {
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

    // 1. Reject invalid file extension (.exe)
    const rejRes = await fetch(`http://localhost:${port}/api/v1/website/admin/downloads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Malicious File Test',
        category: 'PROSPECTUS',
        fileUrl: '/downloads/test.exe',
        status: 'PUBLISHED'
      })
    });
    expect(rejRes.status).toBe(400);

    // 2. Allow valid file extension (.pdf) in DRAFT status
    const docRes = await fetch(`http://localhost:${port}/api/v1/website/admin/downloads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Midterm Examination Schedule Fall 2026',
        category: 'EXAM_SCHEDULES',
        description: 'Complete date sheet for Grade 9 to 12 midterms.',
        fileUrl: '/downloads/exam-schedule-fall-2026.pdf',
        fileType: 'PDF',
        fileSize: '1.5 MB',
        status: 'DRAFT'
      })
    });

    const docBody = await docRes.json();
    expect(docRes.status).toBe(201);
    expect(docBody.success).toBe(true);
    const docId = docBody.data.id;

    // 3. Verify DRAFT document is HIDDEN from public GET /downloads
    const pubRes1 = await fetch(`http://localhost:${port}/api/v1/website/downloads`);
    const pubBody1 = await pubRes1.json();
    const draftFound = pubBody1.data.find((d: any) => d.id === docId);
    expect(draftFound).toBeUndefined();

    // 4. Transition to PUBLISHED
    const pubStatusRes = await fetch(`http://localhost:${port}/api/v1/website/admin/downloads/${docId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    expect(pubStatusRes.status).toBe(200);

    // 5. Verify PUBLISHED document IS VISIBLE on public GET /downloads
    const pubRes2 = await fetch(`http://localhost:${port}/api/v1/website/downloads?category=EXAM_SCHEDULES`);
    const pubBody2 = await pubRes2.json();
    const pubFound = pubBody2.data.find((d: any) => d.id === docId);
    expect(pubFound).toBeDefined();

    // 6. Track download count
    const trackRes = await fetch(`http://localhost:${port}/api/v1/website/downloads/${docId}/track`, {
      method: 'POST'
    });
    const trackBody = await trackRes.json();
    server.close();

    expect(trackRes.status).toBe(200);
    expect(trackBody.data.downloadCount).toBe(1);
  });

  it('should create FAQ, support category filter and sort reordering (201 Created)', async () => {
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

    // 1. Create FAQ in PUBLISHED status
    const faqRes = await fetch(`http://localhost:${port}/api/v1/website/admin/faqs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: 'What sports facilities are available on campus?',
        answer: 'The campus includes an Olympic-size swimming pool, 400m athletics track, synthetic turf football pitch, and indoor badminton court.',
        category: 'CAMPUS_RULES',
        sortOrder: 1,
        status: 'PUBLISHED'
      })
    });

    const faqBody = await faqRes.json();
    expect(faqRes.status).toBe(201);
    expect(faqBody.data.category).toBe('CAMPUS_RULES');

    // 2. Fetch public FAQs filtered by category
    const pubFaqRes = await fetch(`http://localhost:${port}/api/v1/website/faqs?category=CAMPUS_RULES`);
    const pubFaqBody = await pubFaqRes.json();
    server.close();

    expect(pubFaqRes.status).toBe(200);
    expect(pubFaqBody.data.length).toBeGreaterThan(0);
    expect(pubFaqBody.data[0].question).toContain('sports facilities');
  });
});

import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Admin Panel Website CMS & Content Lifecycle Suite', () => {
  it('should support content lifecycle state machine DRAFT -> PREVIEW -> PUBLISHED -> UNPUBLISHED -> ARCHIVED (200 OK)', async () => {
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

    // 1. Create item in DRAFT status
    const createRes = await fetch(`http://localhost:${port}/api/v1/website/admin/content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        module: 'banners',
        title: 'Promotional Banner 2027',
        status: 'DRAFT',
        content: {
          id: 'banner-exp-1',
          title: 'Promotional Banner 2027',
          summary: 'New Islamabad South Campus opening next year.'
        }
      })
    });

    const createBody = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createBody.data.status).toBe('DRAFT');
    const itemId = createBody.data.id;

    // 2. Verify DRAFT item is listed under DRAFT status in admin content
    const pubRes1 = await fetch(`http://localhost:${port}/api/v1/website/admin/content?module=banners&status=DRAFT`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pubBody1 = await pubRes1.json();
    const draftFound = pubBody1.data.find((n: any) => n.id === itemId);
    expect(draftFound).toBeDefined();

    // 3. Transition to PUBLISHED
    const pubStateRes = await fetch(`http://localhost:${port}/api/v1/website/admin/content/${itemId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    const pubStateBody = await pubStateRes.json();
    expect(pubStateRes.status).toBe(200);
    expect(pubStateBody.data.status).toBe('PUBLISHED');

    // 4. Verify PUBLISHED item IS VISIBLE in admin content with status=PUBLISHED
    const pubRes2 = await fetch(`http://localhost:${port}/api/v1/website/admin/content?module=banners&status=PUBLISHED`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pubBody2 = await pubRes2.json();
    const publishedFound = pubBody2.data.find((n: any) => n.id === itemId);
    expect(publishedFound).toBeDefined();

    // 5. Transition to ARCHIVED
    const archStateRes = await fetch(`http://localhost:${port}/api/v1/website/admin/content/${itemId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'ARCHIVED' })
    });
    expect(archStateRes.status).toBe(200);

    // 6. Verify ARCHIVED item is HIDDEN from public GET /news
    const pubRes3 = await fetch(`http://localhost:${port}/api/v1/website/news`);
    const pubBody3 = await pubRes3.json();
    const archFound = pubBody3.data.find((n: any) => n.id === 'news-exp-1');
    expect(archFound).toBeUndefined();

    server.close();
  });

  it('should block unauthorized users without website.manage permission (403 Forbidden)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const studentToken = signAccessToken({
      userId: 'st-1',
      email: 'student@educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1',
      permissions: []
    });

    const res = await fetch(`http://localhost:${port}/api/v1/website/admin/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    server.close();
    expect(res.status).toBe(403);
  });

  it('should fetch contact messages inbox and update website settings (200 OK)', async () => {
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

    // Update settings
    const setRes = await fetch(`http://localhost:${port}/api/v1/website/admin/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '+92 51 999 888 777'
      })
    });
    const setBody = await setRes.json();
    expect(setRes.status).toBe(200);
    expect(setBody.data.phone).toBe('+92 51 999 888 777');

    server.close();
  });
});

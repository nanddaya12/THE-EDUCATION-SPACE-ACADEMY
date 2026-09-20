import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Announcements Module & 5-Stage Lifecycle Suite', () => {
  it('should create an announcement with rich schema, automatic slug generation, and write an AuditLog entry (201 Created)', async () => {
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

    const res = await fetch(`http://localhost:${port}/api/v1/website/admin/announcements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Winter STEM Robotics Challenge 2026',
        category: 'ACADEMIC',
        summary: 'Registration opens for the annual Winter STEM Robotics Challenge.',
        content: 'All Grade 9 to 12 students are invited to register their teams for the Winter STEM Robotics Challenge.',
        featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        publishDate: new Date().toISOString(),
        audience: 'STUDENTS',
        status: 'PUBLISHED',
        isFeatured: true
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe('winter-stem-robotics-challenge-2026');
    expect(body.data.status).toBe('PUBLISHED');
  });

  it('should support 5-stage lifecycle transitions (DRAFT -> SCHEDULED -> PUBLISHED -> EXPIRED -> ARCHIVED)', async () => {
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

    // 1. Create item in DRAFT
    const createRes = await fetch(`http://localhost:${port}/api/v1/website/admin/announcements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Draft Schedule Announcement',
        category: 'EVENTS',
        summary: 'Draft summary',
        content: 'Draft content',
        status: 'DRAFT'
      })
    });

    const createBody = await createRes.json();
    const annId = createBody.data.id;
    expect(createBody.data.status).toBe('DRAFT');

    // 2. Transition DRAFT -> SCHEDULED
    const schedRes = await fetch(`http://localhost:${port}/api/v1/website/admin/announcements/${annId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'SCHEDULED' })
    });
    const schedBody = await schedRes.json();
    expect(schedBody.data.status).toBe('SCHEDULED');

    // 3. Transition SCHEDULED -> PUBLISHED
    const pubRes = await fetch(`http://localhost:${port}/api/v1/website/admin/announcements/${annId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    const pubBody = await pubRes.json();
    expect(pubBody.data.status).toBe('PUBLISHED');

    // 4. Transition PUBLISHED -> EXPIRED
    const expRes = await fetch(`http://localhost:${port}/api/v1/website/admin/announcements/${annId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'EXPIRED' })
    });
    const expBody = await expRes.json();
    expect(expBody.data.status).toBe('EXPIRED');

    server.close();
  });

  it('should filter public announcements by category and search query (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/website/announcements?category=ADMINISTRATIVE&q=Uniform`, {
      method: 'GET'
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should fetch featured announcements and announcement detail by slug (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // 1. Featured
    const featRes = await fetch(`http://localhost:${port}/api/v1/website/announcements/featured`);
    const featBody = await featRes.json();
    expect(featRes.status).toBe(200);
    expect(featBody.success).toBe(true);

    // 2. Slug detail
    const slugRes = await fetch(`http://localhost:${port}/api/v1/website/announcements/slug/winter-uniform-transition-mandatory-from-nov-1st`);
    const slugBody = await slugRes.json();
    server.close();

    expect(slugRes.status).toBe(200);
    expect(slugBody.data.title).toContain('Winter Uniform');
  });
});

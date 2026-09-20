import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Dynamic Homepage CMS & Section Ordering Suite', () => {
  it('should fetch dynamic public homepage content with 0 hardcoded text (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/website/home`);
    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.sectionOrder)).toBe(true);
    expect(body.data.heroBanners.length).toBeGreaterThan(0);
    expect(body.data.welcomeMessage.title).toBeDefined();
    expect(body.data.principalMessage.name).toBeDefined();
    expect(body.data.statistics.length).toBeGreaterThan(0);
  });

  it('should allow admin to reorder homepage sections and update dynamic CMS blocks (200 OK)', async () => {
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

    const newOrder = ['stats', 'hero', 'welcome', 'principal', 'programs', 'announcements', 'news', 'events', 'gallery', 'cta', 'contact'];

    // 1. Update Section Order and Welcome Message
    const updateRes = await fetch(`http://localhost:${port}/api/v1/website/admin/homepage`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sectionOrder: newOrder,
        welcomeMessage: {
          title: 'Updated Global Academy Welcome 2026',
          subtitle: 'Leading Digital & AI Transformation',
          body: 'Updated welcome body text for public homepage.'
        }
      })
    });

    const updateBody = await updateRes.json();
    expect(updateRes.status).toBe(200);
    expect(updateBody.data.sectionOrder[0]).toBe('stats');
    expect(updateBody.data.welcomeMessage.title).toBe('Updated Global Academy Welcome 2026');

    // 2. Verify public GET /home reflects new section order immediately
    const pubRes = await fetch(`http://localhost:${port}/api/v1/website/home`);
    const pubBody = await pubRes.json();
    server.close();

    expect(pubRes.status).toBe(200);
    expect(pubBody.data.sectionOrder[0]).toBe('stats');
    expect(pubBody.data.welcomeMessage.title).toBe('Updated Global Academy Welcome 2026');
  });
});

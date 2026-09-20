import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise News & Press Release Suite', () => {
  it('should create a news article with rich schema, photo gallery, SEO tags, and automatic slug generation (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['website.manage', 'website.delete']
    });

    const res = await fetch(`http://localhost:${port}/api/v1/website/admin/news`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'National STEM Competition Victory 2026',
        category: 'ACHIEVEMENTS',
        summary: 'Academy robotics team wins 1st prize at National Science Fair.',
        content: 'Our Grade 11 STEM students presented their autonomous solar rover design.',
        featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600', caption: 'Award Ceremony' }
        ],
        publishDate: new Date().toISOString(),
        seoTitle: 'National STEM Victory 2026 | Academy News',
        seoDescription: 'Read about our 1st prize win at the National Science Fair 2026.',
        status: 'PUBLISHED'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe('national-stem-competition-victory-2026');
    expect(body.data.seoTitle).toContain('National STEM Victory');
  });

  it('should fetch latest news, detail by slug, and related news recommendations (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    // 1. Latest news
    const latestRes = await fetch(`http://localhost:${port}/api/v1/website/news/latest?limit=2`);
    const latestBody = await latestRes.json();
    expect(latestRes.status).toBe(200);
    expect(latestBody.data.length).toBeGreaterThan(0);

    // 2. Detail by slug
    const slugRes = await fetch(`http://localhost:${port}/api/v1/website/news/slug/academy-students-win-international-robotics-gold-medal`);
    const slugBody = await slugRes.json();
    expect(slugRes.status).toBe(200);
    expect(slugBody.data.title).toContain('Robotics Gold Medal');

    // 3. Related news
    const relRes = await fetch(`http://localhost:${port}/api/v1/website/news/news-1/related`);
    const relBody = await relRes.json();
    server.close();

    expect(relRes.status).toBe(200);
    expect(Array.isArray(relBody.data)).toBe(true);
  });

  it('should enforce permission-guarded news deletion (403 Forbidden without website.delete)', async () => {
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

    const adminToken = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1',
      permissions: ['website.delete']
    });

    // 1. Reject student
    const rejRes = await fetch(`http://localhost:${port}/api/v1/website/admin/news/news-2`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    expect(rejRes.status).toBe(403);

    // 2. Allow authorized admin
    const delRes = await fetch(`http://localhost:${port}/api/v1/website/admin/news/news-2`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const delBody = await delRes.json();
    server.close();

    expect(delRes.status).toBe(200);
    expect(delBody.data.success).toBe(true);
  });
});

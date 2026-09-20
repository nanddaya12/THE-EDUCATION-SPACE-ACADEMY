import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Album-Based Gallery CMS Suite', () => {
  it('should create album, batch upload photos, reorder sort order, and transition status (201 Created)', async () => {
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

    // 1. Create Album in DRAFT status
    const albumRes = await fetch(`http://localhost:${port}/api/v1/website/admin/gallery/albums`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Annual Cultural Festival 2026',
        category: 'Cultural Activities',
        description: 'Drama performances, musical concerts, and folk dance.',
        eventDate: '2026-03-20',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        status: 'DRAFT',
        visibility: 'PUBLIC'
      })
    });

    const albumBody = await albumRes.json();
    expect(albumRes.status).toBe(201);
    expect(albumBody.success).toBe(true);
    expect(albumBody.data.slug).toBe('annual-cultural-festival-2026');
    const albumId = albumBody.data.id;

    // 2. Batch Upload 2 Photos
    const photoRes = await fetch(`http://localhost:${port}/api/v1/website/admin/gallery/albums/${albumId}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        photos: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
            title: 'Folk Dance Performance',
            caption: 'Students performing traditional Kathak dance.'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200',
            title: 'Orchestra Symphony',
            caption: 'Academy Symphony Orchestra performing Beethoven Symphony No. 5.'
          }
        ]
      })
    });

    const photoBody = await photoRes.json();
    expect(photoRes.status).toBe(201);
    expect(photoBody.data.album.photoCount).toBe(2);
    expect(photoBody.data.addedPhotos.length).toBe(2);

    // 3. Verify DRAFT album is HIDDEN from public GET /gallery/albums
    const pubRes1 = await fetch(`http://localhost:${port}/api/v1/website/gallery/albums`);
    const pubBody1 = await pubRes1.json();
    const draftFound = pubBody1.data.find((a: any) => a.id === albumId);
    expect(draftFound).toBeUndefined();

    // 4. Transition to PUBLISHED
    const pubStatusRes = await fetch(`http://localhost:${port}/api/v1/website/admin/gallery/albums/${albumId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    expect(pubStatusRes.status).toBe(200);

    // 5. Verify PUBLISHED album IS VISIBLE on public GET /gallery/albums
    const pubRes2 = await fetch(`http://localhost:${port}/api/v1/website/gallery/albums?category=Cultural Activities`);
    const pubBody2 = await pubRes2.json();
    const pubFound = pubBody2.data.find((a: any) => a.id === albumId);
    expect(pubFound).toBeDefined();
    expect(pubFound.photoCount).toBe(2);

    // 6. Fetch album detail by slug
    const slugRes = await fetch(`http://localhost:${port}/api/v1/website/gallery/albums/slug/annual-cultural-festival-2026`);
    const slugBody = await slugRes.json();
    server.close();

    expect(slugRes.status).toBe(200);
    expect(slugBody.data.photos.length).toBe(2);
    expect(slugBody.data.photos[0].title).toBe('Folk Dance Performance');
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

    const res = await fetch(`http://localhost:${port}/api/v1/website/admin/gallery/albums`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });

    server.close();
    expect(res.status).toBe(403);
  });
});

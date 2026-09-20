import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export type GalleryCategory = 
  | 'Events'
  | 'Sports'
  | 'Competitions'
  | 'Seminars'
  | 'Workshops'
  | 'Celebrations'
  | 'Academic Activities'
  | 'Cultural Activities'
  | 'Other';

export interface GalleryPhoto {
  id: string;
  albumId: string;
  imageUrl: string;
  thumbnailUrl: string;
  title?: string;
  caption?: string;
  sortOrder: number;
  createdAt: Date;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: GalleryCategory;
  eventDate: string; // ISO Date string
  coverImage: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE';
  photoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const memoryAlbums: GalleryAlbum[] = [
  {
    id: 'alb-1',
    title: 'Annual Sports Day 2026',
    slug: 'annual-sports-day-2026',
    description: 'Highlights and award presentations from the 28th Annual Sports Gala.',
    category: 'Sports',
    eventDate: '2026-02-15',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    photoCount: 3,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15')
  },
  {
    id: 'alb-2',
    title: 'International Robotics & STEM Expo 2026',
    slug: 'international-robotics-stem-expo-2026',
    description: 'Student prototype demonstrations and VEX robotics championship.',
    category: 'Academic Activities',
    eventDate: '2026-05-10',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    photoCount: 2,
    createdAt: new Date('2026-05-10'),
    updatedAt: new Date('2026-05-10')
  }
];

const memoryPhotos: GalleryPhoto[] = [
  {
    id: 'pho-1',
    albumId: 'alb-1',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    title: 'Track & Field Sprint Relay',
    caption: 'Grade 11 athletes completing the 400m sprint relay final.',
    sortOrder: 1,
    createdAt: new Date('2026-02-15')
  },
  {
    id: 'pho-2',
    albumId: 'alb-1',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    title: 'Football Championship Trophy',
    caption: 'Senior team receiving the Inter-School Championship Trophy.',
    sortOrder: 2,
    createdAt: new Date('2026-02-15')
  },
  {
    id: 'pho-3',
    albumId: 'alb-1',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400',
    title: 'Gymnastic Performance',
    caption: 'Junior gymnastics team ribbon routine.',
    sortOrder: 3,
    createdAt: new Date('2026-02-15')
  },
  {
    id: 'pho-4',
    albumId: 'alb-2',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
    title: 'Autonomous Solar Rover',
    caption: 'STEM team demonstrating obstacle avoidance sensor suite.',
    sortOrder: 1,
    createdAt: new Date('2026-05-10')
  },
  {
    id: 'pho-5',
    albumId: 'alb-2',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    title: 'AI Workstation Pods',
    caption: 'Students running machine learning models in supercomputing lab.',
    sortOrder: 2,
    createdAt: new Date('2026-05-10')
  }
];

export class GalleryRepository {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Public GET: List published and public albums with category filter
  public async getPublicAlbums(category?: string) {
    let albums = memoryAlbums.filter(a => a.status === 'PUBLISHED' && a.visibility === 'PUBLIC');

    if (category && category !== 'ALL') {
      albums = albums.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    return albums.map(a => {
      const photosCount = memoryPhotos.filter(p => p.albumId === a.id).length;
      return { ...a, photoCount: photosCount };
    });
  }

  public async getAlbumBySlug(slug: string) {
    const album = memoryAlbums.find(a => a.slug === slug);
    if (!album) throw new NotFoundError(`Album with slug '${slug}' not found.`);

    const photos = memoryPhotos
      .filter(p => p.albumId === album.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return { ...album, photoCount: photos.length, photos };
  }

  public async getAlbumPhotos(albumId: string) {
    return memoryPhotos
      .filter(p => p.albumId === albumId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Admin GET: List all albums regardless of status or visibility
  public async listAdminAlbums(status?: string, category?: string) {
    let albums = memoryAlbums;

    if (status && status !== 'ALL') {
      albums = albums.filter(a => a.status === status);
    }
    if (category && category !== 'ALL') {
      albums = albums.filter(a => a.category === category);
    }

    return albums.map(a => {
      const photosCount = memoryPhotos.filter(p => p.albumId === a.id).length;
      return { ...a, photoCount: photosCount };
    });
  }

  public async createAlbum(data: {
    title: string;
    description: string;
    category: GalleryCategory;
    eventDate: string;
    coverImage?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    visibility?: 'PUBLIC' | 'PRIVATE';
    userId?: string;
  }) {
    if (!data.title || !data.category || !data.description) {
      throw new BadRequestError('Title, category, and description are required for album creation.');
    }

    const slug = this.generateSlug(data.title);
    const newAlbum: GalleryAlbum = {
      id: `alb-${Date.now()}`,
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      eventDate: data.eventDate || new Date().toISOString().split('T')[0],
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      status: data.status || 'DRAFT',
      visibility: data.visibility || 'PUBLIC',
      photoCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryAlbums.unshift(newAlbum);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'CREATE_GALLERY_ALBUM',
          module: 'GALLERY',
          details: `Created gallery album '${newAlbum.title}' in category '${newAlbum.category}'`
        }
      });
    } catch (e) {}

    return newAlbum;
  }

  public async addPhotosToAlbum(albumId: string, photosData: { imageUrl: string; thumbnailUrl?: string; title?: string; caption?: string }[], userId?: string) {
    const album = memoryAlbums.find(a => a.id === albumId);
    if (!album) throw new NotFoundError('Album not found.');

    const currentPhotos = memoryPhotos.filter(p => p.albumId === albumId);
    let nextSortOrder = currentPhotos.length + 1;

    const addedPhotos: GalleryPhoto[] = [];
    for (const p of photosData) {
      const photo: GalleryPhoto = {
        id: `pho-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        albumId,
        imageUrl: p.imageUrl,
        thumbnailUrl: p.thumbnailUrl || p.imageUrl,
        title: p.title || '',
        caption: p.caption || '',
        sortOrder: nextSortOrder++,
        createdAt: new Date()
      };
      memoryPhotos.push(photo);
      addedPhotos.push(photo);
    }

    album.photoCount = memoryPhotos.filter(p => p.albumId === albumId).length;
    if (addedPhotos.length > 0 && !album.coverImage) {
      album.coverImage = addedPhotos[0].imageUrl;
    }
    album.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'BATCH_UPLOAD_GALLERY_PHOTOS',
          module: 'GALLERY',
          details: `Uploaded ${addedPhotos.length} photos to album '${album.title}'`
        }
      });
    } catch (e) {}

    return { album, addedPhotos };
  }

  public async reorderAlbumPhotos(albumId: string, photoOrders: { photoId: string; sortOrder: number }[], userId?: string) {
    const album = memoryAlbums.find(a => a.id === albumId);
    if (!album) throw new NotFoundError('Album not found.');

    for (const order of photoOrders) {
      const photo = memoryPhotos.find(p => p.id === order.photoId && p.albumId === albumId);
      if (photo) {
        photo.sortOrder = order.sortOrder;
      }
    }

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'REORDER_GALLERY_PHOTOS',
          module: 'GALLERY',
          details: `Reordered photos in album '${album.title}'`
        }
      });
    } catch (e) {}

    return this.getAlbumPhotos(albumId);
  }

  public async updatePhotoCaption(photoId: string, data: { title?: string; caption?: string; imageUrl?: string }, userId?: string) {
    const photo = memoryPhotos.find(p => p.id === photoId);
    if (!photo) throw new NotFoundError('Photo not found.');

    if (data.title !== undefined) photo.title = data.title;
    if (data.caption !== undefined) photo.caption = data.caption;
    if (data.imageUrl) {
      photo.imageUrl = data.imageUrl;
      photo.thumbnailUrl = data.imageUrl;
    }

    return photo;
  }

  public async deletePhoto(photoId: string, userId?: string) {
    const idx = memoryPhotos.findIndex(p => p.id === photoId);
    if (idx === -1) throw new NotFoundError('Photo not found.');

    const deleted = memoryPhotos.splice(idx, 1)[0];
    const album = memoryAlbums.find(a => a.id === deleted.albumId);
    if (album) {
      album.photoCount = memoryPhotos.filter(p => p.albumId === album.id).length;
      album.updatedAt = new Date();
    }

    return { success: true, deletedId: photoId };
  }

  public async updateAlbumStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED', userId?: string) {
    const album = memoryAlbums.find(a => a.id === id);
    if (!album) throw new NotFoundError('Album not found.');

    const oldStatus = album.status;
    album.status = status;
    album.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_GALLERY_ALBUM_STATUS',
          module: 'GALLERY',
          details: `Transitioned album '${album.title}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return album;
  }

  public async deleteAlbum(id: string, userId?: string) {
    const idx = memoryAlbums.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundError('Album not found.');

    const deleted = memoryAlbums.splice(idx, 1)[0];
    // Remove associated photos
    const remainingPhotos = memoryPhotos.filter(p => p.albumId !== id);
    memoryPhotos.length = 0;
    memoryPhotos.push(...remainingPhotos);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'DELETE_GALLERY_ALBUM',
          module: 'GALLERY',
          details: `Deleted gallery album '${deleted.title}' (ID: ${deleted.id})`
        }
      });
    } catch (e) {}

    return { success: true, deletedId: id };
  }
}

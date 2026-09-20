import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export interface AnnouncementItem {
  id: string;
  title: string;
  slug: string;
  category: 'ACADEMIC' | 'EVENTS' | 'ADMINISTRATIVE' | 'SPORTS' | 'EXAMINATIONS';
  summary: string;
  content: string;
  featuredImage?: string;
  attachments: { title: string; url: string; fileType: string }[];
  publishDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  audience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF';
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED';
  isFeatured: boolean;
  author: { id: string; name: string; role: string };
  createdAt: Date;
  updatedAt: Date;
}

const memoryAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Winter Uniform Transition Mandatory from Nov 1st',
    slug: 'winter-uniform-transition-mandatory-from-nov-1st',
    category: 'ADMINISTRATIVE',
    summary: 'All students are required to transition to winter uniform starting November 1st, 2026.',
    content: 'Dear Parents & Students,\n\nPlease be advised that the mandatory winter uniform policy will take effect on November 1st, 2026. Navy blazers and grey trousers/skirts are mandatory for all grades.',
    featuredImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
    attachments: [
      { title: 'Winter Uniform Policy Guide PDF', url: 'https://docs.educationspace.edu/uniform-policy.pdf', fileType: 'PDF' }
    ],
    publishDate: '2026-08-01T00:00:00.000Z',
    expiryDate: '2026-11-30T00:00:00.000Z',
    audience: 'ALL',
    status: 'PUBLISHED',
    isFeatured: true,
    author: { id: 'admin-1', name: 'Dr. Arthur Pendelton', role: 'Principal' },
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date('2026-08-01')
  },
  {
    id: 'ann-2',
    title: 'Cambridge Mock Exam Date Sheet Released 2026',
    slug: 'cambridge-mock-exam-date-sheet-released-2026',
    category: 'EXAMINATIONS',
    summary: 'Download the official Cambridge Mock Examination Schedule for Grades 10 and 12.',
    content: 'The date sheet for upcoming Cambridge IGCSE and A-Levels Mock Examinations 2026 has been published. Exams commence on September 15th.',
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    attachments: [
      { title: 'Mock Exam Schedule 2026 PDF', url: 'https://docs.educationspace.edu/mock-datesheet-2026.pdf', fileType: 'PDF' }
    ],
    publishDate: '2026-08-10T00:00:00.000Z',
    expiryDate: '2026-10-01T00:00:00.000Z',
    audience: 'STUDENTS',
    status: 'PUBLISHED',
    isFeatured: false,
    author: { id: 'admin-2', name: 'Eleanor Vance', role: 'Vice Principal' },
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-10')
  }
];

export class AnnouncementsRepository {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private evaluateAutoExpiry(ann: AnnouncementItem): AnnouncementItem {
    const now = new Date();
    if (ann.status === 'PUBLISHED' && ann.expiryDate) {
      if (new Date(ann.expiryDate) < now) {
        ann.status = 'EXPIRED';
      }
    }
    if (ann.status === 'SCHEDULED' && ann.publishDate) {
      if (new Date(ann.publishDate) <= now) {
        ann.status = 'PUBLISHED';
      }
    }
    return ann;
  }

  // Public GET: List active published announcements with search & category filters
  public async getPublicAnnouncements(params?: { category?: string; query?: string; page?: number; limit?: number }) {
    let items = memoryAnnouncements.map(ann => this.evaluateAutoExpiry(ann));

    // Filter strictly for PUBLISHED items within valid date range
    const now = new Date();
    items = items.filter(ann => {
      if (ann.status !== 'PUBLISHED') return false;
      if (new Date(ann.publishDate) > now) return false;
      if (ann.expiryDate && new Date(ann.expiryDate) < now) return false;
      return true;
    });

    if (params?.category && params.category !== 'ALL') {
      items = items.filter(ann => ann.category.toUpperCase() === params.category!.toUpperCase());
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      items = items.filter(ann => 
        ann.title.toLowerCase().includes(q) || 
        ann.summary.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q)
      );
    }

    return items;
  }

  public async getFeaturedAnnouncements(limit?: number) {
    const publicItems = await this.getPublicAnnouncements();
    const featured = publicItems.filter(ann => ann.isFeatured);
    return limit ? featured.slice(0, limit) : featured;
  }

  public async getAnnouncementBySlug(slug: string) {
    const ann = memoryAnnouncements.find(a => a.slug === slug);
    if (!ann) throw new NotFoundError(`Announcement with slug '${slug}' not found.`);
    return this.evaluateAutoExpiry(ann);
  }

  // Admin GET: List all announcements regardless of status
  public async listAdminAnnouncements(status?: string, category?: string) {
    let items = memoryAnnouncements.map(ann => this.evaluateAutoExpiry(ann));

    if (status && status !== 'ALL') {
      items = items.filter(ann => ann.status === status);
    }
    if (category && category !== 'ALL') {
      items = items.filter(ann => ann.category === category);
    }

    return items;
  }

  public async createAnnouncement(data: {
    title: string;
    category: 'ACADEMIC' | 'EVENTS' | 'ADMINISTRATIVE' | 'SPORTS' | 'EXAMINATIONS';
    summary: string;
    content: string;
    featuredImage?: string;
    attachments?: { title: string; url: string; fileType: string }[];
    publishDate?: string;
    expiryDate?: string;
    audience?: 'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF';
    status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
    isFeatured?: boolean;
    author: { id: string; name: string; role: string };
  }) {
    if (!data.title || !data.category || !data.summary || !data.content) {
      throw new BadRequestError('Title, category, summary, and content are required.');
    }

    const slug = this.generateSlug(data.title);
    const publishDate = data.publishDate || new Date().toISOString();

    let initialStatus = data.status || 'DRAFT';
    if (initialStatus === 'PUBLISHED' && data.publishDate && new Date(data.publishDate) > new Date()) {
      initialStatus = 'SCHEDULED';
    }

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: data.title,
      slug,
      category: data.category,
      summary: data.summary,
      content: data.content,
      featuredImage: data.featuredImage,
      attachments: data.attachments || [],
      publishDate,
      expiryDate: data.expiryDate,
      audience: data.audience || 'ALL',
      status: initialStatus,
      isFeatured: data.isFeatured ?? false,
      author: data.author,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryAnnouncements.unshift(newAnn);

    // Audit Logging Entry
    try {
      await db.auditLog.create({
        data: {
          action: 'CREATE_ANNOUNCEMENT',
          module: 'ANNOUNCEMENTS',
          details: `Created announcement '${newAnn.title}' in status '${newAnn.status}'`
        }
      });
    } catch (e) {
      // Audit log fallback
    }

    return newAnn;
  }

  public async updateAnnouncement(id: string, data: Partial<AnnouncementItem>, userId?: string) {
    const ann = memoryAnnouncements.find(a => a.id === id);
    if (!ann) throw new NotFoundError('Announcement not found.');

    if (data.title) {
      ann.title = data.title;
      ann.slug = this.generateSlug(data.title);
    }
    if (data.category) ann.category = data.category;
    if (data.summary) ann.summary = data.summary;
    if (data.content) ann.content = data.content;
    if (data.featuredImage !== undefined) ann.featuredImage = data.featuredImage;
    if (data.attachments !== undefined) ann.attachments = data.attachments;
    if (data.publishDate) ann.publishDate = data.publishDate;
    if (data.expiryDate !== undefined) ann.expiryDate = data.expiryDate;
    if (data.audience) ann.audience = data.audience;
    if (data.isFeatured !== undefined) ann.isFeatured = data.isFeatured;
    ann.updatedAt = new Date();

    // Audit Log Entry
    try {
      await db.auditLog.create({
        data: {
          action: 'UPDATE_ANNOUNCEMENT',
          module: 'ANNOUNCEMENTS',
          details: `Updated announcement '${ann.title}'`
        }
      });
    } catch (e) {}

    return ann;
  }

  public async updateAnnouncementStatus(id: string, status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED', userId?: string) {
    const ann = memoryAnnouncements.find(a => a.id === id);
    if (!ann) throw new NotFoundError('Announcement not found.');

    const oldStatus = ann.status;
    ann.status = status;
    ann.updatedAt = new Date();

    // Audit Log Entry
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_ANNOUNCEMENT_STATUS',
          module: 'ANNOUNCEMENTS',
          details: `Transitioned announcement '${ann.title}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return ann;
  }
}

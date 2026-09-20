import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  gallery: { url: string; caption?: string }[];
  category: 'ACHIEVEMENTS' | 'INFRASTRUCTURE' | 'ACADEMICS' | 'SPORTS' | 'CAMPUS_LIFE';
  author: { id: string; name: string; role: string };
  publishDate: string; // ISO date
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const memoryNewsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Academy Students Win International Robotics Gold Medal',
    slug: 'academy-students-win-international-robotics-gold-medal',
    summary: 'Our STEM team placed 1st among 45 competing international schools in Tokyo.',
    content: 'The Education Space Academy robotics team has achieved historic success at the World VEX Robotics Championship in Tokyo. Competing against 45 international schools, our Grade 11 STEM students secured the Gold Medal in autonomous obstacle navigation.',
    featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600', caption: 'Robotics Team receiving award in Tokyo' },
      { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', caption: 'Autonomous rover showcase' }
    ],
    category: 'ACHIEVEMENTS',
    author: { id: 'admin-1', name: 'Dr. Arthur Pendelton', role: 'Principal' },
    publishDate: '2026-08-15T00:00:00.000Z',
    seoTitle: 'Robotics Gold Medal | The Education Space Academy',
    seoDescription: 'Academy STEM robotics team wins 1st place in Tokyo World VEX Championship 2026.',
    status: 'PUBLISHED',
    createdAt: new Date('2026-08-15'),
    updatedAt: new Date('2026-08-15')
  },
  {
    id: 'news-2',
    title: 'New AI & Supercomputing Lab Inaugurated',
    slug: 'new-ai-and-supercomputing-lab-inaugurated',
    summary: 'State-of-the-art supercomputing workstations installed for Grade 11 & 12 Computer Science students.',
    content: 'To support advanced artificial intelligence and data science coursework, the academy has launched a dedicated AI Supercomputing Hub equipped with NVIDIA workstations and 3D prototyping suites.',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', caption: 'Supercomputing Workstations' }
    ],
    category: 'INFRASTRUCTURE',
    author: { id: 'admin-2', name: 'Eleanor Vance', role: 'Head of CS' },
    publishDate: '2026-08-01T00:00:00.000Z',
    seoTitle: 'AI Supercomputing Lab Inauguration | Academy CS Dept',
    seoDescription: 'New AI research hub opened for higher secondary computer science students.',
    status: 'PUBLISHED',
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date('2026-08-01')
  }
];

export class NewsRepository {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private evaluateAutoSchedule(article: NewsArticle): NewsArticle {
    const now = new Date();
    if (article.status === 'SCHEDULED' && new Date(article.publishDate) <= now) {
      article.status = 'PUBLISHED';
    }
    return article;
  }

  // Public GET: List published news articles with category filter and search query
  public async getPublicNews(params?: { category?: string; query?: string; page?: number; limit?: number }) {
    let items = memoryNewsArticles.map(art => this.evaluateAutoSchedule(art));

    const now = new Date();
    items = items.filter(art => art.status === 'PUBLISHED' && new Date(art.publishDate) <= now);

    if (params?.category && params.category !== 'ALL') {
      items = items.filter(art => art.category.toUpperCase() === params.category!.toUpperCase());
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      items = items.filter(art =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q)
      );
    }

    return items;
  }

  public async getLatestNews(limit: number = 3) {
    const publicItems = await this.getPublicNews();
    return publicItems.slice(0, limit);
  }

  public async getNewsBySlug(slug: string) {
    const article = memoryNewsArticles.find(a => a.slug === slug);
    if (!article) throw new NotFoundError(`News article with slug '${slug}' not found.`);
    return this.evaluateAutoSchedule(article);
  }

  public async getRelatedNews(id: string, limit: number = 3) {
    const target = memoryNewsArticles.find(a => a.id === id);
    if (!target) return [];

    const publicItems = await this.getPublicNews();
    return publicItems
      .filter(a => a.id !== id && a.category === target.category)
      .slice(0, limit);
  }

  // Admin GET: List all news articles regardless of status
  public async listAdminNews(status?: string, category?: string) {
    let items = memoryNewsArticles.map(art => this.evaluateAutoSchedule(art));

    if (status && status !== 'ALL') {
      items = items.filter(art => art.status === status);
    }
    if (category && category !== 'ALL') {
      items = items.filter(art => art.category === category);
    }

    return items;
  }

  public async createNewsArticle(data: {
    title: string;
    summary: string;
    content: string;
    featuredImage?: string;
    gallery?: { url: string; caption?: string }[];
    category: 'ACHIEVEMENTS' | 'INFRASTRUCTURE' | 'ACADEMICS' | 'SPORTS' | 'CAMPUS_LIFE';
    author: { id: string; name: string; role: string };
    publishDate?: string;
    seoTitle?: string;
    seoDescription?: string;
    status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  }) {
    if (!data.title || !data.summary || !data.content || !data.category) {
      throw new BadRequestError('Title, summary, content, and category are required.');
    }

    const slug = this.generateSlug(data.title);
    const publishDate = data.publishDate || new Date().toISOString();

    let initialStatus = data.status || 'DRAFT';
    if (initialStatus === 'PUBLISHED' && new Date(publishDate) > new Date()) {
      initialStatus = 'SCHEDULED';
    }

    const article: NewsArticle = {
      id: `news-${Date.now()}`,
      title: data.title,
      slug,
      summary: data.summary,
      content: data.content,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
      gallery: data.gallery || [],
      category: data.category,
      author: data.author,
      publishDate,
      seoTitle: data.seoTitle || `${data.title} | The Education Space Academy`,
      seoDescription: data.seoDescription || data.summary,
      status: initialStatus,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryNewsArticles.unshift(article);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'CREATE_NEWS_ARTICLE',
          module: 'NEWS',
          details: `Created news article '${article.title}' in status '${article.status}'`
        }
      });
    } catch (e) {}

    return article;
  }

  public async updateNewsArticle(id: string, data: Partial<NewsArticle>, userId?: string) {
    const article = memoryNewsArticles.find(a => a.id === id);
    if (!article) throw new NotFoundError('News article not found.');

    if (data.title) {
      article.title = data.title;
      article.slug = this.generateSlug(data.title);
    }
    if (data.summary) article.summary = data.summary;
    if (data.content) article.content = data.content;
    if (data.featuredImage) article.featuredImage = data.featuredImage;
    if (data.gallery !== undefined) article.gallery = data.gallery;
    if (data.category) article.category = data.category;
    if (data.publishDate) article.publishDate = data.publishDate;
    if (data.seoTitle !== undefined) article.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) article.seoDescription = data.seoDescription;
    article.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'UPDATE_NEWS_ARTICLE',
          module: 'NEWS',
          details: `Updated news article '${article.title}'`
        }
      });
    } catch (e) {}

    return article;
  }

  public async updateNewsStatus(id: string, status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED', userId?: string) {
    const article = memoryNewsArticles.find(a => a.id === id);
    if (!article) throw new NotFoundError('News article not found.');

    const oldStatus = article.status;
    article.status = status;
    article.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_NEWS_STATUS',
          module: 'NEWS',
          details: `Transitioned news article '${article.title}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return article;
  }

  public async deleteNewsArticle(id: string, userId?: string) {
    const idx = memoryNewsArticles.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundError('News article not found.');

    const deleted = memoryNewsArticles.splice(idx, 1)[0];

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'DELETE_NEWS_ARTICLE',
          module: 'NEWS',
          details: `Deleted news article '${deleted.title}' (ID: ${deleted.id})`
        }
      });
    } catch (e) {}

    return { success: true, deletedId: id };
  }
}

import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';
import { AnnouncementsRepository } from './announcementsRepository.js';
import { NewsRepository } from './newsRepository.js';
import { GalleryRepository } from './galleryRepository.js';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  status: 'DRAFT' | 'PUBLISHED';
  sortOrder: number;
}

export interface HomepageConfig {
  sectionOrder: string[]; // e.g. ['hero', 'welcome', 'principal', 'stats', 'programs', 'announcements', 'news', 'events', 'gallery', 'cta', 'contact']
  heroBanners: HeroBanner[];
  welcomeMessage: {
    title: string;
    subtitle: string;
    body: string;
    imageUrl: string;
    status: 'DRAFT' | 'PUBLISHED';
  };
  principalMessage: {
    name: string;
    designation: string;
    quote: string;
    body: string;
    imageUrl: string;
    status: 'DRAFT' | 'PUBLISHED';
  };
  statistics: { count: string; label: string; sortOrder: number }[];
  featuredPrograms: { id: string; title: string; level: string; description: string; imageUrl: string }[];
  upcomingEvents: { id: string; title: string; eventDate: string; location: string; imageUrl: string; status: 'DRAFT' | 'PUBLISHED' }[];
  callToAction: {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    status: 'DRAFT' | 'PUBLISHED';
  };
  contactSummary: {
    institutionName: string;
    address: string;
    phone: string;
    email: string;
  };
}

let memoryHomepageConfig: HomepageConfig = {
  sectionOrder: ['hero', 'welcome', 'principal', 'stats', 'programs', 'announcements', 'news', 'events', 'gallery', 'cta', 'contact'],
  heroBanners: [
    {
      id: 'hb-1',
      title: 'Empowering Next-Generation Innovators & Leaders',
      subtitle: 'World-Class Cambridge Curriculum, Supercomputing AI Hubs & STEM Excellence',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600',
      ctaText: 'Apply Online Now',
      ctaLink: 'apply-online',
      status: 'PUBLISHED',
      sortOrder: 1
    }
  ],
  welcomeMessage: {
    title: 'Welcome to The Education Space Academy',
    subtitle: 'Nurturing Academic Mastery, Character & Global Competitiveness',
    body: 'For over two decades, The Education Space Academy has stood as a beacon of educational distinction, combining rigorous academic standards with state-of-the-art technological infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
    status: 'PUBLISHED'
  },
  principalMessage: {
    name: 'Dr. Arthur Pendelton',
    designation: 'Principal & Director of Academics',
    quote: 'Education is not the learning of facts, but the training of the mind to think.',
    body: 'Welcome to our vibrant academic community. We invite students to embrace intellectual curiosity, scientific discovery, and ethical leadership.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
    status: 'PUBLISHED'
  },
  statistics: [
    { count: '2,400+', label: 'Enrolled Students', sortOrder: 1 },
    { count: '99.4%', label: 'A-Level Pass Rate', sortOrder: 2 },
    { count: '45+', label: 'STEM & VEX Gold Medals', sortOrder: 3 },
    { count: '100%', label: 'University Placement', sortOrder: 4 }
  ],
  featuredPrograms: [
    {
      id: 'prog-1',
      title: 'A-Level Pre-Engineering & AI Robotics',
      level: 'Higher Secondary (Grade 11-12)',
      description: 'Advanced Cambridge A-Levels integrated with hands-on supercomputing lab coursework.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
    },
    {
      id: 'prog-2',
      title: 'Cambridge O-Level Secondary Stream',
      level: 'Secondary (Grade 9-10)',
      description: 'Comprehensive secondary education emphasizing analytical reasoning and scientific inquiry.',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600'
    }
  ],
  upcomingEvents: [
    {
      id: 'evt-1',
      title: 'Annual STEM & Robotics Exhibition 2026',
      eventDate: '2026-09-15T09:00:00.000Z',
      location: 'Main Auditorium, Islamabad',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
      status: 'PUBLISHED'
    }
  ],
  callToAction: {
    title: 'Admissions Open for Session 2026-2027',
    subtitle: 'Secure your place in Pakistan’s premier academic and AI supercomputing academy.',
    primaryButtonText: 'Submit Online Application',
    primaryButtonLink: 'apply-online',
    secondaryButtonText: 'Download Prospectus',
    secondaryButtonLink: 'downloads',
    status: 'PUBLISHED'
  },
  contactSummary: {
    institutionName: 'The Education Space Academy',
    address: 'Plot 45, Sector H-8/4, Education Complex, Islamabad, Pakistan',
    phone: '+92 51 111 222 333',
    email: 'admissions@educationspace.edu'
  }
};

export class HomepageRepository {
  private announcementsRepo = new AnnouncementsRepository();
  private newsRepo = new NewsRepository();
  private galleryRepo = new GalleryRepository();

  // Public Homepage: Dynamically Aggregates Live Published CMS Content in Exact sectionOrder
  public async getPublicHomepage() {
    const liveAnnouncements = await this.announcementsRepo.getFeaturedAnnouncements(3);
    const liveNews = await this.newsRepo.getLatestNews(3);
    const liveGalleryAlbums = await this.galleryRepo.getPublicAlbums();

    const publishedBanners = memoryHomepageConfig.heroBanners
      .filter(b => b.status === 'PUBLISHED')
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const publishedEvents = memoryHomepageConfig.upcomingEvents
      .filter(e => e.status === 'PUBLISHED');

    return {
      sectionOrder: memoryHomepageConfig.sectionOrder,
      heroBanners: publishedBanners,
      welcomeMessage: memoryHomepageConfig.welcomeMessage.status === 'PUBLISHED' ? memoryHomepageConfig.welcomeMessage : null,
      principalMessage: memoryHomepageConfig.principalMessage.status === 'PUBLISHED' ? memoryHomepageConfig.principalMessage : null,
      statistics: memoryHomepageConfig.statistics.sort((a, b) => a.sortOrder - b.sortOrder),
      featuredPrograms: memoryHomepageConfig.featuredPrograms,
      latestAnnouncements: liveAnnouncements,
      latestNews: liveNews,
      upcomingEvents: publishedEvents,
      featuredGalleryAlbums: liveGalleryAlbums.slice(0, 3),
      callToAction: memoryHomepageConfig.callToAction.status === 'PUBLISHED' ? memoryHomepageConfig.callToAction : null,
      contactSummary: memoryHomepageConfig.contactSummary
    };
  }

  // Admin GET Full Homepage Config
  public async getAdminHomepage() {
    return memoryHomepageConfig;
  }

  // Admin UPDATE Homepage Config & Section Orders
  public async updateAdminHomepage(data: Partial<HomepageConfig>, userId?: string) {
    if (data.sectionOrder) {
      memoryHomepageConfig.sectionOrder = data.sectionOrder;
    }
    if (data.heroBanners) {
      memoryHomepageConfig.heroBanners = data.heroBanners;
    }
    if (data.welcomeMessage) {
      memoryHomepageConfig.welcomeMessage = { ...memoryHomepageConfig.welcomeMessage, ...data.welcomeMessage };
    }
    if (data.principalMessage) {
      memoryHomepageConfig.principalMessage = { ...memoryHomepageConfig.principalMessage, ...data.principalMessage };
    }
    if (data.statistics) {
      memoryHomepageConfig.statistics = data.statistics;
    }
    if (data.featuredPrograms) {
      memoryHomepageConfig.featuredPrograms = data.featuredPrograms;
    }
    if (data.upcomingEvents) {
      memoryHomepageConfig.upcomingEvents = data.upcomingEvents;
    }
    if (data.callToAction) {
      memoryHomepageConfig.callToAction = { ...memoryHomepageConfig.callToAction, ...data.callToAction };
    }
    if (data.contactSummary) {
      memoryHomepageConfig.contactSummary = { ...memoryHomepageConfig.contactSummary, ...data.contactSummary };
    }

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'UPDATE_HOMEPAGE_CONFIG',
          module: 'HOMEPAGE',
          details: `Updated dynamic homepage configuration and section orders`
        }
      });
    } catch (e) {}

    return memoryHomepageConfig;
  }
}

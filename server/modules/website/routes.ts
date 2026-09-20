import { Router } from 'express';
import { WebsiteController } from './controller.js';
import { HomepageController } from './homepageController.js';
import { AnnouncementsController } from './announcementsController.js';
import { NewsController } from './newsController.js';
import { GalleryController } from './galleryController.js';
import { DownloadsFaqController } from './downloadsFaqController.js';
import { ContactCareersController } from './contactCareersController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';
import { hasPermission } from '../../core/middleware/permissionMiddleware.js';

export const websiteRouter = Router();
const controller = new WebsiteController();
const homepageCtrl = new HomepageController();
const announcementsCtrl = new AnnouncementsController();
const newsCtrl = new NewsController();
const galleryCtrl = new GalleryController();
const dlFaqCtrl = new DownloadsFaqController();
const contactCareersCtrl = new ContactCareersController();

websiteRouter.get('/status', (req, res) => res.json({ success: true, module: 'website', initialized: true }));

// Dynamic Public Homepage Endpoint
websiteRouter.get('/home', (req, res, next) => homepageCtrl.getPublicHomepage(req, res, next));

// Public Contact & Careers Endpoints
websiteRouter.get('/contact', (req, res, next) => controller.getContactInfo(req, res, next));
websiteRouter.post('/contact', (req, res, next) => contactCareersCtrl.submitContactMessage(req, res, next));
websiteRouter.get('/careers/vacancies', (req, res, next) => contactCareersCtrl.getPublicVacancies(req, res, next));
websiteRouter.get('/careers/vacancies/:id', (req, res, next) => contactCareersCtrl.getVacancyById(req, res, next));
websiteRouter.post('/careers/vacancies/:id/apply', (req, res, next) => contactCareersCtrl.submitJobApplication(req, res, next));

// Public Downloads & FAQs Endpoints
websiteRouter.get('/downloads', (req, res, next) => dlFaqCtrl.getPublicDownloads(req, res, next));
websiteRouter.post('/downloads/:id/track', (req, res, next) => dlFaqCtrl.trackDownload(req, res, next));
websiteRouter.get('/faqs', (req, res, next) => dlFaqCtrl.getPublicFaqs(req, res, next));

// Public Gallery Endpoints
websiteRouter.get('/gallery/albums', (req, res, next) => galleryCtrl.getPublicAlbums(req, res, next));
websiteRouter.get('/gallery/albums/slug/:slug', (req, res, next) => galleryCtrl.getAlbumBySlug(req, res, next));
websiteRouter.get('/gallery/albums/:id/photos', (req, res, next) => galleryCtrl.getAlbumPhotos(req, res, next));

// Public News Endpoints
websiteRouter.get('/news', (req, res, next) => newsCtrl.getPublicNews(req, res, next));
websiteRouter.get('/news/latest', (req, res, next) => newsCtrl.getLatestNews(req, res, next));
websiteRouter.get('/news/slug/:slug', (req, res, next) => newsCtrl.getNewsBySlug(req, res, next));
websiteRouter.get('/news/:id/related', (req, res, next) => newsCtrl.getRelatedNews(req, res, next));

// Public Announcements Endpoints
websiteRouter.get('/announcements', (req, res, next) => announcementsCtrl.getPublicAnnouncements(req, res, next));
websiteRouter.get('/announcements/featured', (req, res, next) => announcementsCtrl.getFeaturedAnnouncements(req, res, next));
websiteRouter.get('/announcements/slug/:slug', (req, res, next) => announcementsCtrl.getAnnouncementBySlug(req, res, next));

// Public Website Page Content Endpoints (Strictly return PUBLISHED content)
websiteRouter.get('/about', (req, res, next) => controller.getAbout(req, res, next));
websiteRouter.get('/principal-message', (req, res, next) => controller.getPrincipalMessage(req, res, next));
websiteRouter.get('/academics', (req, res, next) => controller.getAcademics(req, res, next));
websiteRouter.get('/programs', (req, res, next) => controller.getPrograms(req, res, next));
websiteRouter.get('/classes', (req, res, next) => controller.getClasses(req, res, next));
websiteRouter.get('/faculty-staff', (req, res, next) => controller.getFacultyStaff(req, res, next));
websiteRouter.get('/admissions-info', (req, res, next) => controller.getAdmissionsInfo(req, res, next));
websiteRouter.get('/fee-structure', (req, res, next) => controller.getFeeStructure(req, res, next));
websiteRouter.get('/events', (req, res, next) => controller.getEvents(req, res, next));
websiteRouter.get('/gallery', (req, res, next) => controller.getGallery(req, res, next));
websiteRouter.get('/careers', (req, res, next) => controller.getCareers(req, res, next));
websiteRouter.get('/contact-info', (req, res, next) => controller.getContactInfo(req, res, next));

websiteRouter.post('/apply-online', (req, res, next) => controller.submitOnlineApplication(req, res, next));

// Admin Homepage Endpoints (Permission-Guarded: website.manage)
websiteRouter.get('/admin/homepage', authenticate, hasPermission('website.manage'), (req, res, next) =>
  homepageCtrl.getAdminHomepage(req, res, next)
);

websiteRouter.put('/admin/homepage', authenticate, hasPermission('website.manage'), (req, res, next) =>
  homepageCtrl.updateAdminHomepage(req, res, next)
);

// Admin Contact Inbox & Careers Endpoints (Permission-Guarded: website.manage)
websiteRouter.get('/admin/contact-messages', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.listContactMessages(req, res, next)
);

websiteRouter.patch('/admin/contact-messages/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.updateContactStatus(req, res, next)
);

websiteRouter.post('/admin/contact-messages/:id/reply', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.replyContactMessage(req, res, next)
);

websiteRouter.get('/admin/careers/vacancies', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.listAdminVacancies(req, res, next)
);

websiteRouter.post('/admin/careers/vacancies', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.createVacancy(req, res, next)
);

websiteRouter.patch('/admin/careers/vacancies/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.updateVacancyStatus(req, res, next)
);

websiteRouter.get('/admin/careers/applications', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.listJobApplications(req, res, next)
);

websiteRouter.patch('/admin/careers/applications/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.updateApplicationStatus(req, res, next)
);

websiteRouter.get('/admin/careers/applications/:id/cv', authenticate, hasPermission('website.manage'), (req, res, next) =>
  contactCareersCtrl.downloadProtectedCv(req, res, next)
);

// Admin Downloads & FAQs Endpoints
websiteRouter.get('/admin/downloads', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.listAdminDownloads(req, res, next)
);

websiteRouter.post('/admin/downloads', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.createDownload(req, res, next)
);

websiteRouter.patch('/admin/downloads/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.updateDownloadStatus(req, res, next)
);

websiteRouter.delete('/admin/downloads/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.deleteDownload(req, res, next)
);

websiteRouter.get('/admin/faqs', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.listAdminFaqs(req, res, next)
);

websiteRouter.post('/admin/faqs', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.createFaq(req, res, next)
);

websiteRouter.put('/admin/faqs/reorder', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.reorderFaqs(req, res, next)
);

websiteRouter.put('/admin/faqs/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.updateFaq(req, res, next)
);

websiteRouter.patch('/admin/faqs/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.updateFaqStatus(req, res, next)
);

websiteRouter.delete('/admin/faqs/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  dlFaqCtrl.deleteFaq(req, res, next)
);

// Admin Gallery Endpoints
websiteRouter.get('/admin/gallery/albums', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.listAdminAlbums(req, res, next)
);

websiteRouter.post('/admin/gallery/albums', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.createAlbum(req, res, next)
);

websiteRouter.patch('/admin/gallery/albums/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.updateAlbumStatus(req, res, next)
);

websiteRouter.delete('/admin/gallery/albums/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.deleteAlbum(req, res, next)
);

websiteRouter.post('/admin/gallery/albums/:id/photos', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.addPhotosToAlbum(req, res, next)
);

websiteRouter.put('/admin/gallery/albums/:id/photos/reorder', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.reorderAlbumPhotos(req, res, next)
);

websiteRouter.put('/admin/gallery/photos/:photoId', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.updatePhotoCaption(req, res, next)
);

websiteRouter.delete('/admin/gallery/photos/:photoId', authenticate, hasPermission('website.manage'), (req, res, next) =>
  galleryCtrl.deletePhoto(req, res, next)
);

// Admin Panel News Management Endpoints
websiteRouter.get('/admin/news', authenticate, hasPermission('website.manage'), (req, res, next) =>
  newsCtrl.listAdminNews(req, res, next)
);

websiteRouter.post('/admin/news', authenticate, hasPermission('website.manage'), (req, res, next) =>
  newsCtrl.createNewsArticle(req, res, next)
);

websiteRouter.put('/admin/news/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  newsCtrl.updateNewsArticle(req, res, next)
);

websiteRouter.patch('/admin/news/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  newsCtrl.updateNewsStatus(req, res, next)
);

websiteRouter.delete('/admin/news/:id', authenticate, hasPermission('website.delete'), (req, res, next) =>
  newsCtrl.deleteNewsArticle(req, res, next)
);

// Admin Panel Announcements Endpoints
websiteRouter.get('/admin/announcements', authenticate, hasPermission('website.manage'), (req, res, next) =>
  announcementsCtrl.listAdminAnnouncements(req, res, next)
);

websiteRouter.post('/admin/announcements', authenticate, hasPermission('website.manage'), (req, res, next) =>
  announcementsCtrl.createAnnouncement(req, res, next)
);

websiteRouter.put('/admin/announcements/:id', authenticate, hasPermission('website.manage'), (req, res, next) =>
  announcementsCtrl.updateAnnouncement(req, res, next)
);

websiteRouter.patch('/admin/announcements/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  announcementsCtrl.updateAnnouncementStatus(req, res, next)
);

websiteRouter.get('/admin/content', authenticate, hasPermission('website.manage'), (req, res, next) =>
  controller.listAdminContent(req, res, next)
);

websiteRouter.post('/admin/content', authenticate, hasPermission('website.manage'), (req, res, next) =>
  controller.createAdminContent(req, res, next)
);

websiteRouter.patch('/admin/content/:id/status', authenticate, hasPermission('website.manage'), (req, res, next) =>
  controller.updateAdminContentStatus(req, res, next)
);

websiteRouter.put('/admin/settings', authenticate, hasPermission('website.manage'), (req, res, next) =>
  controller.updateWebsiteSettings(req, res, next)
);

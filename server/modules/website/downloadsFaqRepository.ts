import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export type DownloadCategory = 
  | 'PROSPECTUS'
  | 'ADMISSION_FORMS'
  | 'FEE_SCHEDULES'
  | 'EXAM_SCHEDULES'
  | 'POLICIES'
  | 'NOTICES'
  | 'OTHER';

export interface PublicDownload {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  fileUrl: string;
  fileType: string; // e.g. 'PDF', 'DOCX', 'XLSX', 'ZIP'
  fileSize: string; // e.g. '2.4 MB'
  publishDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type FaqCategory = 
  | 'ADMISSIONS'
  | 'ACADEMICS'
  | 'FEES'
  | 'EXAMINATIONS'
  | 'CAMPUS_RULES'
  | 'GENERAL';

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sortOrder: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const memoryDownloads: PublicDownload[] = [
  {
    id: 'dl-1',
    title: 'Academy Information Prospectus 2026-2027',
    description: 'Comprehensive guide covering academic curriculum, campus facilities, and admission guidelines.',
    category: 'PROSPECTUS',
    fileUrl: '/downloads/prospectus-2026.pdf',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    publishDate: '2026-01-10T00:00:00.000Z',
    status: 'PUBLISHED',
    downloadCount: 142,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10')
  },
  {
    id: 'dl-2',
    title: 'Annual Fee Schedule & Payment Policy 2026',
    description: 'Breakdown of tuition fees, lab charges, installment plans, and scholarship terms.',
    category: 'FEE_SCHEDULES',
    fileUrl: '/downloads/fee-schedule-2026.pdf',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    publishDate: '2026-01-15T00:00:00.000Z',
    status: 'PUBLISHED',
    downloadCount: 98,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15')
  }
];

const memoryFaqs: PublicFaq[] = [
  {
    id: 'faq-1',
    question: 'What are the criteria for admission into Grade 9 and Grade 11 STEM streams?',
    answer: 'Admissions for Grade 9 and 11 STEM streams require passing the Academy Entrance Evaluation in Mathematics and Science, followed by an interview with the academic department head.',
    category: 'ADMISSIONS',
    sortOrder: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  },
  {
    id: 'faq-2',
    question: 'Are installment plans available for annual tuition fees?',
    answer: 'Yes, tuition fees can be paid in monthly, term-wise (quarterly), or annual installments. Custom payment structures can be requested through the Finance Desk.',
    category: 'FEES',
    sortOrder: 2,
    status: 'PUBLISHED',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  }
];

export class DownloadsFaqRepository {
  private ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.zip'];

  // Secure File Validator
  public validateFileExtension(fileUrl: string): { isValid: boolean; ext: string } {
    const extMatch = fileUrl.match(/\.([a-zA-Z0-9]+)$/);
    if (!extMatch) return { isValid: false, ext: '' };
    const ext = `.${extMatch[1].toLowerCase()}`;
    return { isValid: this.ALLOWED_EXTENSIONS.includes(ext), ext };
  }

  // Public GET Downloads
  public async getPublicDownloads(category?: string, query?: string) {
    let items = memoryDownloads.filter(d => d.status === 'PUBLISHED');

    if (category && category !== 'ALL') {
      items = items.filter(d => d.category.toUpperCase() === category.toUpperCase());
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    return items;
  }

  public async trackDownload(id: string) {
    const doc = memoryDownloads.find(d => d.id === id);
    if (!doc) throw new NotFoundError('Download document not found.');
    doc.downloadCount += 1;
    return { success: true, downloadCount: doc.downloadCount };
  }

  // Public GET FAQs
  public async getPublicFaqs(category?: string, query?: string) {
    let items = memoryFaqs
      .filter(f => f.status === 'PUBLISHED')
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (category && category !== 'ALL') {
      items = items.filter(f => f.category.toUpperCase() === category.toUpperCase());
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }

  // Admin GET Downloads
  public async listAdminDownloads(status?: string, category?: string) {
    let items = memoryDownloads;
    if (status && status !== 'ALL') items = items.filter(d => d.status === status);
    if (category && category !== 'ALL') items = items.filter(d => d.category === category);
    return items;
  }

  public async createDownload(data: {
    title: string;
    description: string;
    category: DownloadCategory;
    fileUrl: string;
    fileType?: string;
    fileSize?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    userId?: string;
  }) {
    if (!data.title || !data.category || !data.fileUrl) {
      throw new BadRequestError('Title, category, and file URL are required.');
    }

    const val = this.validateFileExtension(data.fileUrl);
    if (!val.isValid) {
      throw new BadRequestError(`Invalid file extension. Allowed extensions: ${this.ALLOWED_EXTENSIONS.join(', ')}`);
    }

    const doc: PublicDownload = {
      id: `dl-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      category: data.category,
      fileUrl: data.fileUrl,
      fileType: data.fileType || val.ext.replace('.', '').toUpperCase(),
      fileSize: data.fileSize || '2.0 MB',
      publishDate: new Date().toISOString(),
      status: data.status || 'DRAFT',
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryDownloads.unshift(doc);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'UPLOAD_PUBLIC_DOCUMENT',
          module: 'DOWNLOADS',
          details: `Uploaded document '${doc.title}' in category '${doc.category}'`
        }
      });
    } catch (e) {}

    return doc;
  }

  public async updateDownloadStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', userId?: string) {
    const doc = memoryDownloads.find(d => d.id === id);
    if (!doc) throw new NotFoundError('Download document not found.');

    const oldStatus = doc.status;
    doc.status = status;
    doc.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_DOWNLOAD_STATUS',
          module: 'DOWNLOADS',
          details: `Transitioned document '${doc.title}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return doc;
  }

  public async deleteDownload(id: string, userId?: string) {
    const idx = memoryDownloads.findIndex(d => d.id === id);
    if (idx === -1) throw new NotFoundError('Download document not found.');

    const deleted = memoryDownloads.splice(idx, 1)[0];

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'DELETE_PUBLIC_DOCUMENT',
          module: 'DOWNLOADS',
          details: `Deleted document '${deleted.title}' (ID: ${deleted.id})`
        }
      });
    } catch (e) {}

    return { success: true, deletedId: id };
  }

  // Admin GET FAQs
  public async listAdminFaqs(status?: string, category?: string) {
    let items = memoryFaqs.sort((a, b) => a.sortOrder - b.sortOrder);
    if (status && status !== 'ALL') items = items.filter(f => f.status === status);
    if (category && category !== 'ALL') items = items.filter(f => f.category === category);
    return items;
  }

  public async createFaq(data: {
    question: string;
    answer: string;
    category: FaqCategory;
    sortOrder?: number;
    status?: 'DRAFT' | 'PUBLISHED';
    userId?: string;
  }) {
    if (!data.question || !data.answer || !data.category) {
      throw new BadRequestError('Question, answer, and category are required.');
    }

    const nextOrder = data.sortOrder || (memoryFaqs.length + 1);
    const faq: PublicFaq = {
      id: `faq-${Date.now()}`,
      question: data.question,
      answer: data.answer,
      category: data.category,
      sortOrder: nextOrder,
      status: data.status || 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryFaqs.push(faq);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'CREATE_FAQ',
          module: 'FAQS',
          details: `Created FAQ '${faq.question.slice(0, 40)}...' in category '${faq.category}'`
        }
      });
    } catch (e) {}

    return faq;
  }

  public async updateFaq(id: string, data: Partial<PublicFaq>, userId?: string) {
    const faq = memoryFaqs.find(f => f.id === id);
    if (!faq) throw new NotFoundError('FAQ item not found.');

    if (data.question) faq.question = data.question;
    if (data.answer) faq.answer = data.answer;
    if (data.category) faq.category = data.category;
    if (data.sortOrder !== undefined) faq.sortOrder = data.sortOrder;
    faq.updatedAt = new Date();

    return faq;
  }

  public async updateFaqStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', userId?: string) {
    const faq = memoryFaqs.find(f => f.id === id);
    if (!faq) throw new NotFoundError('FAQ item not found.');

    const oldStatus = faq.status;
    faq.status = status;
    faq.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_FAQ_STATUS',
          module: 'FAQS',
          details: `Transitioned FAQ '${faq.id}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return faq;
  }

  public async reorderFaqs(faqOrders: { id: string; sortOrder: number }[], userId?: string) {
    for (const item of faqOrders) {
      const faq = memoryFaqs.find(f => f.id === item.id);
      if (faq) faq.sortOrder = item.sortOrder;
    }
    return memoryFaqs.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async deleteFaq(id: string, userId?: string) {
    const idx = memoryFaqs.findIndex(f => f.id === id);
    if (idx === -1) throw new NotFoundError('FAQ item not found.');

    const deleted = memoryFaqs.splice(idx, 1)[0];

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'DELETE_FAQ',
          module: 'FAQS',
          details: `Deleted FAQ '${deleted.id}'`
        }
      });
    } catch (e) {}

    return { success: true, deletedId: id };
  }
}

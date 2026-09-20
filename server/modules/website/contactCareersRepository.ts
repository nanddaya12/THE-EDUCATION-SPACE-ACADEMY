import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'SPAM' | 'ARCHIVED';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobVacancy {
  id: string;
  jobTitle: string;
  department: string; // e.g. 'ACADEMICS', 'ADMINISTRATION', 'STEM_LABS', 'SPORTS'
  description: string;
  requirements: string[];
  deadline: string; // ISO date
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  vacancyId: string;
  applicantName: string;
  email: string;
  phone: string;
  experienceYears: number;
  coverLetter: string;
  cvFileUrl: string; // Protected CV document URL
  status: 'SUBMITTED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  createdAt: Date;
  updatedAt: Date;
}

const memoryContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    phone: '+92 300 9876543',
    subject: 'Admission Inquiry for Grade 11 STEM Stream',
    message: 'Hello, I would like to schedule a campus tour and obtain information regarding the A-Level STEM entrance test.',
    status: 'UNREAD',
    createdAt: new Date('2026-08-18'),
    updatedAt: new Date('2026-08-18')
  },
  {
    id: 'msg-2',
    name: 'David Miller',
    email: 'dmiller@company.com',
    phone: '+92 321 5554433',
    subject: 'Corporate Sponsorship for Robotics Expo',
    message: 'We are interested in sponsoring the upcoming 2026 National STEM Competition.',
    status: 'READ',
    createdAt: new Date('2026-08-15'),
    updatedAt: new Date('2026-08-16')
  }
];

const memoryVacancies: JobVacancy[] = [
  {
    id: 'vac-1',
    jobTitle: 'Senior Physics & Robotics Educator',
    department: 'ACADEMICS',
    description: 'We are seeking an experienced Physics educator to lead higher secondary A-Level Physics and coach the academy VEX robotics team.',
    requirements: [
      'Master degree in Physics, Electrical Engineering, or Mechatronics',
      'Minimum 4 years teaching experience in Cambridge A-Levels',
      'Hands-on expertise with microcontroller programming & robotics'
    ],
    deadline: '2026-09-30T00:00:00.000Z',
    employmentType: 'FULL_TIME',
    location: 'TES Academy, Qasimabad, Hyderabad',
    status: 'PUBLISHED',
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date('2026-08-01')
  },
  {
    id: 'vac-2',
    jobTitle: 'AI Supercomputing Lab Specialist',
    department: 'STEM_LABS',
    description: 'Manage HPC cluster infrastructure and assist Grade 11/12 Computer Science students with AI/ML projects.',
    requirements: [
      'BS/MS in Computer Science or Artificial Intelligence',
      'Proficiency in Linux administration, Python, PyTorch/TensorFlow'
    ],
    deadline: '2026-10-15T00:00:00.000Z',
    employmentType: 'FULL_TIME',
    location: 'TES Academy, Qasimabad, Hyderabad',
    status: 'PUBLISHED',
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-10')
  }
];

const memoryApplications: JobApplication[] = [
  {
    id: 'app-1',
    vacancyId: 'vac-1',
    applicantName: 'Dr. Robert Harrison',
    email: 'rharrison@university.edu',
    phone: '+92 333 1122334',
    experienceYears: 6,
    coverLetter: 'I am excited to apply for the Senior Physics & Robotics Educator position. I have 6 years experience mentoring robotics teams.',
    cvFileUrl: '/protected-cvs/cv-robert-harrison-2026.pdf',
    status: 'SUBMITTED',
    createdAt: new Date('2026-08-12'),
    updatedAt: new Date('2026-08-12')
  }
];

export class ContactCareersRepository {
  // Public Contact Submission
  public async submitContactMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    if (!data.name || !data.email || !data.message) {
      throw new BadRequestError('Name, email, and message are required.');
    }

    const msg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'UNREAD',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryContactMessages.unshift(msg);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'SUBMIT_CONTACT_MESSAGE',
          module: 'CONTACT',
          details: `Public contact message received from '${msg.name}' (${msg.email})`
        }
      });
    } catch (e) {}

    return { ...msg, ticketNo: msg.id };
  }

  // Admin List Contact Messages
  public async listContactMessages(status?: string) {
    let items = memoryContactMessages;
    if (status && status !== 'ALL') {
      items = items.filter(m => m.status === status);
    }
    return items;
  }

  public async updateContactStatus(id: string, status: 'UNREAD' | 'READ' | 'SPAM' | 'ARCHIVED', userId?: string) {
    const msg = memoryContactMessages.find(m => m.id === id);
    if (!msg) throw new NotFoundError('Contact message not found.');

    const oldStatus = msg.status;
    msg.status = status;
    msg.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'UPDATE_CONTACT_STATUS',
          module: 'CONTACT',
          details: `Updated contact message ID '${id}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return msg;
  }

  public async replyContactMessage(id: string, replyMessage: string, userId?: string) {
    const msg = memoryContactMessages.find(m => m.id === id);
    if (!msg) throw new NotFoundError('Contact message not found.');

    msg.replyMessage = replyMessage;
    msg.repliedAt = new Date().toISOString();
    msg.status = 'REPLIED';
    msg.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'REPLY_CONTACT_MESSAGE',
          module: 'CONTACT',
          details: `Sent reply to contact message ID '${id}' (${msg.email})`
        }
      });
    } catch (e) {}

    return msg;
  }

  // Public Get Vacancies
  public async getPublicVacancies(department?: string) {
    const now = new Date();
    let items = memoryVacancies.filter(v => v.status === 'PUBLISHED' && new Date(v.deadline) >= now);
    if (department && department !== 'ALL') {
      items = items.filter(v => v.department.toUpperCase() === department.toUpperCase());
    }
    return items;
  }

  public async getVacancyById(id: string) {
    const vac = memoryVacancies.find(v => v.id === id);
    if (!vac) throw new NotFoundError('Job vacancy not found.');
    return vac;
  }

  public async submitJobApplication(data: {
    vacancyId: string;
    applicantName: string;
    email: string;
    phone: string;
    experienceYears?: number;
    coverLetter?: string;
    cvFileUrl: string;
  }) {
    const vac = memoryVacancies.find(v => v.id === data.vacancyId);
    if (!vac) throw new NotFoundError('Target job vacancy not found.');

    if (!data.applicantName || !data.email || !data.cvFileUrl) {
      throw new BadRequestError('Applicant name, email, and CV file URL are required.');
    }

    const app: JobApplication = {
      id: `app-${Date.now()}`,
      vacancyId: data.vacancyId,
      applicantName: data.applicantName,
      email: data.email,
      phone: data.phone || '',
      experienceYears: data.experienceYears || 0,
      coverLetter: data.coverLetter || '',
      cvFileUrl: data.cvFileUrl,
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryApplications.unshift(app);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'SUBMIT_JOB_APPLICATION',
          module: 'CAREERS',
          details: `Job application received from '${app.applicantName}' for vacancy '${vac.jobTitle}'`
        }
      });
    } catch (e) {}

    return app;
  }

  // Admin Careers Management
  public async listAdminVacancies(status?: string, department?: string) {
    let items = memoryVacancies;
    if (status && status !== 'ALL') items = items.filter(v => v.status === status);
    if (department && department !== 'ALL') items = items.filter(v => v.department === department);
    return items;
  }

  public async createVacancy(data: {
    jobTitle: string;
    department: string;
    description: string;
    requirements: string[];
    deadline?: string;
    employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
    location?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    userId?: string;
  }) {
    if (!data.jobTitle || !data.department || !data.description) {
      throw new BadRequestError('Job title, department, and description are required.');
    }

    const vac: JobVacancy = {
      id: `vac-${Date.now()}`,
      jobTitle: data.jobTitle,
      department: data.department,
      description: data.description,
      requirements: data.requirements || [],
      deadline: data.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      employmentType: data.employmentType || 'FULL_TIME',
      location: data.location || 'TES Academy, Qasimabad, Hyderabad',
      status: data.status || 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryVacancies.unshift(vac);

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'POST_JOB_VACANCY',
          module: 'CAREERS',
          details: `Posted job vacancy '${vac.jobTitle}' in department '${vac.department}'`
        }
      });
    } catch (e) {}

    return vac;
  }

  public async updateVacancyStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED', userId?: string) {
    const vac = memoryVacancies.find(v => v.id === id);
    if (!vac) throw new NotFoundError('Job vacancy not found.');

    const oldStatus = vac.status;
    vac.status = status;
    vac.updatedAt = new Date();

    // Audit Logging
    try {
      await db.auditLog.create({
        data: {
          action: 'TRANSITION_VACANCY_STATUS',
          module: 'CAREERS',
          details: `Transitioned vacancy '${vac.jobTitle}' status from '${oldStatus}' to '${status}'`
        }
      });
    } catch (e) {}

    return vac;
  }

  public async listJobApplications(vacancyId?: string) {
    let items = memoryApplications;
    if (vacancyId && vacancyId !== 'ALL') {
      items = items.filter(a => a.vacancyId === vacancyId);
    }
    return items;
  }

  public async updateApplicationStatus(id: string, status: 'SUBMITTED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED', userId?: string) {
    const app = memoryApplications.find(a => a.id === id);
    if (!app) throw new NotFoundError('Job application not found.');

    app.status = status;
    app.updatedAt = new Date();

    return app;
  }

  // Protected CV Document Retrieval
  public async getProtectedCvFile(applicationId: string, userId?: string) {
    const app = memoryApplications.find(a => a.id === applicationId);
    if (!app) throw new NotFoundError('Applicant record not found.');

    // Audit Logging for CV Download Access
    try {
      await db.auditLog.create({
        data: {
          action: 'DOWNLOAD_PROTECTED_CV',
          module: 'CAREERS',
          details: `Authorized HR download of protected CV for applicant '${app.applicantName}' (App ID: ${app.id})`
        }
      });
    } catch (e) {}

    return {
      applicantName: app.applicantName,
      cvFileUrl: app.cvFileUrl,
      fileName: `CV_${app.applicantName.replace(/\s+/g, '_')}.pdf`,
      mimeType: 'application/pdf'
    };
  }
}

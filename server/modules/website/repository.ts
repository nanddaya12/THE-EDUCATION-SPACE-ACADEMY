import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export interface CmsItem {
  id: string;
  module: string; // pages, banners, announcements, news, events, gallery, faculty, programs, admissions, downloads, faqs, careers
  title: string;
  content: any;
  status: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  updatedAt: Date;
}

const memoryCmsItems: CmsItem[] = [
  {
    id: 'cms-news-1',
    module: 'news',
    title: 'Academy Students Win International Robotics Gold Medal',
    status: 'PUBLISHED',
    content: { id: 'news-1', title: 'Academy Students Win International Robotics Gold Medal', date: '2026-08-15', category: 'Achievers', summary: 'Our STEM team placed 1st among 45 competing international schools in Tokyo.' },
    updatedAt: new Date()
  },
  {
    id: 'cms-news-2',
    module: 'news',
    title: 'New AI & Supercomputing Lab Inaugurated',
    status: 'PUBLISHED',
    content: { id: 'news-2', title: 'New AI & Supercomputing Lab Inaugurated', date: '2026-08-01', category: 'Infrastructure', summary: 'State-of-the-art supercomputing workstations installed for Grade 11 & 12 Computer Science students.' },
    updatedAt: new Date()
  },
  {
    id: 'cms-news-draft',
    module: 'news',
    title: 'Draft Article: Upcoming Expansion Campus',
    status: 'DRAFT',
    content: { id: 'news-draft', title: 'Draft Article: Upcoming Expansion Campus', date: '2026-08-20', category: 'Internal', summary: 'Draft plans for expanding to South Campus.' },
    updatedAt: new Date()
  },
  {
    id: 'cms-ann-1',
    module: 'announcements',
    title: 'Winter Uniform Transition Mandatory from Nov 1st',
    status: 'PUBLISHED',
    content: { id: 'ann-1', title: 'Winter Uniform Transition Mandatory from Nov 1st', date: '2026-08-18', targetAudience: 'All Parents & Students' },
    updatedAt: new Date()
  },
  {
    id: 'cms-ev-1',
    module: 'events',
    title: 'Annual Science Fair & Invention Expo',
    status: 'PUBLISHED',
    content: { id: 'ev-101', title: 'Annual Science Fair & Invention Expo', date: '2026-09-20', location: 'Main Multipurpose Hall' },
    updatedAt: new Date()
  }
];

const memoryContactInquiries: any[] = [];
let memoryWebsiteSettings = {
  institutionName: 'TES Academy Qasimabad / The Education Space Academy',
  campusAddress: 'Above Soneri Bank, GMB Colony, Main Road Nasim Nagar to Ali Palace, Qasimabad, Hyderabad 71000, Sindh, Pakistan',
  phone: '0333 2613913',
  email: 'info@tesacademy.edu.pk',
  workingHours: 'Opens 6:30 AM | Monday - Saturday: 06:30 AM - 09:30 PM',
  coordinates: { lat: 25.4055, lng: 68.3341 }
};

export class WebsiteRepository {
  // Public GET endpoints strictly return ONLY PUBLISHED items
  public async getHomePageContent() {
    return {
      hero: {
        title: 'Empowering Minds, Shaping Tomorrow',
        subtitle: 'The Education Space Academy provides world-class STEM education, character building, and academic excellence.',
        ctaText: 'Apply for Admission 2026',
        ctaUrl: 'apply-online',
        secondaryCtaText: 'Explore Academics',
        secondaryCtaUrl: 'academics'
      },
      stats: [
        { label: 'Enrolled Students', count: '1,200+' },
        { label: 'Expert Faculty', count: '85+' },
        { label: 'Campus Size (Acres)', count: '25' },
        { label: 'Pass Rate (A/A* Grade)', count: '98.5%' }
      ],
      principalSnippet: {
        name: 'Dr. Arthur Pendelton',
        title: 'Principal & Academic Director',
        snippet: 'At The Education Space Academy, our mission is to cultivate critical thinkers and compassionate global leaders.',
        imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
      },
      featuredNews: (await this.getNews()),
      upcomingEvents: (await this.getEvents())
    };
  }

  public async getAboutContent() {
    return {
      title: 'About The Education Space Academy',
      mission: 'To provide a transformative educational experience that fosters intellectual curiosity, moral integrity, and social responsibility.',
      vision: 'To be a global benchmark for educational innovation, holistic student development, and academic excellence.',
      history: 'Founded in 1998, The Education Space Academy has grown from a single campus to a premier educational institution serving over 1,200 students.',
      accreditation: ['International Baccalaureate (IB) World School', 'Cambridge Assessment International Education (CAIE)', 'Higher Education Board Certified']
    };
  }

  public async getPrincipalMessage() {
    return {
      name: 'Dr. Arthur Pendelton',
      title: 'Principal & Academic Director',
      credentials: 'Ph.D. in Educational Leadership (Harvard University), M.Sc. Physics (Oxford)',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
      message: `Dear Students, Parents, and Visitors,

Welcome to The Education Space Academy. Education is not merely the acquisition of facts, but the training of the mind to think critically and act compassionately.

Our state-of-the-art facilities, dedicated faculty, and rigorous STEM & Humanities curricula empower every child to unlock their fullest potential. We invite you to join our vibrant learning community.

Warm regards,
Dr. Arthur Pendelton`
    };
  }

  public async getAcademicsContent() {
    return {
      philosophy: 'Holistic Inquiry-Based Learning Framework combining rigorous STEM education with creative arts and physical development.',
      labs: [
        { name: 'Advanced Robotics & AI Lab', description: '3D printers, VEX robotics kits, and IoT workstation pods.' },
        { name: 'Physics & Chemistry Research Labs', description: 'Fume hoods, digital oscilloscopes, and spectrophotometers.' },
        { name: 'Digital Library & Research Hub', description: 'Over 50,000 digital journals and multimedia reference archives.' }
      ]
    };
  }

  public async getPrograms() {
    return [
      { id: 'prog-1', name: 'Early Years & Kindergarten', ageGroup: 'Ages 3 - 5', description: 'Play-based Montessori and EYFS curriculum focusing on sensory development and phonics.' },
      { id: 'prog-2', name: 'Primary School (Grades 1 - 5)', ageGroup: 'Ages 6 - 10', description: 'Core foundational literacy, numeracy, science, arts, and physical education.' },
      { id: 'prog-3', name: 'Secondary School (Grades 6 - 8)', ageGroup: 'Ages 11 - 13', description: 'Middle school curriculum introducing specialized sciences, algebra, and computer science.' },
      { id: 'prog-4', name: 'Higher Secondary & A-Levels (Grades 9 - 12)', ageGroup: 'Ages 14 - 18', description: 'Cambridge IGCSE & A-Levels track in Pre-Medical, Pre-Engineering, and Computer Science.' }
    ];
  }

  public async getClasses() {
    return [
      { grade: 'Grade 9', sections: ['Sec A', 'Sec B', 'Sec C'], medium: 'English Medium', capacity: 30 },
      { grade: 'Grade 10', sections: ['Sec A', 'Sec B'], medium: 'English Medium', capacity: 30 },
      { grade: 'Grade 11 (Pre-Eng / CS)', sections: ['Sec A', 'Sec B'], medium: 'English Medium', capacity: 25 },
      { grade: 'Grade 12 (Pre-Med)', sections: ['Sec A'], medium: 'English Medium', capacity: 25 }
    ];
  }

  public async getFacultyStaff() {
    return [
      { name: 'Eleanor Vance', title: 'Head of Mathematics', department: 'Mathematics & Computer Science', qualification: 'M.Sc. Applied Mathematics', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
      { name: 'Marcus Brody', title: 'Senior Physics Instructor', department: 'Physical Sciences', qualification: 'Ph.D. Theoretical Physics', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
      { name: 'Dr. Sarah Connor', title: 'Head of Chemistry & Biology', department: 'Natural Sciences', qualification: 'Ph.D. Biochemistry', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300' }
    ];
  }

  public async getAdmissionsInfo() {
    return {
      sessionYear: '2026 - 2027',
      eligibility: 'Applicants must meet age criteria and pass the diagnostic assessment in Mathematics and English.',
      procedure: [
        'Step 1: Submit Online Application Form via Website Portal.',
        'Step 2: Attend Diagnostic Assessment & Student Interactive Session.',
        'Step 3: Receive Offer Letter & Complete Document Verification.',
        'Step 4: Deposit Fee Challan & Receive Official Roll Number.'
      ],
      importantDates: [
        { event: 'Online Application Deadline', date: '2026-09-30' },
        { event: 'Diagnostic Entrance Exam', date: '2026-10-10' },
        { event: 'Final Merit List Display', date: '2026-10-20' }
      ]
    };
  }

  public async getFeeStructure() {
    return {
      currency: 'PKR',
      categories: [
        { gradeGroup: 'Primary (Grades 1 - 5)', admissionFee: 25000, monthlyTuition: 12000, labFee: 2000, annualCharges: 10000 },
        { gradeGroup: 'Secondary (Grades 6 - 8)', admissionFee: 30000, monthlyTuition: 15000, labFee: 3000, annualCharges: 12000 },
        { gradeGroup: 'Higher Secondary (Grades 9 - 12)', admissionFee: 35000, monthlyTuition: 18000, labFee: 4000, annualCharges: 15000 }
      ],
      discounts: ['20% Merit Scholarship for top 3 rankers', '15% Sibling Concession on monthly tuition fees']
    };
  }

  // Strict Public Isolation: ONLY items where status === 'PUBLISHED' are returned to public visitors
  public async getNews() {
    return memoryCmsItems
      .filter(item => item.module === 'news' && item.status === 'PUBLISHED')
      .map(item => item.content);
  }

  public async getAnnouncements() {
    return memoryCmsItems
      .filter(item => item.module === 'announcements' && item.status === 'PUBLISHED')
      .map(item => item.content);
  }

  public async getEvents() {
    return memoryCmsItems
      .filter(item => item.module === 'events' && item.status === 'PUBLISHED')
      .map(item => item.content);
  }

  public async getGallery() {
    return [
      { title: 'Annual Sports Gala 2026', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' },
      { title: 'Robotics & STEM Exhibition', category: 'Academics', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500' }
    ];
  }

  public async getDownloads() {
    return [
      { title: 'Official Academy Prospectus 2026-2027', fileType: 'PDF', fileSize: '4.2 MB', downloadUrl: 'https://docs.educationspace.edu/prospectus-2026.pdf' },
      { title: 'Offline Admission Application Form', fileType: 'PDF', fileSize: '1.1 MB', downloadUrl: 'https://docs.educationspace.edu/admission-form.pdf' }
    ];
  }

  public async getFaqs() {
    return [
      { question: 'What is the admission procedure for Grade 9?', answer: 'Submit the online application form, appear for the entrance test in Math & English, and attend the parent interview.' },
      { question: 'Does the academy offer transport facilities?', answer: 'Yes, air-conditioned bus transport is available across 15 major city routes with GPS tracking.' }
    ];
  }

  public async getCareers() {
    return [
      { id: 'job-1', title: 'Senior Physics Lecturer (A-Levels)', department: 'Sciences', type: 'Full-Time', qualification: 'Master / Ph.D. in Physics with 3+ years experience.' }
    ];
  }

  public async getContactInfo() {
    return memoryWebsiteSettings;
  }

  public async submitContactForm(data: { name: string; email: string; phone?: string; message: string }) {
    if (!data.name || !data.email || !data.message) {
      throw new BadRequestError('Name, email, and message are required.');
    }
    const inquiry = { id: `inq-${Date.now()}`, ...data, createdAt: new Date() };
    memoryContactInquiries.unshift(inquiry);
    return {
      success: true,
      ticketNo: inquiry.id,
      message: 'Thank you for reaching out! Our admissions desk will respond within 24 hours.'
    };
  }

  public async submitOnlineApplication(data: any) {
    const applicationKey = `APP-WEB-${Date.now()}`;
    return {
      success: true,
      applicationKey,
      applicantName: data.applicantName,
      grade: data.applyingForGrade,
      message: 'Online Admission Application submitted successfully!'
    };
  }

  // ----------------------------------------------------
  // ADMIN PANEL CMS MANAGEMENT METHODS (Restricted Access)
  // ----------------------------------------------------
  public async listAdminContent(module?: string, status?: string) {
    return memoryCmsItems.filter(item => {
      if (module && item.module !== module) return false;
      if (status && item.status !== status) return false;
      return true;
    });
  }

  public async createAdminContent(data: { module: string; title: string; content: any; status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' }) {
    const item: CmsItem = {
      id: `cms-${data.module}-${Date.now()}`,
      module: data.module,
      title: data.title,
      content: data.content,
      status: data.status || 'DRAFT',
      updatedAt: new Date()
    };
    memoryCmsItems.unshift(item);
    return item;
  }

  public async updateAdminContentStatus(id: string, status: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED') {
    const validStatuses = ['DRAFT', 'PREVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status '${status}'. Allowed: ${validStatuses.join(', ')}`);
    }

    const item = memoryCmsItems.find(i => i.id === id);
    if (!item) throw new NotFoundError('CMS content item not found');

    item.status = status;
    item.updatedAt = new Date();
    return item;
  }

  public async listContactMessages() {
    return memoryContactInquiries;
  }

  public async updateWebsiteSettings(settings: any) {
    memoryWebsiteSettings = { ...memoryWebsiteSettings, ...settings };
    return memoryWebsiteSettings;
  }
}

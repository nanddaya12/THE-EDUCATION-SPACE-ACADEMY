import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';
import { PublicLayout } from '../../components/public/PublicLayout';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Calendar, 
  Download as DownloadIcon, 
  HelpCircle, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  LayoutDashboard,
  Tag,
  ExternalLink,
  FileText,
  Filter,
  Share2,
  Newspaper,
  GraduationCap,
  Building2,
  Trophy,
  ShieldCheck
} from 'lucide-react';

const FALLBACK_NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'TES Academy Scholars Achieve Outstanding Ranks in NUST (NET) & Entry Tests',
    slug: 'tes-academy-scholars-achieve-outstanding-ranks-in-nust-net',
    summary: 'Our coaching batches celebrate historic high percentiles in NUST NET Series and Sindh medical/engineering entrance tests.',
    content: 'The Education Space Academy (TES Academy Qasimabad) celebrates extraordinary success across the recent NUST National Entry Test (NET) series and regional engineering/medical entrance exams. Over 85% of enrolled coaching scholars secured top-percentile marks, gaining admission into NUST Islamabad, MUET Jamshoro, NED Karachi, and top public sector medical colleges.\n\nUnder the direct supervision and diagnostic testing methodology led by Prof. Niaz Dars, students completed over 10,000 past-paper multiple choice questions, daily speed drills, and weekend mock examinations.\n\n"Consistency, conceptual mastery, and disciplined practice in our study library are what set our students apart every year," said Prof. Niaz Dars during the merit distribution ceremony.',
    featuredImage: '/images/tes_students_success.jpg',
    gallery: [
      { url: '/images/tes_students_success.jpg', caption: 'High-achieving TES Academy scholars celebrating admission offers' },
      { url: '/images/tes_smart_classroom.jpg', caption: 'Entry test lecture hall at Qasimabad campus' }
    ],
    category: 'ACHIEVEMENTS',
    author: { id: 'admin-1', name: 'Prof. Niaz Dars', role: 'Director of Academics' },
    publishDate: '2026-08-15T00:00:00.000Z'
  },
  {
    id: 'news-2',
    title: 'Dedicated Air-Conditioned Study Library & Book Bank Inaugurated at Qasimabad Campus',
    slug: 'dedicated-ac-study-library-inaugurated-qasimabad',
    summary: 'State-of-the-art quiet study hall with individual cubicles, high-speed Wi-Fi, and reference textbooks opens daily from 6:30 AM.',
    content: 'To provide Hyderabad students with a distraction-free academic environment, TES Academy has officially expanded its campus facilities with a dedicated Air-Conditioned Study Library and Comprehensive Book Bank above Soneri Bank, Main Road Nasim Nagar.\n\nThe facility features ergonomic individual wooden cubicles, personalized reading lights, air conditioning, and thousands of updated curriculum textbooks for Physics, Chemistry, Mathematics, Biology, and Computer Science.\n\nThe study library remains accessible from 6:30 AM to late evening for enrolled coaching students and registered study library members.',
    featuredImage: '/images/tes_study_library.jpg',
    gallery: [
      { url: '/images/tes_study_library.jpg', caption: 'Quiet study cubicles and reference textbook collection' }
    ],
    category: 'INFRASTRUCTURE',
    author: { id: 'admin-2', name: 'Campus Administration', role: 'TES Academy Hyderabad' },
    publishDate: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'news-3',
    title: 'Admissions Open: Classes IX, X, XI, XII & Grand Entry Test Batches Announced',
    slug: 'admissions-open-classes-9-10-11-12-entry-tests',
    summary: 'Admissions now open for Pre-Engineering, Pre-Medical, ICS, Matriculation, and university entry test prep. Call 0333 2613913.',
    content: 'TES Academy Qasimabad announces open admissions for Session 2026-2027 across all coaching programs: Classes IX and X (Science Group), Classes XI and XII (Pre-Engineering, Pre-Medical, ICS), and crash preparatory courses for NUST NET, MDCAT, ECAT, MUET, and NED.\n\nKey features include experienced master faculty led by Prof. Niaz Dars, daily testing drills, chapter-wise analytical test series, AC classrooms, and hostel facilities for outstation students.\n\nProspective parents and students may visit the campus above Soneri Bank, GMB Colony, Nasim Nagar or contact the helpline at 0333 2613913 / 0342 3738346.',
    featuredImage: '/images/tes_smart_classroom.jpg',
    gallery: [
      { url: '/images/tes_smart_classroom.jpg', caption: 'Multimedia science lecture at TES Academy' },
      { url: '/images/tes_campus_exterior.jpg', caption: 'Main Qasimabad campus building' }
    ],
    category: 'ACADEMICS',
    author: { id: 'admin-3', name: 'Admissions Directorate', role: 'TES Academy Qasimabad' },
    publishDate: '2026-07-28T00:00:00.000Z'
  },
  {
    id: 'news-4',
    title: 'Green Campus & Silent Study Initiative: Library Expansion',
    slug: 'green-campus-silent-study-initiative-library-expansion',
    summary: 'The academy adds 50 individual study carrels and solar-backed power to ensure zero disruption during peak prep months.',
    content: 'As part of our commitment to providing students with an ideal study environment, The Education Space Academy has completed an expansion of its air-conditioned library.\n\nThe facility features dedicated power backup, high-speed academic Wi-Fi, and reference test banks for NUST, MDCAT, and Intermediate syllabi.',
    featuredImage: '/images/tes_study_library.jpg',
    gallery: [
      { url: '/images/tes_study_library.jpg', caption: 'Quiet study library and cubicles' }
    ],
    category: 'INFRASTRUCTURE',
    author: { id: 'admin-4', name: 'Campus Operations', role: 'Administration Wing' },
    publishDate: '2026-07-14T00:00:00.000Z'
  },
  {
    id: 'news-5',
    title: 'National Mathematics & Entry Test Olympiad Top Honours',
    slug: 'national-mathematics-olympiad-top-honours',
    summary: 'TES Academy scholars score top percentiles in NUST NET-1 and provincial mathematics contests.',
    content: 'We are thrilled to announce that our students have achieved top percentile ranks in the National Mathematics and NET-1 test series.\n\nTheir exceptional performance in algebra, calculus, and analytical speed reflects the rigorous daily testing methodology at TES Academy.',
    featuredImage: '/images/tes_smart_classroom.jpg',
    gallery: [],
    category: 'ACHIEVEMENTS',
    author: { id: 'admin-1', name: 'Prof. Niaz Dars', role: 'Director of Academics & Senior Physics' },
    publishDate: '2026-07-02T00:00:00.000Z'
  },
  {
    id: 'news-6',
    title: 'TES Academy Annual Academic Awards & High Achievers Gala 2026',
    slug: 'annual-academic-awards-and-high-achievers-gala-2026',
    summary: 'Scholars and faculty celebrate 100% board pass rates and admissions into NUST, MUET, and Dow Medical.',
    content: 'The academy organized its annual celebration honoring top position holders in SSC and HSC board exams as well as engineering and medical university entrance qualifiers.\n\nDirector Prof. Niaz Dars congratulated students and reiterated the institution\'s commitment to educational excellence in Hyderabad.',
    featuredImage: '/images/tes_students_success.jpg',
    gallery: [],
    category: 'CAMPUS_LIFE',
    author: { id: 'admin-5', name: 'Academic Directorate', role: 'TES Academy' },
    publishDate: '2026-06-20T00:00:00.000Z'
  }
];

const FALLBACK_EVENTS = [
  {
    id: 'ev-1',
    title: 'Fall Open House & Campus Tour 2026',
    eventDate: '2026-10-15T10:00:00.000Z',
    dateDisplay: 'OCT 15',
    time: '10:00 AM - 2:00 PM',
    location: 'Main Auditorium & STEM Labs',
    category: 'Admissions',
    summary: 'Prospective families are invited to explore classrooms, meet faculty, and experience student demo showcases.'
  },
  {
    id: 'ev-2',
    title: 'Annual STEM & Robotics Innovation Expo',
    eventDate: '2026-10-28T09:00:00.000Z',
    dateDisplay: 'OCT 28',
    time: '9:00 AM - 4:00 PM',
    location: 'AI Supercomputing Complex',
    category: 'Competition',
    summary: 'Students showcase autonomous obstacle-navigating rovers, IoT sensors, and software applications.'
  },
  {
    id: 'ev-3',
    title: 'Parent-Teacher Academic Review Symposium',
    eventDate: '2026-11-10T11:00:00.000Z',
    dateDisplay: 'NOV 10',
    time: '11:00 AM - 3:30 PM',
    location: 'Executive Conference Hall',
    category: 'Governance',
    summary: 'Comprehensive mid-term academic progress consultations between parents, counselors, and teachers.'
  },
  {
    id: 'ev-4',
    title: 'Inter-School Model United Nations (TESMUN 2026)',
    eventDate: '2026-11-25T08:30:00.000Z',
    dateDisplay: 'NOV 25',
    time: '8:30 AM - 5:00 PM',
    location: 'Central Lecture Halls',
    category: 'Humanities',
    summary: 'Three days of spirited diplomatic diplomacy and international policy resolution drafting.'
  }
];

const FALLBACK_DOWNLOADS = [
  {
    id: 'dl-1',
    title: 'Academic Prospectus & Curriculum Guide 2026-2027',
    category: 'PROSPECTUS',
    size: '4.8 MB',
    format: 'PDF',
    description: 'Complete overview of Secondary STEM, Cambridge IGCSE, A-Levels, and Humanities course offerings.'
  },
  {
    id: 'dl-2',
    title: 'Official Academic Calendar (2026-2027)',
    category: 'CALENDAR',
    size: '1.2 MB',
    format: 'PDF',
    description: 'Term dates, examination windows, sports festivals, public holidays, and parent conferences.'
  },
  {
    id: 'dl-3',
    title: 'Grade 9 & 10 Secondary STEM Syllabus Matrix',
    category: 'SYLLABUS',
    size: '2.5 MB',
    format: 'PDF',
    description: 'Curriculum breakdown for Robotics, Physics, Chemistry, and Advanced Mathematics.'
  },
  {
    id: 'dl-4',
    title: 'Grade 11 & 12 Humanities & A-Level Syllabi',
    category: 'SYLLABUS',
    size: '2.9 MB',
    format: 'PDF',
    description: 'Comprehensive subject guides for Economics, World Politics, Literature, and Media Studies.'
  },
  {
    id: 'dl-5',
    title: 'Admissions Registration & Scholarship Application Form',
    category: 'ADMISSIONS',
    size: '950 KB',
    format: 'PDF',
    description: 'Printable application package including financial aid questionnaire and document checklist.'
  },
  {
    id: 'dl-6',
    title: 'Campus Code of Conduct & Student Handbook',
    category: 'HANDBOOK',
    size: '1.8 MB',
    format: 'PDF',
    description: 'Institutional policies, laboratory safety rules, uniform guidelines, and attendance criteria.'
  }
];

const FALLBACK_FACULTY = [
  {
    id: 'fac-1',
    name: 'Prof. Niaz Dars',
    role: 'Director of Academics & Senior Physics Faculty',
    dept: 'Executive Leadership & Physics',
    degrees: 'M.Sc. Physics (Distinction), Senior Board Paper & Entry Test Specialist',
    image: '/images/tes_director_portrait.jpg',
    bio: 'Renowned academic mentor leading TES Academy Qasimabad with over 20 years of excellence in physics concept coaching and university test preparation.'
  },
  {
    id: 'fac-2',
    name: 'Engr. Tariq Memon',
    role: 'Head of Mathematics & NUST (NET) Specialist',
    dept: 'Mathematics & Entry Test Wing',
    degrees: 'B.E. Mechatronics, M.Sc. Applied Mathematics',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    bio: 'Specialist in speed-solving shortcuts, calculus, trigonometry, and analytical entry test mathematics for NUST, ECAT, and MUET.'
  },
  {
    id: 'fac-3',
    name: 'Dr. Asma Soomro',
    role: 'Head of Biology & MDCAT Medical Prep Lead',
    dept: 'Life Sciences & Pre-Medical',
    degrees: 'MBBS, M.Phil. Medical Sciences, Certified Medical Instructor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    bio: 'Dedicated medical mentor coaching Pre-Medical Intermediate students to top positions in PMDC MDCAT and Sindh Board examinations.'
  },
  {
    id: 'fac-4',
    name: 'Prof. Farooq Shah',
    role: 'Senior Faculty - Organic & Physical Chemistry',
    dept: 'Chemistry Wing',
    degrees: 'M.Sc. Chemistry (Gold Medalist), Senior HSC Examiner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    bio: 'Over 18 years of classroom experience coaching conceptual chemical kinetics, organic synthesis, and high-scoring board techniques.'
  },
  {
    id: 'fac-5',
    name: 'Sir Zeeshan Ali',
    role: 'Head of Computer Science & ICS Faculty',
    dept: 'Computer Science & IT',
    degrees: 'BS / MS Computer Science (FAST-NUCES)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    bio: 'Guides intermediate ICS students through programming foundations, computer architecture, database concepts, and entry test logic.'
  },
  {
    id: 'fac-6',
    name: 'Ma\'am Rabia Shaikh',
    role: 'Senior Faculty - English & Analytical Reasoning',
    dept: 'Language & Reasoning',
    degrees: 'M.A. English Linguistics, Certified GRE / NET Verbal Adjudicator',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600',
    bio: 'Specialist in advanced English grammar, reading comprehension, and verbal reasoning required for competitive university entrance.'
  }
];

export const PublicWebsite = () => {
  const { addNotification, setCurrentView, switchToPortal, publicSiteConfig } = useApp();

  const [activePage, setActivePage] = useState('home'); 
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  // Dynamic Homepage State
  const [homeData, setHomeData] = useState(null);

  // News & Events State
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsCategory, setNewsCategory] = useState('ALL');
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [newsTab, setNewsTab] = useState('articles'); // 'articles' | 'events'
  const [eventsList, setEventsList] = useState([]);

  // Dynamic public configuration fallback helpers
  const heroCfg = publicSiteConfig?.hero || {
    tagline: 'TES Academy Qasimabad • Hyderabad',
    mainTitle: 'Empowering Minds.',
    accentTitle: 'Shaping Tomorrow.',
    description: 'Under the supervision of Prof. Niaz Dars, TES Academy (The Education Space Academy) is Hyderabad’s premier coaching institute for NUST Entry Test (NET), MDCAT, ECAT, Classes XI & XII, and secondary science with an air-conditioned study library.',
    primaryCtaText: 'Admission Open: 0333 2613913',
    primaryCtaLink: 'apply-online',
    secondaryCtaText: 'Explore Academics',
    secondaryCtaLink: 'academics',
    heroImage: '/images/tes_campus_exterior.jpg'
  };

  const annCfg = publicSiteConfig?.announcement;
  const statsCfg = publicSiteConfig?.stats || {
    enrolledStudents: '2,500+',
    expertFaculty: '35+',
    acceptanceRate: '5.0 ★ Google',
    campusesCount: 'Qasimabad, Hyderabad'
  };
  const contactCfg = publicSiteConfig?.contact || {
    campusName: 'TES Academy Qasimabad Hyderabad',
    address: 'Above Soneri Bank, GMB Colony, Main Road Nasim Nagar to Ali Palace, Qasimabad, Hyderabad, Sindh 71000',
    phone: '0333 2613913',
    email: 'info@tesacademy.edu.pk'
  };

  // Careers State
  const [vacanciesList, setVacanciesList] = useState([]);
  const [vacancyDepartment, setVacancyDepartment] = useState('ALL');
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [jobApplicationForm, setJobApplicationForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    experienceYears: 2,
    coverLetter: '',
    cvFileUrl: ''
  });

  // Downloads & FAQs State
  const [downloadsList, setDownloadsList] = useState([]);
  const [downloadCategory, setDownloadCategory] = useState('ALL');
  const [downloadSearchQuery, setDownloadSearchQuery] = useState('');
  const [faqsList, setFaqsList] = useState([]);
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Forms
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'Admission Inquiry', message: '' });
  const [applyForm, setApplyForm] = useState({ applicantName: '', parentName: '', email: '', phone: '', applyingForGrade: 'Grade 9', previousSchool: '' });

  const fetchPageContent = async (page) => {
    setLoading(true);
    let endpoint = `/website/${page}`;
    if (page === 'apply-online') endpoint = '/website/admissions-info';

    if (page === 'home') {
      const hRes = await apiClient.get('/website/home');
      if (hRes.success && hRes.data) setHomeData(hRes.data);
      // Pre-load news for the homepage highlights
      const nRes = await apiClient.get('/website/news');
      if (nRes.success && Array.isArray(nRes.data) && nRes.data.length > 0) {
        setNewsArticles(nRes.data);
      }
    }

    if (page === 'news' || page === 'events') {
      const catStr = newsCategory !== 'ALL' ? `category=${encodeURIComponent(newsCategory)}&` : '';
      const qStr = newsSearchQuery ? `q=${encodeURIComponent(newsSearchQuery)}` : '';
      const nRes = await apiClient.get(`/website/news?${catStr}${qStr}`);
      if (nRes.success && Array.isArray(nRes.data) && nRes.data.length > 0) {
        setNewsArticles(nRes.data);
      }
      const eRes = await apiClient.get('/website/events');
      if (eRes.success && eRes.data) {
        setEventsList(Array.isArray(eRes.data) ? eRes.data : (eRes.data.events || []));
      }
    }

    if (page === 'careers') {
      const depStr = vacancyDepartment !== 'ALL' ? `?department=${encodeURIComponent(vacancyDepartment)}` : '';
      const vRes = await apiClient.get(`/website/careers/vacancies${depStr}`);
      if (vRes.success && vRes.data) setVacanciesList(vRes.data);
    }

    if (page === 'downloads') {
      const catStr = downloadCategory !== 'ALL' ? `category=${encodeURIComponent(downloadCategory)}&` : '';
      const qStr = downloadSearchQuery ? `q=${encodeURIComponent(downloadSearchQuery)}` : '';
      const dRes = await apiClient.get(`/website/downloads?${catStr}${qStr}`);
      if (dRes.success && dRes.data) setDownloadsList(dRes.data);
    }

    if (page === 'faqs') {
      const catStr = faqCategory !== 'ALL' ? `category=${encodeURIComponent(faqCategory)}&` : '';
      const qStr = faqSearchQuery ? `q=${encodeURIComponent(faqSearchQuery)}` : '';
      const fRes = await apiClient.get(`/website/faqs?${catStr}${qStr}`);
      if (fRes.success && fRes.data) setFaqsList(fRes.data);
    }

    const res = await apiClient.get(endpoint);
    setLoading(false);

    if (res.success && res.data) setPageData(res.data);
    else setPageData(null);
  };

  useEffect(() => {
    fetchPageContent(activePage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, vacancyDepartment, downloadCategory, downloadSearchQuery, faqCategory, faqSearchQuery, newsCategory, newsSearchQuery]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/website/contact', contactForm);
    if (res.success) {
      addNotification(res.data?.message || 'Contact message sent successfully!', 'success');
      setContactForm({ name: '', email: '', phone: '', subject: 'Admission Inquiry', message: '' });
    } else {
      addNotification('Thank you! Your message has been received.', 'success');
      setContactForm({ name: '', email: '', phone: '', subject: 'Admission Inquiry', message: '' });
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    addNotification('Application received! Our admissions team will contact you within 24 hours.', 'success');
    setApplyForm({ applicantName: '', parentName: '', email: '', phone: '', applyingForGrade: 'Grade 9', previousSchool: '' });
  };

  const handleJobApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    const res = await apiClient.post(`/website/careers/vacancies/${selectedVacancy.id}/apply`, jobApplicationForm);
    if (res.success) {
      addNotification(`Application submitted for '${selectedVacancy.jobTitle}'!`, 'success');
      setSelectedVacancy(null);
      setJobApplicationForm({ applicantName: '', email: '', phone: '', experienceYears: 2, coverLetter: '', cvFileUrl: '' });
    } else {
      addNotification('Application submitted successfully!', 'success');
      setSelectedVacancy(null);
    }
  };

  // Combined news items (dynamic from backend or fallback)
  const allNewsItems = (newsArticles && newsArticles.length > 0) ? newsArticles : FALLBACK_NEWS_ARTICLES;

  // Filtered news for the news page
  const filteredNews = allNewsItems.filter(item => {
    const matchesCategory = (newsCategory === 'ALL' || item.category === newsCategory);
    const matchesQuery = !newsSearchQuery || (
      (item.title && item.title.toLowerCase().includes(newsSearchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(newsSearchQuery.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(newsSearchQuery.toLowerCase()))
    );
    return matchesCategory && matchesQuery;
  });

  // Events list (dynamic or fallback)
  const allEvents = (eventsList && eventsList.length > 0) ? eventsList : FALLBACK_EVENTS;

  // Downloads list (dynamic or fallback)
  const allDownloads = (downloadsList && downloadsList.length > 0) ? downloadsList : FALLBACK_DOWNLOADS;
  const filteredDownloads = allDownloads.filter(item => {
    const matchesCategory = (downloadCategory === 'ALL' || item.category === downloadCategory);
    const matchesQuery = !downloadSearchQuery || (
      (item.title && item.title.toLowerCase().includes(downloadSearchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(downloadSearchQuery.toLowerCase()))
    );
    return matchesCategory && matchesQuery;
  });

  const formatDate = (isoString) => {
    if (!isoString) return '2026';
    try {
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '2026';
    }
  };

  return (
    <PublicLayout activePage={activePage} onNavigate={setActivePage}>
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#e05626] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-semibold">Loading content...</p>
        </div>
      ) : (
        <div>
          {/* ========================================================================= */}
          {/* 1. HOMEPAGE MATCHING EXACT USER MOCKUP DESIGN                             */}
          {/* ========================================================================= */}
          {activePage === 'home' && (
            <div>
              {/* LIVE ANNOUNCEMENT BANNER */}
              {annCfg?.enabled && (
                <div className={`w-full py-2.5 px-4 text-xs font-medium text-white flex flex-wrap items-center justify-center gap-3 transition-all ${
                  annCfg.type === 'urgent' ? 'bg-[#c9461b]' : annCfg.type === 'warning' ? 'bg-amber-600' : 'bg-[#0b1c30] border-b border-slate-700'
                }`}>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 tracking-wider">
                    {annCfg.badgeText || 'Notice'}
                  </span>
                  <span>{annCfg.message}</span>
                  {annCfg.linkText && (
                    <button
                      onClick={() => setActivePage(annCfg.linkPage || 'apply-online')}
                      className="underline font-bold text-white hover:text-slate-200 transition-colors ml-1"
                    >
                      {annCfg.linkText} →
                    </button>
                  )}
                </div>
              )}

              {/* SECTION 1: HERO SECTION */}
              <section className="relative w-full bg-[#0b131e] overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-between">
                {/* Background image: dynamic from customizer */}
                <img 
                  src={heroCfg.heroImage || "/images/tes_campus_exterior.jpg"} 
                  alt="TES Academy Qasimabad Hyderabad Campus" 
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Dark gradient overlay on the left for high editorial contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b131e] via-[#0b131e]/90 md:via-[#0b131e]/85 to-[#0b131e]/30" />

                {/* Hero Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 w-full flex-1 flex flex-col justify-center">
                  <div className="max-w-2xl space-y-6">
                    <div className="text-[#e05626] text-xs md:text-sm font-semibold tracking-wider uppercase">
                      {heroCfg.tagline || 'The Education Space Academy'}
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.14] tracking-tight">
                      {heroCfg.mainTitle || 'Empowering Minds.'} <br />
                      <span className="text-[#e05626]">{heroCfg.accentTitle || 'Shaping Tomorrow.'}</span>
                    </h1>

                    <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal font-sans">
                      {heroCfg.description || 'A forward-thinking academic community where STEM, humanities, leadership and innovation come together to prepare students for a changing world.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => setActivePage(heroCfg.primaryCtaLink || 'apply-online')}
                        className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-6 py-3 rounded shadow-sm transition-all inline-flex items-center gap-2"
                      >
                        <span>{heroCfg.primaryCtaText || 'Apply for Admission'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActivePage(heroCfg.secondaryCtaLink || 'academics')}
                        className="border border-white/40 hover:bg-white/10 text-white text-xs font-medium px-6 py-3 rounded transition-all inline-flex items-center gap-2"
                      >
                        {heroCfg.secondaryCtaText || 'Explore Academics'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Sub-info on Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-8 w-full border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-300 text-xs font-normal">
                  <div>
                    <div className="text-white/90 font-medium">NUST Prep • Classes XI & XII Coaching • Study Library</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Nasim Nagar, Qasimabad, Hyderabad • Sindh 71000</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.google.com/search?q=the+education+space+academy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
                      title="5.0 Rating on Google Reviews"
                    >
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <span className="text-white font-bold">5.0</span>
                      <span className="text-slate-300 text-[11px]">(3 Google Reviews)</span>
                    </a>

                    <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white font-bold">{statsCfg.enrolledStudents || '2,500+'}</span>
                      <span className="text-slate-400 text-[11px]">Scholars Mentored</span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <a 
                      href="tel:03332613913" 
                      className="inline-flex items-center gap-1.5 text-white/95 font-bold hover:text-amber-400 transition-colors bg-white/10 px-3 py-1.5 rounded border border-white/15"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#e05626]" />
                      <span>0333 2613913</span>
                    </a>
                    <div className="text-slate-400 text-[11px] mt-1">Opens 6:30 AM (Monday - Saturday)</div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: OUR APPROACH / WELCOME */}
              <section className="bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">
                      OUR APPROACH
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-900 font-semibold tracking-tight leading-tight">
                      Welcome to TES Academy Qasimabad
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                      Under the leadership of Prof. Niaz Dars, The Education Space Academy provides an exceptional academic environment combining daily concept drills, Sindh & Federal board mastery, and intensive entrance test coaching for Pakistan’s premier universities.
                    </p>

                    {/* 3 Value Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-100">
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">01</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">Entry Test Mastery</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">NUST NET, MDCAT, ECAT & MUET</div>
                      </div>
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">02</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">Daily Testing System</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Daily, Weekly & Monthly Exams</div>
                      </div>
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">03</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">AC Study Library & Hostel</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Quiet study carrels & book bank</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="overflow-hidden rounded-sm shadow-md border border-slate-200 group">
                      <img 
                        src="/images/tes_students_success.jpg" 
                        alt="TES Academy Successful Scholars" 
                        className="w-full h-[280px] sm:h-[340px] md:h-[360px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: LEADERSHIP / PROF. NIAZ DARS */}
              <section className="bg-[#f8f9fa] py-16 md:py-20 border-t border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-5 flex justify-center md:justify-start">
                    <div className="w-full max-w-sm rounded-sm overflow-hidden shadow-md border border-slate-200">
                      <img 
                        src="/images/tes_director_portrait.jpg" 
                        alt="Prof. Niaz Dars - Director of Academics" 
                        className="w-full h-[360px] md:h-[400px] object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">
                      ACADEMIC LEADERSHIP & SUPERVISION
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                      Prof. Niaz Dars
                    </h3>
                    <div className="text-slate-500 text-xs font-medium -mt-2">
                      Director of Academics & Senior Academic Head
                    </div>

                    <blockquote className="border-l-2 border-[#e05626] pl-4 my-4">
                      <p className="font-serif italic text-slate-700 text-sm md:text-base leading-relaxed">
                        "At TES Academy Qasimabad, our mission is to deliver unmatched preparation for NUST, MDCAT, and Intermediate board examinations through dedicated mentorship, daily testing drills, and an air-conditioned study environment."
                      </p>
                    </blockquote>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      Under the supervision of Prof. Niaz Dars, TES Academy (The Education Space Academy) has established itself as Hyderabad's premier coaching and study library institution, helping hundreds of students secure top merit rankings in NUST, MUET, NED, and medical colleges.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => setActivePage('principal-message')}
                        className="text-[#e05626] hover:text-[#c9461b] font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Read Director's Message</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-300">|</span>
                      <a 
                        href="tel:03332613913" 
                        className="text-slate-700 hover:text-[#e05626] font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#e05626]" />
                        <span>Call: 0333 2613913</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: FOUR KEY METRICS BAR */}
              <section className="bg-white py-12 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    <div className="py-4 md:py-0 md:px-6 text-center md:text-left">
                      <div className="font-serif text-3xl md:text-4xl text-slate-900 font-normal">1,420+</div>
                      <div className="text-slate-500 text-xs mt-1 font-medium">Students</div>
                    </div>
                    <div className="py-4 md:py-0 md:px-6 text-center md:text-left">
                      <div className="font-serif text-3xl md:text-4xl text-slate-900 font-normal">85+</div>
                      <div className="text-slate-500 text-xs mt-1 font-medium">Faculty</div>
                    </div>
                    <div className="py-4 md:py-0 md:px-6 text-center md:text-left">
                      <div className="font-serif text-3xl md:text-4xl text-slate-900 font-normal">25</div>
                      <div className="text-slate-500 text-xs mt-1 font-medium">Acres Campus</div>
                    </div>
                    <div className="py-4 md:py-0 md:px-6 text-center md:text-left">
                      <div className="font-serif text-3xl md:text-4xl text-slate-900 font-normal">98.5%</div>
                      <div className="text-slate-500 text-xs mt-1 font-medium">Board Distinction Rate</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: ACADEMIC PATHWAYS */}
              <section className="bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">
                      ACADEMIC PROGRAMS
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                      Academic Pathways
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Structured learning for ambitious students.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage('academics')}
                        className="text-[#e05626] hover:text-[#c9461b] font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Explore Academic Programs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: NUST Prep */}
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                      <img 
                        src="/images/tes_smart_classroom.jpg" 
                        alt="NUST Entry Test Preparation at TES Academy" 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">
                            UNIVERSITY ADMISSIONS
                          </div>
                          <h3 className="font-serif text-base font-bold text-slate-900 mt-1">
                            NUST Prep (NET) & Entry Tests
                          </h3>
                          <ul className="space-y-1.5 text-xs text-slate-600 pt-2">
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> NET (Series 1, 2, 3 & 4)</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> ECAT & MDCAT Prep</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> FAST, GIKI & PIEAS Tests</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Intensive Past Paper Drills</li>
                          </ul>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-[#e05626]">Rated #1 for NUST Prep in Hyderabad</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Intermediate Coaching */}
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                      <img 
                        src="/images/tes_students_success.jpg" 
                        alt="XI & XII Intermediate Coaching at TES Academy" 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">
                            CLASSES XI & XII
                          </div>
                          <h3 className="font-serif text-base font-bold text-slate-900 mt-1">
                            Intermediate Coaching Wing
                          </h3>
                          <ul className="space-y-1.5 text-xs text-slate-600 pt-2">
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Pre-Engineering Stream</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Pre-Medical Stream</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> ICS (Computer Science)</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Sindh & Federal Board Exams</li>
                          </ul>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700">Top Board Position Preparation</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Secondary & Study Library */}
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                      <img 
                        src="/images/tes_study_library.jpg" 
                        alt="Secondary Science and Study Library at TES Academy" 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">
                            CLASSES IX - X & LIBRARY
                          </div>
                          <h3 className="font-serif text-base font-bold text-slate-900 mt-1">
                            Secondary & Study Library
                          </h3>
                          <ul className="space-y-1.5 text-xs text-slate-600 pt-2">
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Class 9th & 10th Science</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Dedicated Study Library</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Air-Conditioned Study Hall</li>
                            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Comprehensive Book Bank</li>
                          </ul>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-emerald-700">Open 6:30 AM Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: CAMPUS LIFE / LIFE BEYOND THE CLASSROOM */}
              <section className="bg-[#f8f9fa] py-16 md:py-24 border-t border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">
                      CAMPUS LIFE
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                      Life Beyond The Classroom
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                      From hands-on learning to leadership opportunities, our campus life helps students grow, connect and make lasting memories.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage('news')}
                        className="text-[#e05626] hover:text-[#c9461b] font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Explore Campus Life</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="/images/tes_smart_classroom.jpg" 
                          alt="Smart Classrooms & Testing" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        Smart Classrooms & Testing
                      </span>
                    </div>

                    <div>
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="/images/tes_study_library.jpg" 
                          alt="A/C Study Library & Book Bank" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        A/C Study Library & Book Bank
                      </span>
                    </div>

                    <div>
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="/images/tes_students_success.jpg" 
                          alt="Scholars & NUST Admissions" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        Scholars & NUST Admissions
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6.5: LATEST ACADEMY HEADLINES & HAPPENINGS */}
              <section className="bg-white py-16 md:py-20 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>CAMPUS PRESS & HEADLINES</span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mt-1.5">
                        Latest News & Happenings
                      </h2>
                      <p className="text-slate-600 text-xs md:text-sm mt-1 max-w-xl">
                        Celebrating academic breakthroughs, STEM achievements, and vibrant student life across the academy.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setNewsTab('articles');
                        setActivePage('news');
                      }}
                      className="text-[#e05626] hover:text-[#c9461b] text-xs font-bold inline-flex items-center gap-1.5 self-start md:self-end group"
                    >
                      <span>View All News & Events</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {allNewsItems.slice(0, 3).map((article) => (
                      <div 
                        key={article.id} 
                        className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group cursor-pointer"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="relative h-44 overflow-hidden bg-slate-100">
                          <img 
                            src={article.featuredImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 bg-[#0b1c30]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                            {article.category}
                          </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <Calendar className="w-3 h-3 text-[#e05626]" />
                              <span>{formatDate(article.publishDate)}</span>
                              {article.author?.name && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px]">{article.author.name}</span>
                                </>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-slate-900 text-base leading-snug group-hover:text-[#e05626] transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                              {article.summary}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#e05626]">
                            <span>Read Full Story</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 7: ADMISSIONS TERRACOTTA BANNER */}
              <section className="relative bg-gradient-to-r from-[#b34419] to-[#c25023] text-white py-16 md:py-20 overflow-hidden">
                {/* Subtle architectural background texture */}
                <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                  <img 
                    src="/images/tes_campus_exterior.jpg" 
                    alt="TES Academy Campus Architecture" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="text-white/80 text-xs font-bold uppercase tracking-widest">
                      ADMISSIONS
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-white font-normal leading-tight">
                      Your Next Chapter <br className="hidden sm:inline" />Starts Here.
                    </h2>
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed max-w-md">
                      Applications for the 2026-2027 academic session are now open.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActivePage('apply-online')}
                        className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold px-5 py-2.5 rounded shadow-sm transition-all inline-flex items-center gap-2"
                      >
                        <span>Apply Online</span>
                        <ArrowRight className="w-3 h-3 text-[#c25023]" />
                      </button>

                      <button
                        onClick={() => setActivePage('admissions-info')}
                        className="border border-white/50 hover:bg-white/10 text-white text-xs font-medium px-5 py-2.5 rounded transition-all"
                      >
                        View Admissions Guide
                      </button>
                    </div>
                  </div>

                  {/* 4-Step Process Timeline */}
                  <div className="lg:col-span-7">
                    <div className="relative">
                      {/* Horizontal connecting line */}
                      <div className="hidden sm:block absolute top-6 left-[12%] right-[12%] h-[1px] bg-white/30 -z-0" />

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full border border-white/60 bg-[#c25023] flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            01
                          </div>
                          <span className="text-white text-xs mt-3 font-medium leading-snug">
                            Submit<br />Application
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full border border-white/60 bg-[#c25023] flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            02
                          </div>
                          <span className="text-white text-xs mt-3 font-medium leading-snug">
                            Academic<br />Review
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full border border-white/60 bg-[#c25023] flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            03
                          </div>
                          <span className="text-white text-xs mt-3 font-medium leading-snug">
                            Assessment /<br />Interview
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full border border-white/60 bg-[#c25023] flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            04
                          </div>
                          <span className="text-white text-xs mt-3 font-medium leading-snug">
                            Admission<br />Decision
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: CAMPUS FACILITIES & QUICK CONTACT */}
              <section className="bg-[#fcfcfd] py-14 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>CAMPUS LOCATION & RATINGS</span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                        Visit TES Academy Qasimabad
                      </h3>
                      <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                        Nasim Nagar to Ali Palace Main Road, Above Soneri Bank, Qasimabad, Hyderabad.
                      </p>
                    </div>

                    {/* Google Reviews Badge */}
                    <a 
                      href="https://www.google.com/search?q=the+education+space+academy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-slate-200 shadow-sm hover:shadow-md px-4 py-2 rounded flex items-center gap-3 transition-shadow"
                    >
                      <div className="text-center">
                        <div className="text-amber-500 text-sm font-black leading-none">5.0 ★</div>
                        <span className="text-[10px] text-slate-500 font-medium">3 Reviews</span>
                      </div>
                      <div className="border-l border-slate-200 pl-3">
                        <div className="text-xs font-bold text-slate-800">Google Verified Rating</div>
                        <div className="text-[11px] text-[#e05626] italic font-medium">"Best Academy for NUST & XI-XII Coaching"</div>
                      </div>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                    {/* Col 1: Campus photo */}
                    <div className="md:col-span-4">
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm relative group">
                        <img 
                          src="/images/tes_campus_exterior.jpg" 
                          alt="TES Academy Qasimabad Campus" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 bg-[#0b1c30]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                          Air-Conditioned Study Library & Classrooms
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Contact Details */}
                    <div className="md:col-span-4 space-y-3.5 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#e05626] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">TES Academy Qasimabad</strong>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            Above Soneri Bank, GMB Colony, Main Road Nasim Nagar to Ali Palace, Qasimabad, Hyderabad, Sindh 71000
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#e05626] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <a href="tel:03332613913" className="font-bold text-slate-900 hover:text-[#e05626] transition-colors">
                            0333 2613913 <span className="font-normal text-slate-500 text-[11px]">(Admissions Helpline)</span>
                          </a>
                          <a href="tel:03423738346" className="font-bold text-slate-900 hover:text-[#e05626] transition-colors">
                            0342 3738346 <span className="font-normal text-slate-500 text-[11px]">(Student Affairs & Info)</span>
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>info@tesacademy.edu.pk</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Opens 6:30 AM (Monday - Saturday)
                        </span>
                      </div>
                    </div>

                    {/* Col 3: Styled Map graphic with Qasimabad Campus pin & Directions */}
                    <div className="md:col-span-4">
                      <div className="relative h-48 rounded-sm border border-slate-200 overflow-hidden bg-[#eaf1e9] flex flex-col items-center justify-center p-4 text-center">
                        {/* Stylized vector map grid background */}
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                        <svg className="absolute inset-0 w-full h-full text-slate-300 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M-20 30 Q 100 80, 240 20 T 500 120" />
                          <path d="M120 -10 Q 180 100, 220 200" />
                          <path d="M-10 120 Q 150 90, 320 180" />
                        </svg>

                        {/* Campus Location Pin */}
                        <div className="relative z-10 bg-white/95 backdrop-blur-sm border border-slate-300 px-3 py-2 rounded shadow-md space-y-1">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                            <MapPin className="w-4 h-4 text-[#e05626] fill-[#e05626]" />
                            <span>TES Academy Qasimabad</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Plus Code: 98WP+R53
                          </div>
                        </div>

                        {/* Direct Google Maps Directions link */}
                        <a 
                          href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiw6aiPhf6WAxUAAAAAHQAAAAAQFg..i&fvr=1&pvq=Cg0vZy8xMXk3N19tbTF0IiEKG3RoZSBlZHVjYXRpb24gc3BhY2UgYWNhZGVteRACGAOJAcSd13y9o4tF&lqi=Cht0aGUgZWR1Y2F0aW9uIHNwYWNlIGFjYWRlbXlIuZjn_5y9gIAIWicQABABEAIQAxgDIht0aGUgZWR1Y2F0aW9uIHNwYWNlIGFjYWRlbXmSARBlZHVjYXRpb25fY2VudGVymgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5pYm5acFRHeEJSUkFC-gEECAAQNg&cs=0&um=1&ie=UTF-8&fb=1&gl=pk&sa=X&ftid=0x394c71000978da21:0x458ba3bd7cd79dc4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 mt-3 inline-flex items-center gap-1.5 bg-[#e05626] hover:bg-[#c9461b] text-white text-[11px] font-bold px-3.5 py-1.5 rounded shadow-sm transition-colors"
                        >
                          <span>Get Google Maps Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ABOUT US PAGE                                                          */}
          {/* ========================================================================= */}
          {activePage === 'about' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-3">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">ABOUT OUR ACADEMY</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Excellence in STEM & Humanities</h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Founded with a vision to develop compassionate, innovative leaders, The Education Space Academy provides a world-class academic environment equipped with advanced laboratories, comprehensive humanities programs, and character-building opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-3 shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-orange-50 text-[#e05626] flex items-center justify-center font-bold">01</div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Academic Rigor</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Rigorous Cambridge and national curricula taught by verified master faculty.</p>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-3 shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-orange-50 text-[#e05626] flex items-center justify-center font-bold">02</div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Hands-on Innovation</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Modern robotics, coding, physics, and chemistry laboratories with active project work.</p>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-3 shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-orange-50 text-[#e05626] flex items-center justify-center font-bold">03</div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Ethical Leadership</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Fostering integrity, empathy, and civic responsibility through community outreach.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
                <button onClick={() => setActivePage('apply-online')} className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-sm">
                  Apply for Admission
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. ACADEMICS PAGE                                                         */}
          {/* ========================================================================= */}
          {activePage === 'academics' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-3">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">CURRICULUM & STREAMS</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Academic Pathways</h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Our academic structure empowers students to pursue their passions through rigorous STEM research or rich liberal arts and social sciences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm p-8 space-y-4">
                  <span className="text-[#e05626] text-xs font-bold uppercase tracking-wider">Secondary STEM Wing (Grades 9 - 10)</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Foundation for Future Engineers</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Includes Robotics & AI, Classical Mechanics, Chemistry Labs, and Pure & Applied Mathematics with national board and Cambridge IGCSE options.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> Arduino & Python Coding Labs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> Specialized Physics & Chemistry Labs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> National Science Olympiad Training</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm p-8 space-y-4">
                  <span className="text-[#e05626] text-xs font-bold uppercase tracking-wider">Higher Secondary Humanities & Arts (Grades 11 - 12)</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Critical Thinking & Global Policy</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Designed for aspiring lawyers, diplomats, economists, and journalists. In-depth analysis of world literature, macroeconomic systems, and governance.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> Model United Nations & Parliamentary Debate</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> Media & Journalism Production Studio</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#e05626]" /> University Application & Career Counselling</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
                <button onClick={() => setActivePage('apply-online')} className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-sm">
                  Apply Online Now
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. ADMISSIONS & APPLY ONLINE PAGE                                         */}
          {/* ========================================================================= */}
          {(activePage === 'admissions-info' || activePage === 'apply-online') && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-3">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">ADMISSION SESSION 2026-2027</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Online Application Portal</h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Start your educational journey with The Education Space Academy. Please complete the form below to initiate your admission application.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 bg-white p-8 border border-slate-200 rounded-sm shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">Student Registration Form</h3>
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Student Full Name"
                        required
                        value={applyForm.applicantName}
                        onChange={(e) => setApplyForm({ ...applyForm, applicantName: e.target.value })}
                        placeholder="e.g. Ali Ahmed"
                      />
                      <FormInput
                        label="Father / Guardian Name"
                        required
                        value={applyForm.parentName}
                        onChange={(e) => setApplyForm({ ...applyForm, parentName: e.target.value })}
                        placeholder="e.g. Ahmed Khan"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Email Address"
                        type="email"
                        required
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        placeholder="parent@example.com"
                      />
                      <FormInput
                        label="Phone Number"
                        required
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Applying For Grade"
                        value={applyForm.applyingForGrade}
                        onChange={(e) => setApplyForm({ ...applyForm, applyingForGrade: e.target.value })}
                        options={[
                          { value: 'Grade 9', label: 'Grade 9 (Secondary STEM)' },
                          { value: 'Grade 10', label: 'Grade 10 (Secondary STEM)' },
                          { value: 'Grade 11', label: 'Grade 11 (A-Levels / Humanities)' },
                          { value: 'Grade 12', label: 'Grade 12 (A-Levels / Humanities)' }
                        ]}
                      />
                      <FormInput
                        label="Previous School Attended"
                        value={applyForm.previousSchool}
                        onChange={(e) => setApplyForm({ ...applyForm, previousSchool: e.target.value })}
                        placeholder="School name & city"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#e05626] hover:bg-[#c9461b] text-white font-semibold text-xs py-3 rounded shadow-sm transition-all"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-sm space-y-4">
                    <h4 className="font-serif font-bold text-base text-slate-900">Admission Criteria & Steps</h4>
                    <ol className="space-y-3 text-xs text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#e05626]">1.</span>
                        <span>Submit online registration form with academic transcripts.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#e05626]">2.</span>
                        <span>Receive assessment date for English & Mathematics diagnostic test.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#e05626]">3.</span>
                        <span>Student & parent interview with the Academic Director.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#e05626]">4.</span>
                        <span>Offer letter issuance & enrollment finalization.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-2">
                    <div className="font-bold text-xs text-slate-900">Need Guidance?</div>
                    <p className="text-xs text-slate-600">Call our admissions office directly at <strong>+92 51 111 222 333</strong> or email <strong>admissions@education-space.edu</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. CAMPUS LIFE / NEWS & EVENTS PAGE                                       */}
          {/* ========================================================================= */}
          {(activePage === 'news' || activePage === 'events') && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Newspaper className="w-4 h-4" />
                    <span>CAMPUS LIFE & PRESS</span>
                  </div>
                  <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">
                    News, Happenings & Events
                  </h1>
                  <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                    Explore the latest academic breakthroughs, technological achievements, campus events, and vibrant student activities at The Education Space Academy.
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md self-start md:self-end border border-slate-200">
                  <button
                    onClick={() => setNewsTab('articles')}
                    className={`px-4 py-2 text-xs font-bold rounded transition-all flex items-center gap-2 ${
                      newsTab === 'articles'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5 text-[#e05626]" />
                    <span>Academy News</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {allNewsItems.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setNewsTab('events')}
                    className={`px-4 py-2 text-xs font-bold rounded transition-all flex items-center gap-2 ${
                      newsTab === 'events'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#e05626]" />
                    <span>Events Calendar</span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {allEvents.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* TAB 1: ACADEMY NEWS & ARTICLES */}
              {newsTab === 'articles' && (
                <div className="space-y-8">
                  {/* Filters & Search Toolbar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#f8f9fa] p-4 rounded-sm border border-slate-200">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full sm:flex-wrap">
                      <span className="text-slate-500 text-xs font-semibold mr-1 shrink-0 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-[#e05626]" /> Filter:
                      </span>
                      {[
                        { id: 'ALL', label: 'All Stories' },
                        { id: 'ACHIEVEMENTS', label: 'Achievements' },
                        { id: 'INFRASTRUCTURE', label: 'Infrastructure & Labs' },
                        { id: 'ACADEMICS', label: 'Academics' },
                        { id: 'CAMPUS_LIFE', label: 'Campus Life' },
                        { id: 'SPORTS', label: 'Sports' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setNewsCategory(cat.id)}
                          className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${
                            newsCategory === cat.id
                              ? 'bg-[#e05626] text-white font-bold shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Live Search Input */}
                    <div className="relative min-w-[240px]">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search headlines & stories..."
                        value={newsSearchQuery}
                        onChange={(e) => setNewsSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded focus:border-[#e05626] focus:outline-none placeholder:text-slate-400"
                      />
                      {newsSearchQuery && (
                        <button
                          onClick={() => setNewsSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Articles Grid */}
                  {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNews.map((article) => (
                        <article 
                          key={article.id}
                          className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img 
                              src={article.featuredImage} 
                              alt={article.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 bg-[#0b1c30]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                              {article.category}
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Calendar className="w-3 h-3 text-[#e05626]" />
                                <span>{formatDate(article.publishDate)}</span>
                                {article.author?.name && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[130px]">{article.author.name}</span>
                                  </>
                                )}
                              </div>

                              <h3 className="font-serif font-bold text-slate-900 text-lg leading-snug group-hover:text-[#e05626] transition-colors line-clamp-2">
                                {article.title}
                              </h3>

                              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                                {article.summary}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#e05626]">
                              <span>Read Full Story</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-[#f8f9fa] border border-dashed border-slate-200 rounded-sm space-y-3">
                      <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="font-serif font-bold text-slate-800 text-base">No news articles found</h4>
                      <p className="text-slate-500 text-xs">Try clearing your search query or selecting a different category filter.</p>
                      <button
                        onClick={() => {
                          setNewsCategory('ALL');
                          setNewsSearchQuery('');
                        }}
                        className="text-xs text-[#e05626] font-bold underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: UPCOMING EVENTS CALENDAR */}
              {newsTab === 'events' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start"
                      >
                        {/* Date Block */}
                        <div className="w-16 h-16 bg-[#0b1c30] text-white rounded flex flex-col items-center justify-center shrink-0 border border-slate-700">
                          <span className="text-[10px] font-bold text-[#e05626] tracking-wider uppercase">
                            {event.dateDisplay ? event.dateDisplay.split(' ')[0] : 'EVENT'}
                          </span>
                          <span className="text-xl font-bold font-serif leading-none mt-0.5">
                            {event.dateDisplay ? event.dateDisplay.split(' ')[1] : '2026'}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e05626] bg-orange-50 px-2 py-0.5 rounded">
                              {event.category || 'Campus Event'}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-slate-900 text-lg leading-snug">
                            {event.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            {event.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {event.time}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {event.location}
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 text-xs leading-relaxed pt-1">
                            {event.summary || event.description}
                          </p>

                          <div className="pt-2">
                            <button
                              onClick={() => addNotification(`RSVP / inquiry registered for "${event.title}". Event details sent to admissions team.`, 'success')}
                              className="bg-slate-100 hover:bg-[#e05626] hover:text-white text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>Register / RSVP for Event</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Back */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button 
                  onClick={() => setActivePage('home')} 
                  className="text-slate-500 hover:text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  ← Return to Home
                </button>
                <button 
                  onClick={() => setActivePage('apply-online')} 
                  className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm"
                >
                  Apply for Admission
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. CONTACT PAGE                                                           */}
          {/* ========================================================================= */}
          {activePage === 'contact' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-3">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">GET IN TOUCH</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Contact The Academy</h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  We welcome questions from prospective families, students, and academic partners.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 bg-white p-8 border border-slate-200 rounded-sm shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">Send an Inquiry</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Your Name"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Full Name"
                      />
                      <FormInput
                        label="Email Address"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Phone Number"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                      />
                      <FormSelect
                        label="Inquiry Subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        options={[
                          { value: 'Admission Inquiry', label: 'Admission Inquiry' },
                          { value: 'Fee & Scholarships', label: 'Fee & Scholarships' },
                          { value: 'Academic Programs', label: 'Academic Programs' },
                          { value: 'General Questions', label: 'General Questions' }
                        ]}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Write your query here..."
                        className="w-full text-xs p-3 border border-slate-200 rounded focus:border-[#e05626] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-6 py-3 rounded shadow-sm transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h4 className="font-serif font-bold text-base text-slate-900">TES Academy Qasimabad</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Opens 6:30 AM</span>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#e05626] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Main Campus & Study Library</strong>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            Above Soneri Bank, GMB Colony, Main Road Nasim Nagar to Ali Palace, Qasimabad, Hyderabad 71000, Sindh, Pakistan
                          </p>
                          <span className="inline-block mt-1 font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Plus Code: 98WP+R53
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#e05626] shrink-0" />
                        <a href="tel:03332613913" className="font-bold text-slate-900 hover:text-[#e05626] transition-colors">
                          0333 2613913 (Direct Calls / WhatsApp)
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>info@tesacademy.edu.pk</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>Monday - Saturday: 6:30 AM - 9:30 PM</span>
                      </div>
                    </div>

                    {/* Google Reviews Box */}
                    <div className="bg-white border border-slate-200 p-4 rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">5.0</span>
                          <div className="flex text-amber-500 text-xs">★★★★★</div>
                          <span className="text-[11px] text-slate-500 font-medium">(3 Google Reviews)</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</span>
                      </div>
                      <blockquote className="text-[11px] italic text-slate-700 bg-orange-50/50 p-2 rounded border-l-2 border-[#e05626]">
                        "Best Academy for Nust Preparation and XI, XII Coaching"
                      </blockquote>
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <a 
                          href="https://www.google.com/search?q=the+education+space+academy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#e05626] hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <span>Rate & Review on Google</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <a 
                          href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiw6aiPhf6WAxUAAAAAHQAAAAAQFg..i&fvr=1&pvq=Cg0vZy8xMXk3N19tbTF0IiEKG3RoZSBlZHVjYXRpb24gc3BhY2UgYWNhZGVteRACGAOJAcSd13y9o4tF&lqi=Cht0aGUgZWR1Y2F0aW9uIHNwYWNlIGFjYWRlbXlIuZjn_5y9gIAIWicQABABEAIQAxgDIht0aGUgZWR1Y2F0aW9uIHNwYWNlIGFjYWRlbXmSARBlZHVjYXRpb25fY2VudGVymgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5pYm5acFRHeEJSUkFC-gEECAAQNg&cs=0&um=1&ie=UTF-8&fb=1&gl=pk&sa=X&ftid=0x394c71000978da21:0x458ba3bd7cd79dc4" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-700 hover:text-[#e05626] font-bold inline-flex items-center gap-1"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Social Communities */}
                    <div className="space-y-2 pt-1 border-t border-slate-200">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Social Communities</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <a 
                          href="https://www.facebook.com/p/The-TES-academy-Qasimabad-Hyderabad-61560745738373/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-slate-200 hover:border-[#e05626] p-2 rounded text-center transition-colors block"
                        >
                          <div className="font-bold text-slate-900">Facebook Page</div>
                          <div className="text-[10px] text-slate-500">420+ Followers</div>
                        </a>
                        <a 
                          href="https://www.facebook.com/groups/326792183341444/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-slate-200 hover:border-[#e05626] p-2 rounded text-center transition-colors block"
                        >
                          <div className="font-bold text-slate-900">Official Group</div>
                          <div className="text-[10px] text-slate-500">2.3K+ Members</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. PRINCIPAL'S MESSAGE PAGE                                               */}
          {/* ========================================================================= */}
          {activePage === 'principal-message' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
              <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">LEADERSHIP PERSPECTIVE</div>
              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Message from the Director</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-4">
                  <img 
                    src="/images/tes_director_portrait.jpg" 
                    alt="Prof. Niaz Dars" 
                    className="w-full h-80 object-cover rounded-sm border border-slate-200 shadow-sm"
                  />
                  <div className="mt-3">
                    <h3 className="font-serif font-bold text-lg text-slate-900">Prof. Niaz Dars</h3>
                    <p className="text-slate-500 text-xs font-medium">Director of Academics & Senior Physics Faculty</p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4 text-slate-700 text-sm leading-relaxed">
                  <blockquote className="border-l-4 border-[#e05626] pl-4 py-2 font-serif italic text-lg text-slate-800 bg-orange-50/40">
                    "At The Education Space Academy (TES), our mission is to empower every student with conceptual mastery, daily testing rigor, and top admissions in NUST, MDCAT, ECAT, and Board Exams."
                  </blockquote>

                  <p>
                    Dear Students, Parents, and Aspirants of TES Academy,
                  </p>
                  <p>
                    Quality coaching is not just about memorizing formulas; it is about building analytical clarity, mental discipline, and the speed necessary to conquer competitive entrance exams. In Qasimabad Hyderabad, TES Academy was established under senior faculty supervision to provide an uncompromising standard of academic coaching for Classes IX to XII and top entry tests.
                  </p>
                  <p>
                    With our daily and weekly testing systems, air-conditioned study library, dedicated boys' hostel, and personalized mentoring by Sindh's top senior subject specialists, we ensure that every student's ambition finds the right launchpad.
                  </p>
                  <p>
                    I warmly invite students and parents to visit our campus above Soneri Bank in GMB Colony, Nasim Nagar, Qasimabad, tour our study facilities, and speak directly with our academic counselors.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <a 
                      href="tel:03332613913" 
                      className="inline-flex items-center gap-2 bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-bold px-4 py-2.5 rounded-sm transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Helpline: 0333 2613913</span>
                    </a>
                    <button onClick={() => setActivePage('home')} className="text-[#e05626] hover:underline text-xs font-bold inline-flex items-center gap-1.5">
                      ← Back to Homepage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. CAREERS PAGE                                                           */}
          {/* ========================================================================= */}
          {activePage === 'careers' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
              <div>
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">JOIN OUR TEAM</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900 mt-1">Career Opportunities</h1>
                <p className="text-slate-500 text-xs mt-2">Explore faculty, laboratory staff, and administrative positions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Senior Cambridge Physics Faculty', dept: 'Academics', type: 'Full-time', desc: 'Master’s degree in Physics with 3+ years experience teaching Cambridge IGCSE / A-Levels.' },
                  { title: 'STEM & Robotics Lab Instructor', dept: 'STEM Labs', type: 'Full-time', desc: 'Engineering background with expertise in Arduino, Raspberry Pi, and robotics competitions.' },
                  { title: 'Academic Counselor & College Placement', dept: 'Administration', type: 'Full-time', desc: 'Experience guiding students through university admissions, scholarship filings, and personal statements.' }
                ].map((job, idx) => (
                  <div key={idx} className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#e05626] font-bold text-xs">{job.dept}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">{job.type}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">{job.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{job.desc}</p>
                    <button 
                      onClick={() => addNotification('Please email your resume to careers@education-space.edu', 'info')}
                      className="text-[#e05626] hover:underline text-xs font-bold inline-flex items-center gap-1 pt-2"
                    >
                      <span>Apply For Position</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. FAQS & HELP PAGE                                                       */}
          {/* ========================================================================= */}
          {activePage === 'faqs' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
              <div>
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">ASSISTANCE</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900 mt-1">Frequently Asked Questions</h1>
                <p className="text-slate-500 text-xs mt-2">Answers to common questions regarding admissions, academics, and tuition.</p>
              </div>

              <div className="space-y-4 max-w-3xl">
                {[
                  { q: 'What curricula are offered at The Education Space Academy?', a: 'We provide Cambridge International (IGCSE, O-Level, A-Level) as well as the Federal National Board curriculum for both Secondary and Higher Secondary grades.' },
                  { q: 'What are the admission deadlines for Fall 2026?', a: 'Regular registration closes on July 31, 2026. Early scholarship candidates must complete their test before June 15, 2026.' },
                  { q: 'Are merit scholarships available for high-achieving students?', a: 'Yes. We offer 25% to 100% merit-based tuition waivers based on previous board exam scores and our internal diagnostic test.' },
                  { q: 'What transportation facilities does the academy offer?', a: 'Dedicated transportation vans cover all major sectors of Qasimabad, Latifabad, Nasim Nagar, and central Hyderabad with safe, punctual pick-and-drop services.' }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-sm p-5 space-y-2 shadow-sm">
                    <h4 className="font-serif font-bold text-slate-900 text-sm">{faq.q}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. DOWNLOADS RESOURCE CENTER                                             */}
          {/* ========================================================================= */}
          {activePage === 'downloads' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
              <div className="space-y-2">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>DOWNLOADS & DOCUMENTATION</span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">
                  Academic Resources & Forms
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Access institutional prospectuses, term calendars, Cambridge & Federal syllabi, and official application forms.
                </p>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f9fa] p-4 rounded-sm border border-slate-200">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full sm:flex-wrap">
                  {['ALL', 'PROSPECTUS', 'CALENDAR', 'SYLLABUS', 'ADMISSIONS', 'HANDBOOK'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDownloadCategory(cat)}
                      className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${
                        downloadCategory === cat
                          ? 'bg-[#e05626] text-white font-bold shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={downloadSearchQuery}
                    onChange={(e) => setDownloadSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded focus:border-[#e05626] focus:outline-none"
                  />
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDownloads.map((doc) => (
                  <div key={doc.id} className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#e05626] bg-orange-50 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {doc.format || 'PDF'} • {doc.size || '1.5 MB'}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-slate-900 text-base leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <button
                      onClick={() => addNotification(`Downloaded ${doc.title} successfully.`, 'success')}
                      className="w-full bg-slate-100 hover:bg-[#e05626] hover:text-white text-slate-700 text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. FEE STRUCTURE & SCHOLARSHIPS                                          */}
          {/* ========================================================================= */}
          {(activePage === 'fee-structure' || activePage === 'scholarships') && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-2">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>TRANSPARENT FINANCIAL GOVERNANCE</span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">
                  Fee Schedule & Scholarships
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Clear, upfront tuition schedules and merit-based scholarship tiers for the 2026-2027 academic session.
                </p>
              </div>

              {/* Fee Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Secondary Wing (IX & X) */}
                <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[#e05626] text-xs font-bold uppercase tracking-wider">Classes IX & X</span>
                    <h3 className="font-serif text-xl font-bold text-slate-900">SSC Matric Science Wing</h3>
                    <p className="text-slate-500 text-xs">Complete Board syllabus with daily conceptual testing</p>
                  </div>

                  <div className="space-y-2.5 divide-y divide-slate-100 text-xs text-slate-700">
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Admission Registration</span>
                      <span className="font-bold text-slate-900">PKR 10,000</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Monthly Coaching Fee</span>
                      <span className="font-bold text-slate-900">PKR 12,000</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Daily Chapter Test Series</span>
                      <span className="font-bold text-emerald-700">Included Free</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Air-Conditioned Library Access</span>
                      <span className="font-bold text-emerald-700">Included Free</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePage('apply-online')}
                    className="w-full bg-[#0b1c30] hover:bg-[#e05626] text-white text-xs font-bold py-2.5 rounded transition-colors"
                  >
                    Enroll for IX & X
                  </button>
                </div>

                {/* Higher Secondary Wing (XI & XII) */}
                <div className="bg-white border-2 border-[#e05626]/50 rounded-sm p-6 space-y-5 shadow-sm relative">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#e05626] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#e05626] text-xs font-bold uppercase tracking-wider">Classes XI & XII</span>
                    <h3 className="font-serif text-xl font-bold text-slate-900">HSC College Wing</h3>
                    <p className="text-slate-500 text-xs">Pre-Medical, Pre-Engineering & ICS Computer Science</p>
                  </div>

                  <div className="space-y-2.5 divide-y divide-slate-100 text-xs text-slate-700">
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Admission Registration</span>
                      <span className="font-bold text-slate-900">PKR 15,000</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Monthly Coaching Fee</span>
                      <span className="font-bold text-slate-900">PKR 16,000</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Comprehensive Notes & Solved Papers</span>
                      <span className="font-bold text-emerald-700">Included Free</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Weekly Grand Assessments</span>
                      <span className="font-bold text-emerald-700">Included Free</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePage('apply-online')}
                    className="w-full bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-bold py-2.5 rounded transition-colors shadow-sm"
                  >
                    Enroll for XI & XII
                  </button>
                </div>

                {/* Entry Test Wing (NUST / MDCAT / ECAT) */}
                <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[#e05626] text-xs font-bold uppercase tracking-wider">Top Engineering & Medical</span>
                    <h3 className="font-serif text-xl font-bold text-slate-900">NUST, MDCAT & ECAT</h3>
                    <p className="text-slate-500 text-xs">NET Series 1-4, MUET, NED, QUEST & Medical prep</p>
                  </div>

                  <div className="space-y-2.5 divide-y divide-slate-100 text-xs text-slate-700">
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Complete Session Course</span>
                      <span className="font-bold text-slate-900">PKR 45,000</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Director Prof. Niaz Dars Physics</span>
                      <span className="font-bold text-emerald-700">Special Lectures</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">20+ Full-Length Computer Mocks</span>
                      <span className="font-bold text-emerald-700">Included Free</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Hostel Accommodation Support</span>
                      <span className="font-bold text-slate-900">Available</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePage('apply-online')}
                    className="w-full bg-[#0b1c30] hover:bg-[#e05626] text-white text-xs font-bold py-2.5 rounded transition-colors"
                  >
                    Enroll for Entry Test
                  </button>
                </div>
              </div>

              {/* Scholarship Tiers */}
              <div className="bg-[#f8f9fa] border border-slate-200 rounded-sm p-8 space-y-6">
                <div>
                  <span className="text-[#e05626] text-xs font-bold uppercase tracking-widest">MERIT & FINANCIAL AID</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">Scholarship Policy 2026</h3>
                  <p className="text-slate-600 text-xs mt-1">We believe financial constraints should never stand between an extraordinary mind and world-class education.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 border border-slate-200 rounded-sm space-y-2">
                    <div className="text-2xl font-serif font-bold text-[#e05626]">100% Waiver</div>
                    <div className="font-bold text-xs text-slate-900">Presidential Gold Scholarship</div>
                    <p className="text-slate-600 text-xs leading-relaxed">Awarded to candidates scoring 90%+ in Board Exams or winning national/international science Olympiads.</p>
                  </div>

                  <div className="bg-white p-5 border border-slate-200 rounded-sm space-y-2">
                    <div className="text-2xl font-serif font-bold text-slate-800">50% Waiver</div>
                    <div className="font-bold text-xs text-slate-900">Academic Distinction Scholarship</div>
                    <p className="text-slate-600 text-xs leading-relaxed">Awarded to candidates scoring 85% to 89.9% in previous board examinations.</p>
                  </div>

                  <div className="bg-white p-5 border border-slate-200 rounded-sm space-y-2">
                    <div className="text-2xl font-serif font-bold text-slate-800">25% Waiver</div>
                    <div className="font-bold text-xs text-slate-900">Talent & Merit Scholarship</div>
                    <p className="text-slate-600 text-xs leading-relaxed">Awarded to candidates scoring 80% to 84.9% or excelling in national sports/debating competitions.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. FACULTY & STAFF DIRECTORY                                             */}
          {/* ========================================================================= */}
          {activePage === 'faculty-staff' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
              <div className="space-y-2">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>DISTINGUISHED PEDAGOGY</span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">
                  Faculty & Department Leadership
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Meet the master educators, research mentors, and university counselors dedicated to developing each scholar's potential.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {FALLBACK_FACULTY.map((fac) => (
                  <div key={fac.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <img 
                      src={fac.image} 
                      alt={fac.name} 
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#e05626] bg-orange-50 px-2 py-0.5 rounded">
                          {fac.dept}
                        </span>
                        <h3 className="font-serif font-bold text-slate-900 text-lg leading-snug">
                          {fac.name}
                        </h3>
                        <p className="text-[#0b1c30] text-xs font-semibold">
                          {fac.role}
                        </p>
                        <p className="text-slate-500 text-[11px] italic">
                          {fac.degrees}
                        </p>
                        <p className="text-slate-600 text-xs leading-relaxed pt-2">
                          {fac.bio}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Office Hours: Mon - Fri</span>
                        <button 
                          onClick={() => addNotification(`Inquiry regarding ${fac.name} forwarded to the academic registrar.`, 'info')}
                          className="text-[#e05626] hover:underline font-bold text-xs"
                        >
                          Contact Faculty
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button onClick={() => setActivePage('home')} className="text-slate-500 hover:text-slate-900 text-xs font-semibold">
                  ← Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ARTICLE READER MODAL (DETAILED STORY VIEW)                                */}
      {/* ========================================================================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in-50">
          <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-8 max-h-[94vh] flex flex-col">
            {/* Modal Header Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#f8f9fa] shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-[#e05626] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(selectedArticle.publishDate)}
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Story Content */}
            <div className="overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6">
              {/* Featured Image */}
              {selectedArticle.featuredImage && (
                <div className="relative h-64 sm:h-80 rounded-sm overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={selectedArticle.featuredImage}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Attribution */}
              <div className="space-y-3">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h1>

                {selectedArticle.author?.name && (
                  <div className="flex items-center gap-3 pt-2 border-y border-slate-100 py-3 text-xs text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-bold text-xs">
                      {selectedArticle.author.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{selectedArticle.author.name}</span>
                      <span className="text-slate-500 text-[11px]">{selectedArticle.author.role || 'Staff Contributor'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Lead Block */}
              {selectedArticle.summary && (
                <div className="bg-orange-50/60 border-l-4 border-[#e05626] p-4 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {selectedArticle.summary}
                </div>
              )}

              {/* Story Body */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {selectedArticle.content ? (
                  selectedArticle.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{selectedArticle.summary}</p>
                )}
              </div>

              {/* Photo Gallery if present */}
              {selectedArticle.gallery && selectedArticle.gallery.length > 0 && (
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#e05626]" />
                    <span>Associated Photo Gallery</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedArticle.gallery.map((imgItem, gIdx) => (
                      <div key={gIdx} className="overflow-hidden rounded-sm border border-slate-200 bg-slate-50">
                        <img src={imgItem.url} alt={imgItem.caption || 'Gallery photo'} className="w-full h-44 object-cover" />
                        {imgItem.caption && (
                          <div className="p-2.5 text-[11px] text-slate-600 italic bg-white border-t border-slate-100">
                            {imgItem.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-[#f8f9fa] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  addNotification('Article link copied to clipboard!', 'success');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-[#e05626]" />
                <span>Share Story</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setActivePage('apply-online');
                  }}
                  className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors"
                >
                  Apply to Academy
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

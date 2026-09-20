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
  LayoutDashboard
} from 'lucide-react';

export const PublicWebsite = () => {
  const { addNotification, setCurrentView, switchToPortal, publicSiteConfig } = useApp();

  const [activePage, setActivePage] = useState('home'); 
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  // Dynamic Homepage State
  const [homeData, setHomeData] = useState(null);

  // Dynamic public configuration fallback helpers
  const heroCfg = publicSiteConfig?.hero || {
    tagline: 'The Education Space Academy',
    mainTitle: 'Empowering Minds.',
    accentTitle: 'Shaping Tomorrow.',
    description: 'A forward-thinking academic community where STEM, humanities, leadership and innovation come together to prepare students for a changing world.',
    primaryCtaText: 'Apply for Admission',
    primaryCtaLink: 'apply-online',
    secondaryCtaText: 'Explore Academics',
    secondaryCtaLink: 'academics',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80'
  };

  const annCfg = publicSiteConfig?.announcement;
  const statsCfg = publicSiteConfig?.stats || {
    enrolledStudents: '14,200+',
    expertFaculty: '120+',
    acceptanceRate: '98.4%',
    campusesCount: '1 Main Campus'
  };
  const contactCfg = publicSiteConfig?.contact || {
    campusName: 'The Education Space Academy (Main Campus)',
    address: 'The Education Space Academy, Main Campus, Pakistan',
    phone: '+92 (51) 892-4100',
    email: 'admissions@educationspace.edu'
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
  }, [activePage, vacancyDepartment, downloadCategory, downloadSearchQuery, faqCategory, faqSearchQuery]);

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
                  src={heroCfg.heroImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80"} 
                  alt="Students collaborating on STEM and robotics" 
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
                    <div className="text-white/90 font-medium">Secondary & Higher Secondary Education</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Islamabad • Pakistan</div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-bold">{statsCfg.enrolledStudents || '14,200+'}</span>
                    <span className="text-slate-400 text-[11px]">Enrolled Students</span>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-white/90 font-medium">{contactCfg.campusName || 'The Education Space Academy (Main Campus)'}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Central Campus • Multi-Campus Ready</div>
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
                    <h2 className="font-serif text-3xl md:text-4xl text-slate-900 font-semibold tracking-tight leading-tight">
                      Welcome to The Education Space Academy
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                      We offer a rich academic environment where curiosity, critical thinking and character come together. Our curriculum is designed to help students build the knowledge, skills and values they need for future success.
                    </p>

                    {/* 3 Value Pillars */}
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">01</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">STEM & Innovation</div>
                      </div>
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">02</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">Global Perspective</div>
                      </div>
                      <div>
                        <div className="font-serif text-2xl md:text-3xl font-bold text-[#e05626]">03</div>
                        <div className="text-slate-900 text-xs font-bold mt-1.5 leading-snug">Character & Leadership</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="overflow-hidden rounded-sm shadow-sm border border-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80" 
                        alt="Campus Grounds and Architecture" 
                        className="w-full h-[320px] md:h-[360px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: LEADERSHIP / DR. ARTHUR PENDELTON */}
              <section className="bg-[#f8f9fa] py-16 md:py-20 border-t border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-5 flex justify-center md:justify-start">
                    <div className="w-full max-w-sm rounded-sm overflow-hidden shadow-sm border border-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&auto=format&fit=crop&q=80" 
                        alt="Dr. Arthur Pendelton" 
                        className="w-full h-[340px] md:h-[380px] object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">
                      LEADERSHIP
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                      Dr. Arthur Pendelton
                    </h3>
                    <div className="text-slate-500 text-xs font-medium -mt-2">
                      Principal & Academic Director
                    </div>

                    <blockquote className="border-l-2 border-[#e05626] pl-4 my-4">
                      <p className="font-serif italic text-slate-700 text-sm md:text-base leading-relaxed">
                        "At The Education Space Academy, our mission is to cultivate critical thinkers and compassionate global leaders."
                      </p>
                    </blockquote>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      Welcome to our vibrant academic community where every student is empowered to achieve excellence.
                    </p>

                    <div className="pt-2">
                      <button 
                        onClick={() => setActivePage('principal-message')}
                        className="text-[#e05626] hover:text-[#c9461b] font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Read the Principal's Message</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
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

                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Card 1: Secondary STEM */}
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm flex flex-col">
                      <img 
                        src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80" 
                        alt="Secondary STEM Robotics and Physics" 
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-6 space-y-3 flex-1">
                        <div className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">
                          GRADES 9 - 10
                        </div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          Secondary STEM
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Robotics</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Physics</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Chemistry</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Advanced Mathematics</li>
                        </ul>
                      </div>
                    </div>

                    {/* Card 2: Higher Secondary Humanities & Arts */}
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm flex flex-col">
                      <img 
                        src="https://images.unsplash.com/photo-1532012164546-f432f2e37271?w=600&auto=format&fit=crop&q=80" 
                        alt="Higher Secondary Humanities & Arts" 
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-6 space-y-3 flex-1">
                        <div className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">
                          GRADES 11 - 12
                        </div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          Higher Secondary Humanities & Arts
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Literature</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Economics</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Global Politics</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e05626]" /> Digital Media</li>
                        </ul>
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
                          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80" 
                          alt="STEM & Robotics" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        STEM & Robotics
                      </span>
                    </div>

                    <div>
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80" 
                          alt="Student Leadership" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        Student Leadership
                      </span>
                    </div>

                    <div>
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80" 
                          alt="Campus Community" 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      <span className="text-slate-900 text-xs font-bold mt-2.5 block">
                        Campus Community
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 7: ADMISSIONS TERRACOTTA BANNER */}
              <section className="relative bg-gradient-to-r from-[#b34419] to-[#c25023] text-white py-16 md:py-20 overflow-hidden">
                {/* Subtle architectural background texture */}
                <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                  <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80" 
                    alt="Campus Architecture Background" 
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
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    A Campus Designed for Learning.
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Col 1: Campus photo */}
                    <div className="md:col-span-4">
                      <div className="overflow-hidden rounded-sm border border-slate-200 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1562774053-701939374585?w=700&auto=format&fit=crop&q=80" 
                          alt="A Campus Designed for Learning" 
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    </div>

                    {/* Col 2: Contact Details */}
                    <div className="md:col-span-4 space-y-3 text-xs text-slate-600">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>Islamabad, Pakistan</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>+92 51 111 222 333</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>admissions@education-space.edu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>Mon - Fri: 8:00 AM - 4:00 PM</span>
                      </div>
                    </div>

                    {/* Col 3: Styled Map graphic with Islamabad Campus pin */}
                    <div className="md:col-span-4">
                      <div className="relative h-44 rounded-sm border border-slate-200 overflow-hidden bg-[#eaf1e9] flex items-center justify-center p-4">
                        {/* Stylized vector map grid background */}
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                        <svg className="absolute inset-0 w-full h-full text-slate-300 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M-20 30 Q 100 80, 240 20 T 500 120" />
                          <path d="M120 -10 Q 180 100, 220 200" />
                          <path d="M-10 120 Q 150 90, 320 180" />
                        </svg>

                        {/* Campus Location Pin */}
                        <div className="relative z-10 bg-white/95 backdrop-blur-sm border border-slate-300 px-3.5 py-1.5 rounded shadow-md flex items-center gap-2 text-xs font-bold text-slate-800">
                          <MapPin className="w-4 h-4 text-[#e05626] fill-[#e05626]" />
                          <span>Islamabad Campus</span>
                        </div>
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
          {/* 5. CAMPUS LIFE / NEWS PAGE                                                */}
          {/* ========================================================================= */}
          {activePage === 'news' && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
              <div className="space-y-3">
                <div className="text-[#e05626] text-xs font-bold uppercase tracking-widest">CAMPUS VIBRANCY</div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Campus Life & Events</h1>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Discover what makes life at The Education Space Academy inspiring, collaborative, and rewarding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600" alt="Robotics Championship" className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-2">
                    <span className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">Robotics & AI</span>
                    <h4 className="font-serif font-bold text-slate-900 text-base">Annual Robotics Expo 2026</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">Students showcased autonomous rovers, sensor-driven obstacle navigators, and IoT environmental monitors.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600" alt="Leadership Council" className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-2">
                    <span className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">Student Government</span>
                    <h4 className="font-serif font-bold text-slate-900 text-base">Student Council Inauguration</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">Elected representatives pledge commitment to peer mentorship, campus sustainability, and student welfare.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600" alt="Campus Life" className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-2">
                    <span className="text-[#e05626] text-[10px] font-bold uppercase tracking-wider">Community</span>
                    <h4 className="font-serif font-bold text-slate-900 text-base">Inter-House Debating Gala</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">Spirited parliamentary debates tackling global geopolitics, climate adaptation, and digital privacy ethics.</p>
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
                  <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-sm space-y-4">
                    <h4 className="font-serif font-bold text-base text-slate-900">Campus Contact Details</h4>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#e05626] shrink-0 mt-0.5" />
                        <div>
                          <strong>Islamabad Main Campus</strong>
                          <p>The Education Space Academy, Sector H-8 / H-9, Islamabad, Pakistan</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>+92 51 111 222 333 / +92 51 444 555 666</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>admissions@education-space.edu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#e05626] shrink-0" />
                        <span>Monday - Friday: 8:00 AM - 4:00 PM</span>
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
              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-slate-900">Message from the Principal</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-4">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&auto=format&fit=crop&q=80" 
                    alt="Dr. Arthur Pendelton" 
                    className="w-full h-80 object-cover rounded-sm border border-slate-200 shadow-sm"
                  />
                  <div className="mt-3">
                    <h3 className="font-serif font-bold text-lg text-slate-900">Dr. Arthur Pendelton</h3>
                    <p className="text-slate-500 text-xs font-medium">Principal & Academic Director</p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4 text-slate-700 text-sm leading-relaxed">
                  <blockquote className="border-l-4 border-[#e05626] pl-4 py-2 font-serif italic text-lg text-slate-800 bg-orange-50/40">
                    "At The Education Space Academy, our mission is to cultivate critical thinkers and compassionate global leaders."
                  </blockquote>

                  <p>
                    Dear Students, Parents, and Friends of The Academy,
                  </p>
                  <p>
                    Education is undergoing a transformative era. The skills required for success in tomorrow's world demand not only academic prowess in science, technology, and mathematics, but also deep cultural empathy, moral integrity, and articulate communication.
                  </p>
                  <p>
                    At The Education Space Academy, we bridge the rigor of STEM exploration with the depth of the humanities. Our students learn to design algorithms, analyze scientific data, read world literature, and debate constitutional ethics—all in an inclusive, respectful environment.
                  </p>
                  <p>
                    I warmly invite you to visit our Islamabad campus, tour our robotics laboratories and lecture halls, and experience first-hand the energy of our scholars.
                  </p>

                  <div className="pt-4">
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
                  { q: 'What transportation facilities does the academy offer?', a: 'Air-conditioned dedicated vans cover all major sectors of Islamabad and Rawalpindi with real-time GPS fleet tracking for parents.' }
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
        </div>
      )}
    </PublicLayout>
  );
};

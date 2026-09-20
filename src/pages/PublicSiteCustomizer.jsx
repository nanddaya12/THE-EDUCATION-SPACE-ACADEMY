import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Megaphone, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const PublicSiteCustomizer = () => {
  const { 
    publicSiteConfig, 
    updatePublicSiteConfig, 
    resetPublicSiteConfig, 
    setCurrentView,
    addNotification 
  } = useApp();

  const [formState, setFormState] = useState(() => JSON.parse(JSON.stringify(publicSiteConfig)));
  const [activeSection, setActiveSection] = useState('hero'); // 'hero' | 'announcement' | 'admissions' | 'contact' | 'stats'

  const handleSave = (e) => {
    e.preventDefault();
    updatePublicSiteConfig(formState);
  };

  const handleReset = () => {
    if (window.confirm('Reset public site customizer to original default branding and layout?')) {
      resetPublicSiteConfig();
      setFormState(JSON.parse(JSON.stringify(publicSiteConfig)));
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-[#0b1c30] text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#e05626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Public Website CMS Customizer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-serif">
              Live Public Site & Branding Editor
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Super Administrator controls to modify public headlines, announcement tickers, contact information, key statistics, and admissions campaign banners with real-time live synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('website')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-4 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#e05626]" />
              <span>View Live Public Site</span>
            </button>

            <button
              onClick={handleSave}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Publish Changes Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar for Sections */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'hero', label: 'Hero Banner & Tagline', icon: Sparkles, desc: 'Main headline, subtext, background image & CTAs' },
            { id: 'announcement', label: 'Live Announcement Bar', icon: Megaphone, desc: 'Emergency notice and event broadcast ticker' },
            { id: 'admissions', label: 'Admissions Campaign', icon: Calendar, desc: 'Application status, deadlines & eligibility' },
            { id: 'contact', label: 'Campus & Contact Details', icon: Building, desc: 'Address, phone, email & working hours' },
            { id: 'stats', label: 'School Key Metrics', icon: Award, desc: 'Enrollment counts, faculty & campus statistics' }
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-[#e05626]' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">{sec.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {sec.desc}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="pt-4">
            <button
              onClick={handleReset}
              className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 p-2.5 rounded-xl border border-dashed border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Defaults</span>
            </button>
          </div>
        </div>

        {/* Section Form Controls */}
        <div className="lg:col-span-9 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* 1. HERO SECTION CONTROLS */}
            {activeSection === 'hero' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#e05626]" />
                    <span>Hero Section & Academic Mission Statement</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls the primary visual showcase seen when visitors arrive on the academy website.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Academy Tagline / Overline</label>
                    <input
                      type="text"
                      value={formState.hero?.tagline || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, tagline: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={formState.hero?.primaryCtaText || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, primaryCtaText: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Main Heading (Line 1)</label>
                    <input
                      type="text"
                      value={formState.hero?.mainTitle || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, mainTitle: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Accent Heading (Line 2 - Highlighted)</label>
                    <input
                      type="text"
                      value={formState.hero?.accentTitle || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        hero: { ...formState.hero, accentTitle: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs text-[#e05626] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Hero Paragraph Description</label>
                  <textarea
                    rows={3}
                    value={formState.hero?.description || ''}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, description: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Hero Background Photo URL</label>
                  <input
                    type="url"
                    value={formState.hero?.heroImage || ''}
                    onChange={(e) => setFormState({
                      ...formState,
                      hero: { ...formState.hero, heroImage: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-mono"
                  />
                </div>

                {/* Hero Preview Snippet */}
                <div className="mt-4 p-4 rounded-xl bg-[#0b131e] text-white space-y-2 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-[#e05626]">Live Preview of Hero Content:</div>
                  <div className="text-lg font-serif">
                    {formState.hero?.mainTitle} <span className="text-[#e05626]">{formState.hero?.accentTitle}</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">{formState.hero?.description}</p>
                </div>
              </div>
            )}

            {/* 2. ANNOUNCEMENT BAR CONTROLS */}
            {activeSection === 'announcement' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#e05626]" />
                    <span>Top Announcement & Notice Banner</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Display an urgent or informational notification strip at the very top of the public website.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="ann_enabled"
                    checked={formState.announcement?.enabled}
                    onChange={(e) => setFormState({
                      ...formState,
                      announcement: { ...formState.announcement, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="ann_enabled" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Enable Live Announcement Banner on Public Website
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Fall 2026 Admissions Open"
                      value={formState.announcement?.badgeText || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        announcement: { ...formState.announcement, badgeText: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alert Style / Level</label>
                    <select
                      value={formState.announcement?.type || 'info'}
                      onChange={(e) => setFormState({
                        ...formState,
                        announcement: { ...formState.announcement, type: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="info">Standard Notice (Blue / Slate)</option>
                      <option value="warning">Important Announcement (Amber)</option>
                      <option value="urgent">Urgent / Priority Alert (Crimson / Coral)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Notice Message Text</label>
                  <textarea
                    rows={2}
                    placeholder="Enter the message text displayed in the banner..."
                    value={formState.announcement?.message || ''}
                    onChange={(e) => setFormState({
                      ...formState,
                      announcement: { ...formState.announcement, message: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Action Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Apply Now or Read Details"
                      value={formState.announcement?.linkText || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        announcement: { ...formState.announcement, linkText: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Page</label>
                    <select
                      value={formState.announcement?.linkPage || 'apply-online'}
                      onChange={(e) => setFormState({
                        ...formState,
                        announcement: { ...formState.announcement, linkPage: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    >
                      <option value="apply-online">Admissions Online Application</option>
                      <option value="academics">Academics Curriculum</option>
                      <option value="events">Academy Events & News</option>
                      <option value="contact">Contact & Inquiry Office</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ADMISSIONS BANNER CONTROLS */}
            {activeSection === 'admissions' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#e05626]" />
                    <span>Admissions Status & Cohort Eligibility</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Controls the global admissions campaign indicators across the public portal.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="adm_isOpen"
                    checked={formState.admissionsBanner?.isOpen}
                    onChange={(e) => setFormState({
                      ...formState,
                      admissionsBanner: { ...formState.admissionsBanner, isOpen: e.target.checked }
                    })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="adm_isOpen" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Admissions Currently Open & Accepting Inquiries
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Banner Headline</label>
                    <input
                      type="text"
                      value={formState.admissionsBanner?.statusText || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        admissionsBanner: { ...formState.admissionsBanner, statusText: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                    <input
                      type="text"
                      placeholder="e.g. October 15, 2026"
                      value={formState.admissionsBanner?.deadline || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        admissionsBanner: { ...formState.admissionsBanner, deadline: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Eligible Grades / Cohorts</label>
                  <input
                    type="text"
                    placeholder="e.g. Grade 6 through A-Levels / F.Sc Pre-Engineering"
                    value={formState.admissionsBanner?.gradesEligible || ''}
                    onChange={(e) => setFormState({
                      ...formState,
                      admissionsBanner: { ...formState.admissionsBanner, gradesEligible: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>
            )}

            {/* 4. CONTACT & CAMPUS DETAILS */}
            {activeSection === 'contact' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#e05626]" />
                    <span>Campus & Contact Office Details</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update phone lines, email addresses, and campus locations displayed on public contact pages and footers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Main Campus Name</label>
                    <input
                      type="text"
                      value={formState.contact?.campusName || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        contact: { ...formState.contact, campusName: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Public Helpline / Phone</label>
                    <input
                      type="text"
                      value={formState.contact?.phone || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        contact: { ...formState.contact, phone: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Admissions Email</label>
                    <input
                      type="email"
                      value={formState.contact?.email || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        contact: { ...formState.contact, email: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Office Visiting Hours</label>
                    <input
                      type="text"
                      value={formState.contact?.officeHours || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        contact: { ...formState.contact, officeHours: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Physical Campus Address</label>
                  <textarea
                    rows={2}
                    value={formState.contact?.address || ''}
                    onChange={(e) => setFormState({
                      ...formState,
                      contact: { ...formState.contact, address: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>
            )}

            {/* 5. KEY ACHIEVEMENT METRICS */}
            {activeSection === 'stats' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#e05626]" />
                    <span>School Statistics & Key Numbers</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Key numbers highlighted across the hero banner and about pages to demonstrate academy scale.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Enrolled Students Count</label>
                    <input
                      type="text"
                      value={formState.stats?.enrolledStudents || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        stats: { ...formState.stats, enrolledStudents: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Faculty Members Count</label>
                    <input
                      type="text"
                      value={formState.stats?.expertFaculty || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        stats: { ...formState.stats, expertFaculty: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Acceptance / Pass Rate</label>
                    <input
                      type="text"
                      value={formState.stats?.acceptanceRate || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        stats: { ...formState.stats, acceptanceRate: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-bold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Campus Branches Metric
                      <span className="text-[10px] text-slate-400 font-normal ml-1.5">(Currently 1 Main Campus; editable for future branches)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Main Campus"
                      value={formState.stats?.campusesCount || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        stats: { ...formState.stats, campusesCount: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant React state synchronization enabled</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

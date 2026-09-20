import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogoEmblem } from '../common/Logo';
import { 
  Menu, 
  X, 
  LogIn, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  LayoutDashboard,
  GraduationCap,
  Users,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  School,
  ExternalLink
} from 'lucide-react';

export const PublicLayout = ({ children, activePage, onNavigate }) => {
  const { setCurrentView, isAuthenticated, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const DESKTOP_NAV_LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About TES' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions-info', label: 'Admissions' },
    { id: 'news', label: 'News & Events' },
    { id: 'contact', label: 'Contact' }
  ];

  const MOBILE_NAV_LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About TES' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions-info', label: 'Admissions' },
    { id: 'news', label: 'News & Events' },
    { id: 'careers', label: 'Careers' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardView = (role) => {
    const roleViewMap = {
      SUPER_ADMIN: 'admin-dashboard',
      INSTITUTION_ADMIN: 'admin-dashboard',
      CAMPUS_ADMIN: 'admin-dashboard',
      TEACHER: 'teacher-portal',
      STUDENT: 'student-portal',
      PARENT: 'parent-portal',
      ACCOUNTANT: 'fee-management'
    };
    return roleViewMap[role] || 'admin-dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-body text-slate-900 antialiased selection:bg-[#e05626]/20 selection:text-[#e05626]">
      {/* Institutional Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0b1c30] border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/20 group-hover:border-[#e05626]/60 transition-colors">
              <LogoEmblem className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-sans font-black text-sm tracking-wider text-white uppercase leading-none">
                THE EDUCATION SPACE
              </div>
              <div className="text-[9px] font-bold text-slate-300 tracking-widest uppercase block mt-0.5">
                ACADEMY <span className="text-slate-500 font-normal">|</span> <span className="text-slate-400 font-normal lowercase tracking-normal">Excellence in STEM & Humanities</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            {DESKTOP_NAV_LINKS.map((link) => {
              const isActive = (
                (link.id === 'home' && activePage === 'home') ||
                (link.id === 'about' && (activePage === 'about' || activePage === 'principal-message' || activePage === 'faculty-staff')) ||
                (link.id === 'academics' && (activePage === 'academics' || activePage === 'fee-structure' || activePage === 'scholarships' || activePage === 'downloads')) ||
                (link.id === 'admissions-info' && (activePage === 'admissions-info' || activePage === 'apply-online')) ||
                (link.id === 'news' && (activePage === 'news' || activePage === 'events')) ||
                (link.id === 'contact' && activePage === 'contact')
              );

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`py-1 transition-colors relative ${
                    isActive 
                      ? 'text-[#e05626] font-bold border-b-2 border-[#e05626]' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => setCurrentView(getDashboardView(user.role))}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-all flex items-center gap-2"
                title={`Open your ${user.role} Dashboard`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#e05626]" />
                <span>Portal Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                title="Institutional Portal Login (Admin, Teacher, Student, Parent)"
              >
                <LogIn className="w-3.5 h-3.5 text-[#e05626]" />
                <span>Portal Login</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('apply-online')}
              className="bg-[#e05626] hover:bg-[#c94519] text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Apply Now</span>
            </button>
          </div>

          {/* Mobile Right: Apply + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('apply-online')}
              className="bg-[#e05626] text-white text-xs font-bold px-3 py-1.5 rounded"
            >
              Apply
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0b1c30] border-t border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {MOBILE_NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left py-2 text-slate-200 hover:text-[#e05626] font-semibold text-xs border-b border-slate-800/60"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-700/80 flex flex-col gap-2">
              <button
                onClick={() => setCurrentView('login')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2 rounded text-center flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#e05626]" />
                <span>Portal Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Public Page Content */}
      <main className="flex-1 bg-white">
        {children}
      </main>

      {/* Executive Dark Academy Footer */}
      <footer className="bg-[#0b131e] text-slate-300 text-xs border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="sm:col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/20">
                <LogoEmblem className="w-full h-full object-contain" />
              </div>
              <span className="font-sans font-black text-xs text-white tracking-wider uppercase block">
                THE EDUCATION SPACE <br /><span className="text-[10px] text-slate-400 font-normal">ACADEMY</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Excellence in STEM & Humanities. Preparing ambitious students for leadership in a changing world.
            </p>
          </div>

          {/* Academics Col */}
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">Academics</span>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-white">STEM & Robotics</button></li>
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-white">Humanities & Arts</button></li>
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-white">Academic Programs</button></li>
              <li><button onClick={() => handleNavClick('faculty-staff')} className="hover:text-white">Faculty Directory</button></li>
            </ul>
          </div>

          {/* Admissions Col */}
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">Admissions</span>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => handleNavClick('apply-online')} className="hover:text-white text-[#e05626]">Apply Online</button></li>
              <li><button onClick={() => handleNavClick('admissions-info')} className="hover:text-white">Admissions Process</button></li>
              <li><button onClick={() => handleNavClick('fee-structure')} className="hover:text-white">Fees & Financial Aid</button></li>
              <li><button onClick={() => handleNavClick('fee-structure')} className="hover:text-white">Scholarships</button></li>
            </ul>
          </div>

          {/* Campus Life Col */}
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">Campus Life</span>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => handleNavClick('news')} className="hover:text-white">Student Life</button></li>
              <li><button onClick={() => handleNavClick('news')} className="hover:text-white">Clubs & Activities</button></li>
              <li><button onClick={() => handleNavClick('academics')} className="hover:text-white">Campus Facilities</button></li>
              <li><button onClick={() => handleNavClick('careers')} className="hover:text-white">Career Opportunities</button></li>
            </ul>
          </div>

          {/* About Col */}
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">About</span>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => handleNavClick('about')} className="hover:text-white">Our Mission</button></li>
              <li><button onClick={() => handleNavClick('faculty-staff')} className="hover:text-white">Our Team</button></li>
              <li><button onClick={() => handleNavClick('principal-message')} className="hover:text-white">Principal's Address</button></li>
              <li><button onClick={() => handleNavClick('news')} className="hover:text-white">News & Updates</button></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">Contact</span>
            <ul className="space-y-2.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#e05626]" /> +92 51 111 222 333</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#e05626]" /> admissions@education-space.edu</li>
              <li className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#e05626] shrink-0 mt-0.5" /> Islamabad, Pakistan</li>
            </ul>
          </div>
        </div>

        {/* Subfooter */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>© 2026 The Education Space Academy. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNavClick('about')} className="hover:text-white">Privacy</button>
            <button onClick={() => handleNavClick('about')} className="hover:text-white">Terms</button>
            <button onClick={() => handleNavClick('faqs')} className="hover:text-white">Help & FAQs</button>
            <button 
              onClick={() => setCurrentView('login')} 
              className="text-[#e05626] hover:underline font-bold flex items-center gap-1"
            >
              <span>ERP Portal Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    setCurrentView, 
    userRole, 
    setUserRole, 
    setModalType, 
    setIsModalOpen,
    isAuthenticated,
    user,
    handleLogout
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Landing Page', icon: Sparkles },
    { id: 'public-admissions', label: 'Online Admissions', icon: UserPlus },
    { id: 'student-hub', label: 'Student Hub', icon: GraduationCap },
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-courses', label: 'Course Catalog', icon: BookOpen },
    { id: 'admin-attendance', label: 'Attendance Tracker', icon: UserCheck },
    { id: 'admin-roles', label: 'Role Permissions', icon: ShieldCheck },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md w-full top-0 sticky border-b border-slate-200 z-40 transition-all duration-300 shadow-sm">
      <div className="flex justify-between items-center h-[76px] px-4 md:px-8 max-w-container-max mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="group cursor-pointer"
          title="The Education Space Academy"
        >
          <Logo size="md" subtitle="ACADEMY PORTAL" />
        </div>

        {/* Desktop View Quick Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft font-bold'
                    : 'text-slate-600 hover:text-primary hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role & Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">{user?.fullName || 'Authenticated User'}</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                  {userRole}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5"
                title="Log Out of ERP"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('login')}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-soft transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to ERP</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

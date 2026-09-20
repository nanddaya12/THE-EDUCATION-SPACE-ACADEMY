import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropdown } from '../ui/Dropdown';
import { Logo } from '../common/Logo';
import { CommandSearch } from '../ui/CommandSearch';
import { 
  GraduationCap, 
  Building2, 
  Calendar, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Menu,
  CheckCheck,
  Sparkles,
  BookOpen,
  School
} from 'lucide-react';

export const ErpTopBar = ({ onToggleSidebar }) => {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    userRole, 
    handleLogout, 
    switchToSuperAdmin,
    notifications,
    addNotification
  } = useApp();

  const [selectedCampus, setSelectedCampus] = useState('CAMP-MAIN');
  const [selectedSession, setSelectedSession] = useState('2026-2027');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifCategory, setNotifCategory] = useState('ALL'); // ALL, ACADEMIC, FINANCE, SYSTEM
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const campuses = [
    { code: 'CAMP-MAIN', name: 'TES Main Campus' },
    { code: 'CAMP-FUTURE', name: '+ Future Branch (Expandable)' }
  ];

  const sessions = [
    { code: '2026-2027', name: 'Academic Year 2026–2027' },
    { code: '2025-2026', name: 'Academic Year 2025–2026' }
  ];

  const isImpersonating = userRole !== 'SUPER_ADMIN';

  const userMenuItems = [
    ...(isImpersonating ? [
      { label: 'Exit Preview Mode', icon: ShieldCheck, onClick: switchToSuperAdmin }
    ] : []),
    { label: 'My Profile', icon: User, onClick: () => setCurrentView(user?.role === 'ACCOUNTANT' ? 'fee-management' : 'student-hub') },
    { label: 'Users & Access', icon: ShieldCheck, onClick: () => { if (isImpersonating) switchToSuperAdmin(); setCurrentView('site-profiles'); } },
    { label: 'System Configuration', icon: Settings, onClick: () => setCurrentView('system-config') },
    { label: 'Log Out of ERP', icon: LogOut, onClick: handleLogout }
  ];

  // Categorized real notification data
  const DEFAULT_NOTIFS = [
    { id: 'n-1', category: 'ACADEMIC', title: 'Grade 11 STEM Lab Scheduled', desc: 'Robotics practical scheduled for Thursday 08:30 AM in Lab 2', time: '10m ago', read: false },
    { id: 'n-2', category: 'FINANCE', title: 'September Challan Batch Generated', desc: '142 monthly tuition vouchers published to parent accounts', time: '1h ago', read: false },
    { id: 'n-3', category: 'SYSTEM', title: 'Security Audit Log Synced', desc: 'Session tokens verified across active institutional devices', time: '3h ago', read: true },
    { id: 'n-4', category: 'ACADEMIC', title: 'Mid-Term Exam Transcripts Ready', desc: 'Subject grades ready for final departmental sign-off', time: '1d ago', read: true }
  ];

  const [notifsList, setNotifsList] = useState(DEFAULT_NOTIFS);

  const filteredNotifs = notifCategory === 'ALL' 
    ? notifsList 
    : notifsList.filter(n => n.category === notifCategory);

  const unreadCount = notifsList.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifsList(notifsList.map(n => ({ ...n, read: true })));
    addNotification('All notifications marked as read', 'info');
  };

  return (
    <>
      {/* 1. HIGH-CONTRAST IMPERSONATION / PREVIEW BANNER */}
      {isImpersonating && (
        <div className="bg-[#b45309] text-white px-4 md:px-8 py-2.5 text-xs flex items-center justify-between border-b border-amber-600 shadow-md sticky top-0 z-50 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider uppercase text-amber-200 mr-2 text-[11px]">
                ⚠ PREVIEW MODE
              </span>
              <span className="text-white/90">
                You are viewing TES as: <strong className="text-white font-bold">{user?.fullName || 'Portal User'}</strong> · <span className="font-mono font-bold uppercase tracking-wider">{userRole}</span>
              </span>
            </div>
          </div>

          <button
            onClick={switchToSuperAdmin}
            className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow transition-all flex items-center gap-2 border border-white/20"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Exit Preview Mode</span>
          </button>
        </div>
      )}

      {/* 2. MAIN ERP DESKTOP TOPBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-[68px] px-4 md:px-8 flex items-center justify-between shadow-xs">
        {/* Left: Hamburger + Brand + Institutional Context Pickers */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Hamburger toggle button */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* TES ERP Logo */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="cursor-pointer group flex items-center gap-2.5"
            title="Go to Academy Public Website"
          >
            <Logo size="sm" subtitle="ENTERPRISE ERP" />
          </div>

          {/* Campus Context Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedCampus}
              onChange={(e) => {
                setSelectedCampus(e.target.value);
                addNotification(`Campus scope: ${e.target.value}`, 'info');
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
            >
              {campuses.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>

          {/* Academic Session Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                addNotification(`Academic session switched to ${e.target.value}`, 'info');
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
            >
              {sessions.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Right: Search + Notification Bell + Help + Avatar */}
        <div className="flex items-center gap-2.5 md:gap-3">
          {/* Public Website Escape Button */}
          <button
            onClick={() => setCurrentView('website')}
            className="hidden xl:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 transition-colors"
            title="View Public Academy Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            <span>Public Website</span>
          </button>

          {/* Global Search Button (Ctrl + K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Search TES...</span>
            <kbd className="hidden sm:inline bg-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-600">
              Ctrl K
            </kbd>
          </button>

          {/* Notification Center Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors"
              title="Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in-50 duration-150 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
                  {['ALL', 'ACADEMIC', 'FINANCE', 'SYSTEM'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNotifCategory(cat)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        notifCategory === cat 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {filteredNotifs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notifications in this category</p>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-slate-50 border-primary/20 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] mb-0.5">
                          <span className={n.read ? 'text-slate-700' : 'text-slate-900'}>{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{n.desc}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setCurrentView('admin-dashboard');
                    }}
                    className="text-[11px] text-primary hover:underline font-bold"
                  >
                    View All Institutional Activity →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => addNotification('TES Academy ERP Help Desk: support@educationspace.edu', 'info')}
            className="hidden sm:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Help Desk & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Menu Avatar */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200/80 p-1.5 rounded-xl border border-slate-200 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#0b1c30] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <span className="font-bold text-xs text-slate-900 block leading-tight truncate max-w-[120px]">
                    {user?.fullName || 'Super Administrator'}
                  </span>
                  <span className="text-[10px] font-semibold text-primary block leading-tight">
                    {userRole}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            }
            items={userMenuItems}
          />
        </div>
      </header>

      {/* 3. GLOBAL COMMAND SEARCH MODAL (Ctrl + K) */}
      <CommandSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

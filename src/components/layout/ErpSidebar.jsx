import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  UserCog, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Globe, 
  Settings, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Sparkles, 
  School,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FolderLock,
  Layers,
  Bell,
  Briefcase,
  Sliders,
  LogOut
} from 'lucide-react';

export const ErpSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, user, userRole, handleLogout } = useApp();

  const role = (user?.role || userRole || 'STUDENT').toUpperCase();

  // Collapsed group state persisted in localStorage
  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_sidebar_collapsed_groups');
      return saved ? JSON.parse(saved) : {
        'COMMUNICATION': true,
        'ANALYTICS': false,
        'SYSTEM': false
      };
    } catch (e) {
      return {};
    }
  });

  const toggleGroup = (groupId) => {
    const updated = { ...collapsedGroups, [groupId]: !collapsedGroups[groupId] };
    setCollapsedGroups(updated);
    try {
      localStorage.setItem('edu_sidebar_collapsed_groups', JSON.stringify(updated));
    } catch (e) {}
  };

  // 1. Role-Adaptive Navigation Architecture
  const getNavStructure = () => {
    if (role === 'STUDENT') {
      return {
        title: 'Student Portal',
        badge: 'Learner',
        isFlat: true,
        items: [
          { id: 'student-portal', label: 'Overview', icon: LayoutDashboard },
          { id: 'student-hub', label: 'Interactive Learning Hub', icon: GraduationCap },
          { id: 'timetable', label: 'My Timetable', icon: Calendar },
          { id: 'homework', label: 'Homework & Tasks', icon: FileText },
          { id: 'admin-courses', label: 'My Enrolled Courses', icon: BookOpen },
          { id: 'documents', label: 'Certificates & Docs', icon: Award },
        ]
      };
    }

    if (role === 'PARENT') {
      return {
        title: 'Parent Portal',
        badge: 'Guardian',
        isFlat: true,
        items: [
          { id: 'parent-portal', label: 'Parent Dashboard', icon: School },
          { id: 'timetable', label: 'Children Schedule', icon: Calendar },
          { id: 'homework', label: 'Assignments & Progress', icon: FileText },
          { id: 'documents', label: 'Grade Transcripts', icon: Award },
        ]
      };
    }

    if (role === 'TEACHER' || role === 'INSTRUCTOR') {
      return {
        title: 'Faculty Portal',
        badge: 'Teacher',
        isFlat: true,
        items: [
          { id: 'teacher-portal', label: 'Dashboard & Workspace', icon: LayoutDashboard },
          { id: 'timetable', label: 'My Schedule', icon: Calendar },
          { id: 'students', label: 'Student Roster', icon: Users },
          { id: 'admin-attendance', label: 'Attendance Marking', icon: UserCheck },
          { id: 'homework', label: 'Homework & Grading', icon: FileText },
          { id: 'academics', label: 'Academics & Syllabus', icon: BookOpen },
        ]
      };
    }

    if (role === 'ACCOUNTANT' || role === 'CASHIER' || role === 'FINANCE_MANAGER') {
      return {
        title: 'Accounts & Finance',
        badge: 'Finance Officer',
        isFlat: true,
        items: [
          { id: 'fee-management', label: 'Fee Management & Challans', icon: DollarSign },
          { id: 'financial-reports', label: 'Financial Reports & Ledger', icon: TrendingUp },
          { id: 'students', label: 'Student Accounts', icon: Users },
          { id: 'admissions', label: 'Admissions Desk', icon: UserPlus },
          { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
          { id: 'documents', label: 'Receipts & Documents', icon: Award },
        ]
      };
    }

    // 2. Super Admin & Executive Multi-Group Navigation
    return {
      title: 'Academy Management',
      badge: role.replace('_', ' '),
      isFlat: false,
      groups: [
        {
          id: 'OVERVIEW',
          name: 'OVERVIEW',
          items: [
            { id: 'admin-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }
          ]
        },
        {
          id: 'PEOPLE',
          name: 'PEOPLE & DIRECTORY',
          items: [
            { id: 'students', label: 'Students Directory', icon: Users },
            { id: 'site-profiles', label: 'Parents & Guardians', icon: Users },
            { id: 'academics', label: 'Faculty & Instructors', icon: GraduationCap }
          ]
        },
        {
          id: 'ADMISSIONS',
          name: 'ADMISSIONS DESK',
          items: [
            { id: 'admissions', label: 'Applications Pipeline', icon: UserPlus },
            { id: 'public-admissions', label: 'Online Inquiries Portal', icon: FileText }
          ]
        },
        {
          id: 'ACADEMICS',
          name: 'ACADEMICS',
          items: [
            { id: 'admin-courses', label: 'Courses & Curriculum', icon: BookOpen },
            { id: 'timetable', label: 'Master Timetables', icon: Calendar },
            { id: 'homework', label: 'Homework & Assignments', icon: FileText }
          ]
        },
        {
          id: 'OPERATIONS',
          name: 'OPERATIONS',
          items: [
            { id: 'admin-attendance', label: 'Attendance Tracking', icon: UserCheck },
            { id: 'documents', label: 'Certificates & Documents', icon: Award }
          ]
        },
        {
          id: 'FINANCE',
          name: 'FINANCE & ACCOUNTS',
          items: [
            { id: 'fee-management', label: 'Fee Challans & Billing', icon: DollarSign },
            { id: 'financial-reports', label: 'Financial Reports & Ledger', icon: TrendingUp }
          ]
        },
        {
          id: 'ANALYTICS',
          name: 'ANALYTICS & AUDIT',
          items: [
            { id: 'reports', label: 'Enterprise Reports', icon: BarChart3 },
            { id: 'analytics', label: 'Executive Analytics', icon: TrendingUp }
          ]
        },
        {
          id: 'GOVERNANCE',
          name: 'GOVERNANCE & SECURITY',
          items: [
            { id: 'site-profiles', label: 'Users & Access', icon: UserCog },
            { id: 'admin-roles', label: 'Roles & Permissions', icon: ShieldCheck, badge: '39 Roles' },
            { id: 'audit-logs', label: 'System Audit Logs', icon: FolderLock }
          ]
        },
        {
          id: 'SYSTEM',
          name: 'SYSTEM & PUBLIC CMS',
          items: [
            { id: 'public-site-customizer', label: 'Public Site Customizer', icon: Sparkles },
            { id: 'system-config', label: 'System Configuration', icon: Settings }
          ]
        }
      ]
    };
  };

  const nav = getNavStructure();

  const handleItemClick = (id) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  const renderItemButton = (item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id + item.label}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium tracking-normal transition-colors relative group ${
          isActive
            ? 'bg-white/10 text-white font-bold shadow-xs'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
      >
        {/* Subtle orange left active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#e05626] rounded-r-full" />
        )}
        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#e05626]' : 'text-slate-400 group-hover:text-slate-200'}`} />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e05626]/20 text-[#e05626] border border-[#e05626]/30">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-40
        w-[260px] bg-[#0b1c30] text-white flex-shrink-0 flex flex-col justify-between p-3.5 border-r border-slate-800/80 
        transition-transform duration-200 ease-in-out shadow-xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-3">
          {/* Navigation Group Header */}
          <div className="px-2 pt-1 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e05626]">
                {nav.title}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Authorized Workspace
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase">
              {nav.badge}
            </span>
          </div>

          {/* Navigation Items Area */}
          <nav className="space-y-3 overflow-y-auto max-h-[calc(100vh-175px)] pr-1 custom-scrollbar">
            {nav.isFlat ? (
              <div className="space-y-1">
                {nav.items.map(renderItemButton)}
              </div>
            ) : (
              nav.groups.map((group) => {
                const isCollapsed = !!collapsedGroups[group.id];
                const hasActiveChild = group.items.some(it => it.id === currentView);

                return (
                  <div key={group.id} className="space-y-1">
                    {/* Collapsible Group Header Accordion */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <span className={hasActiveChild ? 'text-white' : ''}>{group.name}</span>
                      <span className="text-slate-500">
                        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {/* Group Items */}
                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-1 animate-in fade-in duration-100">
                        {group.items.map(renderItemButton)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </div>

        {/* Institutional Authority Footer */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="p-2.5 bg-[#081524] rounded-xl border border-slate-800/90 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-300 font-semibold text-[11px] truncate">{role} Mode</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              TES ERP
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

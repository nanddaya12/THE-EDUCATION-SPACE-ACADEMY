import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Calendar, 
  FileText, 
  Award, 
  Menu, 
  DollarSign, 
  Users, 
  CheckSquare, 
  LayoutDashboard,
  UserCheck
} from 'lucide-react';

export const MobileNavigation = ({ onOpenMore }) => {
  const { currentView, setCurrentView, user, userRole } = useApp();

  const role = (user?.role || userRole || 'STUDENT').toUpperCase();

  const getMobileTabs = () => {
    if (role === 'STUDENT') {
      return [
        { id: 'student-portal', label: 'Home', icon: Home },
        { id: 'timetable', label: 'Schedule', icon: Calendar },
        { id: 'homework', label: 'Tasks', icon: FileText },
        { id: 'documents', label: 'Transcripts', icon: Award },
        { id: 'MORE', label: 'More', icon: Menu, action: onOpenMore }
      ];
    }

    if (role === 'PARENT') {
      return [
        { id: 'parent-portal', label: 'Home', icon: Home },
        { id: 'timetable', label: 'Schedule', icon: Calendar },
        { id: 'homework', label: 'Progress', icon: FileText },
        { id: 'documents', label: 'Fees & Docs', icon: DollarSign },
        { id: 'MORE', label: 'More', icon: Menu, action: onOpenMore }
      ];
    }

    if (role === 'TEACHER' || role === 'INSTRUCTOR') {
      return [
        { id: 'teacher-portal', label: 'Dashboard', icon: Home },
        { id: 'students', label: 'Roster', icon: Users },
        { id: 'admin-attendance', label: 'Attendance', icon: UserCheck },
        { id: 'homework', label: 'Homework', icon: FileText },
        { id: 'MORE', label: 'More', icon: Menu, action: onOpenMore }
      ];
    }

    // Admin & Finance
    return [
      { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'fee-management', label: 'Fees', icon: DollarSign },
      { id: 'admin-attendance', label: 'Attendance', icon: UserCheck },
      { id: 'MORE', label: 'More', icon: Menu, action: onOpenMore }
    ];
  };

  const tabs = getMobileTabs();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b1c30] border-t border-slate-800 flex items-center justify-around px-2 py-1.5 shadow-2xl safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id !== 'MORE' && currentView === tab.id;

        return (
          <button
            key={tab.label}
            onClick={() => {
              if (tab.action) {
                tab.action();
              } else {
                setCurrentView(tab.id);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive 
                ? 'text-[#e05626]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#e05626]' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

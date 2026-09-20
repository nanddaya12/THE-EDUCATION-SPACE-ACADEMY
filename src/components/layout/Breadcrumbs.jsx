import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export const Breadcrumbs = () => {
  const { currentView, setCurrentView } = useApp();

  // Multi-level trail mapping
  const trailMap = {
    'admin-dashboard': [
      { label: 'Executive Overview', view: 'admin-dashboard' }
    ],
    'students': [
      { label: 'People', view: 'students' },
      { label: 'Student Directory', view: 'students' }
    ],
    'admissions': [
      { label: 'Admissions', view: 'admissions' },
      { label: 'Applications Pipeline', view: 'admissions' }
    ],
    'academics': [
      { label: 'Academics', view: 'academics' },
      { label: 'Curriculum & Syllabi', view: 'academics' }
    ],
    'admin-courses': [
      { label: 'Academics', view: 'academics' },
      { label: 'Course Catalog', view: 'admin-courses' }
    ],
    'admin-attendance': [
      { label: 'Operations', view: 'admin-attendance' },
      { label: 'Attendance Tracking', view: 'admin-attendance' }
    ],
    'attendance': [
      { label: 'Operations', view: 'admin-attendance' },
      { label: 'Attendance Tracking', view: 'admin-attendance' }
    ],
    'timetable': [
      { label: 'Academics', view: 'timetable' },
      { label: 'Master Timetables', view: 'timetable' }
    ],
    'homework': [
      { label: 'Academics', view: 'homework' },
      { label: 'Homework & Assignments', view: 'homework' }
    ],
    'fee-management': [
      { label: 'Finance', view: 'fee-management' },
      { label: 'Fee Challans & Billing', view: 'fee-management' }
    ],
    'financial-reports': [
      { label: 'Finance', view: 'financial-reports' },
      { label: 'Financial Reports & Ledger', view: 'financial-reports' }
    ],
    'admin-roles': [
      { label: 'Governance', view: 'site-profiles' },
      { label: 'Roles & Security (39 Roles)', view: 'admin-roles' }
    ],
    'site-profiles': [
      { label: 'Governance', view: 'site-profiles' },
      { label: 'Users & Access', view: 'site-profiles' }
    ],
    'audit-logs': [
      { label: 'Governance', view: 'site-profiles' },
      { label: 'Audit Logs', view: 'audit-logs' }
    ],
    'public-site-customizer': [
      { label: 'System', view: 'system-config' },
      { label: 'Public Site Customizer', view: 'public-site-customizer' }
    ],
    'system-config': [
      { label: 'System', view: 'system-config' },
      { label: 'System Configuration', view: 'system-config' }
    ],
    'reports': [
      { label: 'Analytics', view: 'reports' },
      { label: 'Enterprise Reports', view: 'reports' }
    ],
    'analytics': [
      { label: 'Analytics', view: 'analytics' },
      { label: 'Executive Analytics', view: 'analytics' }
    ],
    'documents': [
      { label: 'Operations', view: 'documents' },
      { label: 'Certificates & Documents', view: 'documents' }
    ],
    'student-portal': [
      { label: 'Student Workspace', view: 'student-portal' },
      { label: 'Today\'s Work', view: 'student-portal' }
    ],
    'parent-portal': [
      { label: 'Parent Workspace', view: 'parent-portal' },
      { label: 'Child Academic Overview', view: 'parent-portal' }
    ],
    'teacher-portal': [
      { label: 'Faculty Workspace', view: 'teacher-portal' },
      { label: 'Teaching Schedule & Roll Call', view: 'teacher-portal' }
    ]
  };

  const currentTrail = trailMap[currentView] || [{ label: 'Overview', view: 'admin-dashboard' }];
  const currentTitle = currentTrail[currentTrail.length - 1].label;
  const parentTitle = currentTrail.length > 1 ? currentTrail[currentTrail.length - 2].label : 'Dashboard';
  const parentView = currentTrail.length > 1 ? currentTrail[currentTrail.length - 2].view : 'admin-dashboard';

  return (
    <div className="mb-4">
      {/* Mobile Back Button: ← [Parent] */}
      <div className="flex sm:hidden items-center">
        <button
          onClick={() => setCurrentView(parentView)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#e05626]" />
          <span>Back to {parentTitle}</span>
        </button>
      </div>

      {/* Desktop Multi-Level Clickable Trail */}
      <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium px-0.5">
        <button 
          onClick={() => setCurrentView('admin-dashboard')} 
          className="hover:text-slate-700 flex items-center gap-1 transition-colors"
          title="Return to Home Dashboard"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Portal</span>
        </button>

        {currentTrail.map((crumb, idx) => {
          const isLast = idx === currentTrail.length - 1;
          return (
            <React.Fragment key={crumb.label + idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {isLast ? (
                <span className="text-slate-900 font-bold" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => setCurrentView(crumb.view)}
                  className="hover:text-slate-700 transition-colors"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

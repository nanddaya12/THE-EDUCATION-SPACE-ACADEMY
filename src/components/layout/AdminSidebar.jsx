import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';

export const AdminSidebar = () => {
  const { currentView, setCurrentView } = useApp();

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-courses', label: 'Courses', icon: BookOpen },
    { id: 'admin-attendance', label: 'Attendance', icon: UserCheck },
    { id: 'admin-roles', label: 'Role & Permissions', icon: ShieldCheck },
    { id: 'student-hub', label: 'Student Portal', icon: GraduationCap },
  ];

  return (
    <aside className="w-[260px] bg-admin-sidebar text-white min-h-[calc(100vh-76px)] flex-shrink-0 flex flex-col justify-between p-4 border-r border-slate-800 hidden md:flex">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Admin Management
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all relative ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile Box */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-primary/40"
          />
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">
              Admin Coordinator
            </span>
            <span className="text-[10px] font-medium text-slate-400 block truncate">
              admin@educationspace.edu
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

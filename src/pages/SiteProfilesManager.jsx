import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  BookOpen, 
  School, 
  DollarSign, 
  X, 
  Check, 
  Plus, 
  AlertTriangle,
  KeyRound,
  Fingerprint,
  Clock,
  Globe2,
  FileText,
  Lock,
  Unlock,
  Shield,
  Laptop,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';

export const SiteProfilesManager = () => {
  const { 
    siteProfiles, 
    addProfile, 
    updateProfile, 
    deleteProfile, 
    impersonateProfile, 
    user,
    roles,
    setCurrentView,
    addNotification 
  } = useApp();

  // Specification Section 13: Navigation: Users, Roles, Permissions, Access Requests, Sessions, Audit Logs, Impersonation
  const [govTab, setGovTab] = useState('users');

  // Users Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT' | 'STAFF'
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const [newProfileForm, setNewProfileForm] = useState({
    fullName: '',
    email: '',
    role: 'STUDENT',
    roleCategory: 'Portal',
    phone: '',
    identifier: '',
    department: 'General Academics',
    gradeOrBatch: 'Batch 2026-A',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  });

  // Roles Tab State
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [roleSearch, setRoleSearch] = useState('');

  // Permissions Tab State
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState('TEACHER');
  const [permissionScope, setPermissionScope] = useState('Assigned Classes');

  // Access Requests State
  const [accessRequests, setAccessRequests] = useState([
    { id: 'req-1', user: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@tes.edu', requestedRole: 'HEAD_OF_DEPARTMENT', currentRole: 'TEACHER', department: 'Natural Sciences', reason: 'Assigned interim lead for Grade 11-12 curriculum review committee', date: '2026-09-19', status: 'Pending' },
    { id: 'req-2', user: 'Carlos Rivera', email: 'carlos.rivera@gmail.com', requestedRole: 'PARENT', currentRole: 'PARENT', department: 'Student Care', reason: 'Adding second child (Lucas Rivera) to parent portal linking', date: '2026-09-17', status: 'Pending' },
    { id: 'req-3', user: 'Mark Sterling', email: 'm.sterling@tes.edu', requestedRole: 'FINANCE_MANAGER', currentRole: 'ACCOUNTANT', department: 'Bursar Office', reason: 'Authority to sign off on semester fee discount schedules', date: '2026-09-14', status: 'Approved' }
  ]);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', user: user?.name || 'Administrator', email: user?.email || 'admin@tes.edu', role: user?.role || 'SUPER_ADMIN', ip: '192.168.1.104', location: 'TES Main Campus (Administrative Suite)', device: 'Desktop - Chrome on Windows 11', lastActive: 'Just now', isCurrent: true },
    { id: 'sess-2', user: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@tes.edu', role: 'TEACHER', ip: '10.0.4.15', location: 'Science Lab 2', device: 'Tablet - iPad Safari', lastActive: '12 mins ago', isCurrent: false },
    { id: 'sess-3', user: 'Robert Rivera', email: 'robert.rivera@gmail.com', role: 'PARENT', ip: '203.135.44.82', location: 'Islamabad, PK', device: 'Mobile - TES iOS App', lastActive: '45 mins ago', isCurrent: false },
    { id: 'sess-4', user: 'Alex Rivera', email: 'alex.rivera@edu.com', role: 'STUDENT', ip: '10.0.8.91', location: 'Campus Wi-Fi (Library Zone)', device: 'Laptop - Chrome on MacOS', lastActive: '2 hours ago', isCurrent: false }
  ]);

  // Filter profiles
  const filteredProfiles = (siteProfiles || []).filter(p => {
    const matchesSearch = (p.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.identifier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesRole = true;
    if (roleFilter === 'STUDENT') matchesRole = p.role === 'STUDENT';
    else if (roleFilter === 'TEACHER') matchesRole = p.role === 'TEACHER' || p.role === 'INSTRUCTOR';
    else if (roleFilter === 'PARENT') matchesRole = p.role === 'PARENT';
    else if (roleFilter === 'STAFF') matchesRole = p.role !== 'STUDENT' && p.role !== 'TEACHER' && p.role !== 'PARENT';

    let matchesStatus = true;
    if (statusFilter !== 'ALL') matchesStatus = p.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role Counts
  const studentCount = (siteProfiles || []).filter(p => p.role === 'STUDENT').length;
  const teacherCount = (siteProfiles || []).filter(p => p.role === 'TEACHER' || p.role === 'INSTRUCTOR').length;
  const parentCount = (siteProfiles || []).filter(p => p.role === 'PARENT').length;
  const staffCount = (siteProfiles || []).filter(p => p.role !== 'STUDENT' && p.role !== 'TEACHER' && p.role !== 'PARENT').length;

  // 39 Institutional Roles list with hierarchy & division (Specification Section 13)
  const institutionalRoles = [
    // Executive (Level 1)
    { id: 'r_super_admin', name: 'SUPER_ADMIN', division: 'Executive', level: 'Level 1 - Apex Authority', description: 'Complete institutional governance over all academic, administrative, and configuration domains.', protected: true },
    { id: 'r_institution_admin', name: 'INSTITUTION_ADMIN', division: 'Executive', level: 'Level 1 - Executive', description: 'Enterprise administrative control across campuses and institutional resources.' },
    { id: 'r_campus_admin', name: 'CAMPUS_ADMIN', division: 'Executive', level: 'Level 2 - Campus Leadership', description: 'Campus principal and operational lead managing localized school assets.' },
    { id: 'r_dean', name: 'DEAN', division: 'Executive', level: 'Level 2 - Academic Leadership', description: 'Dean of academic faculties, curriculum development, and accreditation oversight.' },

    // Academic & Faculty (Level 3)
    { id: 'r_hod', name: 'HEAD_OF_DEPARTMENT', division: 'Academic', level: 'Level 3 - Department Lead', description: 'Curricular lead overseeing departmental syllabi, teaching rosters, and exam moderations.' },
    { id: 'r_teacher', name: 'TEACHER', division: 'Faculty', level: 'Level 4 - Faculty', description: 'Classroom instructor managing schedules, daily attendance, gradebook, and student assignments.' },
    { id: 'r_assistant_teacher', name: 'ASSISTANT_TEACHER', division: 'Faculty', level: 'Level 5 - Support Faculty', description: 'Classroom teaching assistant supporting instructional delivery and homework logs.' },
    { id: 'r_lab_instructor', name: 'LAB_INSTRUCTOR', division: 'Faculty', level: 'Level 4 - Specialized', description: 'Specialized instructor managing physics, chemistry, biology, and computer science laboratories.' },
    { id: 'r_substitute_teacher', name: 'SUBSTITUTE_TEACHER', division: 'Faculty', level: 'Level 4 - Temporary', description: 'Temporary instructional access to assigned sections and grade logs.' },
    { id: 'r_curriculum_coordinator', name: 'CURRICULUM_COORDINATOR', division: 'Academic', level: 'Level 3 - Planning', description: 'Coordinates Cambridge, STEM, and national curricular frameworks and lesson sequences.' },

    // Student Care & Support (Level 4)
    { id: 'r_guidance_counselor', name: 'GUIDANCE_COUNSELOR', division: 'Student Care', level: 'Level 4 - Welfare', description: 'Student mental health, university admissions counseling, and behavioral support.' },
    { id: 'r_disciplinary_officer', name: 'DISCIPLINARY_OFFICER', division: 'Student Care', level: 'Level 4 - Welfare', description: 'Monitors student conduct, incident logs, and attendance intervention meetings.' },
    { id: 'r_special_needs_educator', name: 'SPECIAL_NEEDS_EDUCATOR', division: 'Student Care', level: 'Level 4 - Welfare', description: 'Specialized support for inclusive education, IEP tracking, and accommodations.' },
    { id: 'r_health_nurse', name: 'CAMPUS_NURSE', division: 'Student Care', level: 'Level 5 - Health', description: 'Maintains student health dossiers, immunization records, and clinic visits.' },

    // Admissions (Level 3-4)
    { id: 'r_admissions_director', name: 'ADMISSIONS_DIRECTOR', division: 'Admissions', level: 'Level 3 - Admissions Lead', description: 'Approves application workflows, entrance criteria, and final student enrollment.' },
    { id: 'r_admissions_officer', name: 'ADMISSIONS_OFFICER', division: 'Admissions', level: 'Level 4 - Operations', description: 'Processes candidate inquiries, application dossiers, and entrance test scoring.' },
    { id: 'r_receptionist', name: 'RECEPTIONIST', division: 'Admissions', level: 'Level 5 - Front Desk', description: 'Front-desk visitor logs, prospect intake, and appointment coordination.' },

    // Finance & Accounts (Level 2-4)
    { id: 'r_finance_manager', name: 'FINANCE_MANAGER', division: 'Finance', level: 'Level 2 - Bursar', description: 'Oversees institutional budgeting, fee structures, payroll, and general ledger.' },
    { id: 'r_accountant', name: 'ACCOUNTANT', division: 'Finance', level: 'Level 4 - Accounts', description: 'Generates semester fee challans, records reconciliations, and verifies payments.' },
    { id: 'r_cashier', name: 'CASHIER', division: 'Finance', level: 'Level 5 - Cash Counter', description: 'Handles front-desk tuition collection, cash receipts, and daily bank deposits.' },
    { id: 'r_scholarship_officer', name: 'SCHOLARSHIP_OFFICER', division: 'Finance', level: 'Level 4 - Aid', description: 'Evaluates merit and need-based financial aid and scholarship applications.' },

    // Library & IT (Level 3-5)
    { id: 'r_librarian', name: 'CHIEF_LIBRARIAN', division: 'Library & IT', level: 'Level 4 - Library', description: 'Manages physical and digital catalog, book circulation, and research archives.' },
    { id: 'r_it_admin', name: 'IT_ADMINISTRATOR', division: 'Library & IT', level: 'Level 3 - Infrastructure', description: 'Manages campus networking, hardware inventory, and software licensing.' },
    { id: 'r_db_admin', name: 'DATABASE_ADMINISTRATOR', division: 'Library & IT', level: 'Level 3 - Systems', description: 'Oversees backup integrity, database indexing, and disaster recovery.' },

    // Operations & Logistics (Level 4-5)
    { id: 'r_facility_manager', name: 'FACILITY_MANAGER', division: 'Operations', level: 'Level 4 - Campus Ops', description: 'Campus premises maintenance, classroom equipment, and utilities.' },
    { id: 'r_transport_coordinator', name: 'TRANSPORT_COORDINATOR', division: 'Logistics', level: 'Level 4 - Fleet', description: 'Coordinates bus fleets, driver schedules, GPS tracking, and student pickup routes.' },
    { id: 'r_security_chief', name: 'SECURITY_CHIEF', division: 'Operations', level: 'Level 4 - Security', description: 'Oversees campus gate security, surveillance systems, and visitor badges.' },
    { id: 'r_hostel_warden', name: 'HOSTEL_WARDEN', division: 'Operations', level: 'Level 4 - Residential', description: 'Manages boarding rooms, curfew compliance, and residential dining.' },

    // Portals & End Users (Level 6)
    { id: 'r_student', name: 'STUDENT', division: 'Portal', level: 'Level 6 - End User', description: 'Access to personal timetable, homework, examinations, attendance, and fee invoices.' },
    { id: 'r_parent', name: 'PARENT', division: 'Portal', level: 'Level 6 - End User', description: 'Guardian access to monitor children’s academic progress, fee challans, and faculty communications.' },
    { id: 'r_alumni', name: 'ALUMNI', division: 'Portal', level: 'Level 6 - End User', description: 'Graduated alumni directory, transcript requests, and academy network.' }
  ];

  const filteredRoles = institutionalRoles.filter(r => {
    const matchesDiv = selectedDivision === 'ALL' || r.division === selectedDivision;
    const matchesQ = r.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
                     r.description.toLowerCase().includes(roleSearch.toLowerCase());
    return matchesDiv && matchesQ;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProfileForm.fullName || !newProfileForm.email) {
      addNotification('Name and email are required', 'error');
      return;
    }

    const defaultViewMap = {
      SUPER_ADMIN: 'admin-dashboard',
      INSTITUTION_ADMIN: 'admin-dashboard',
      CAMPUS_ADMIN: 'admin-dashboard',
      TEACHER: 'teacher-portal',
      STUDENT: 'student-portal',
      PARENT: 'parent-portal',
      ACCOUNTANT: 'fee-management'
    };

    addProfile({
      ...newProfileForm,
      defaultView: defaultViewMap[newProfileForm.role] || 'student-portal'
    });

    setIsAddModalOpen(false);
    setNewProfileForm({
      fullName: '',
      email: '',
      role: 'STUDENT',
      roleCategory: 'Portal',
      phone: '',
      identifier: '',
      department: 'General Academics',
      gradeOrBatch: 'Batch 2026-A',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProfile) return;

    updateProfile(editingProfile.id, {
      fullName: editingProfile.fullName,
      email: editingProfile.email,
      role: editingProfile.role,
      phone: editingProfile.phone,
      identifier: editingProfile.identifier,
      department: editingProfile.department,
      gradeOrBatch: editingProfile.gradeOrBatch,
      status: editingProfile.status,
      avatar: editingProfile.avatar
    });

    setIsEditModalOpen(false);
    setEditingProfile(null);
  };

  const toggleProfileStatus = (profile) => {
    if (profile.email === user?.email) {
      addNotification('Cannot suspend your own active session', 'error');
      return;
    }
    const newStatus = profile.status === 'Active' ? 'Suspended' : 'Active';
    updateProfile(profile.id, { status: newStatus });
    addNotification(`Status for ${profile.fullName} changed to ${newStatus}`, 'info');
  };

  const handleDelete = (profile) => {
    if (profile.email === user?.email || profile.role === 'SUPER_ADMIN') {
      addNotification('Cannot delete primary Super Administrator account', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete profile for "${profile.fullName}"? This user will no longer be able to log in.`)) {
      deleteProfile(profile.id);
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* 1. INSTITUTIONAL GOVERNANCE HEADER */}
      <div className="bg-[#0b1c30] text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Governance & Access Control</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              Users & Access Management
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Institutional identity directory, 39-role RBAC authorization hierarchy, granular permission scopes, active sessions, and preview mode management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register User</span>
            </button>
          </div>
        </div>

        {/* Quick Identity Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Active Students</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{studentCount} Enrolled</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Faculty & Teachers</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{teacherCount} Instructors</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Guardians & Parents</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{parentCount} Guardians</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">RBAC Roles Active</span>
            <span className="text-xl font-bold text-[#e05626] mt-0.5 block">39 Roles Defined</span>
          </div>
        </div>
      </div>

      {/* 2. SPECIFICATION SECTION 13: 7 GOVERNANCE NAVIGATION TABS */}
      {/* Users, Roles, Permissions, Access Requests, Sessions, Audit Logs, Impersonation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'users', label: 'Users', icon: Users, count: siteProfiles?.length },
          { id: 'roles', label: 'Roles', icon: Shield, count: 39 },
          { id: 'permissions', label: 'Permissions', icon: Sliders },
          { id: 'access-requests', label: 'Access Requests', icon: KeyRound, count: accessRequests.filter(r => r.status === 'Pending').length },
          { id: 'sessions', label: 'Sessions', icon: Laptop, count: activeSessions.length },
          { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
          { id: 'impersonation', label: 'Impersonation', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'audit-logs') {
                  setCurrentView('audit-logs');
                } else {
                  setGovTab(tab.id);
                }
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                govTab === tab.id
                  ? 'text-[#0b1c30] border-b-2 border-[#e05626]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${govTab === tab.id ? 'text-[#e05626]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  govTab === tab.id ? 'bg-[#0b1c30] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT: USERS DIRECTORY */}
      {govTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, roll/staff ID, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626] text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'ALL', label: 'All Users' },
                  { id: 'STUDENT', label: 'Students' },
                  { id: 'TEACHER', label: 'Teachers' },
                  { id: 'PARENT', label: 'Parents' },
                  { id: 'STAFF', label: 'Staff' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      roleFilter === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#e05626]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((p) => {
              const isCurrentUser = p.email === user?.email;
              const isSuspended = p.status === 'Suspended';

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs relative flex flex-col justify-between ${
                    isSuspended ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={p.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{p.fullName}</h3>
                          <span className="font-mono text-[11px] text-slate-500">{p.identifier || 'TES-USER'}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isSuspended ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Role:</span>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Department:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[160px]">{p.department || 'General'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-mono text-slate-600 truncate max-w-[160px]">{p.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => impersonateProfile(p)}
                      className="bg-slate-100 hover:bg-[#0b1c30] hover:text-white text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                      title="Preview portal as this user"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingProfile(p);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        title="Edit user details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleProfileStatus(p)}
                        disabled={isCurrentUser}
                        className={`p-1.5 rounded-lg transition-all ${
                          isCurrentUser ? 'opacity-30 cursor-not-allowed' : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={isSuspended ? 'Activate User' : 'Suspend User'}
                      >
                        {isSuspended ? <Check className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDelete(p)}
                        disabled={isCurrentUser || p.role === 'SUPER_ADMIN'}
                        className={`p-1.5 rounded-lg transition-all ${
                          isCurrentUser || p.role === 'SUPER_ADMIN' ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: ROLES DIRECTORY (Specification Section 13: Role Name, Division, Description, Hierarchy Level) */}
      {govTab === 'roles' && (
        <div className="space-y-4">
          {/* Division Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across 39 institutional roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626] text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['ALL', 'Executive', 'Academic', 'Faculty', 'Student Care', 'Admissions', 'Finance', 'Library & IT', 'Operations', 'Portal'].map(div => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDivision === div ? 'bg-[#0b1c30] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">39 School Institutional Roles</h3>
                <p className="text-xs text-slate-500">Every operational responsibility within the academy is mapped to a dedicated role.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-700">
                {filteredRoles.length} Roles Matched
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRoles.map(r => (
                <div key={r.id} className="p-4 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {r.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#e05626] bg-[#e05626]/10 px-2 py-0.5 rounded-full">
                        {r.division}
                      </span>
                      {r.protected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Core Protected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{r.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <span className="font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {r.level}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRoleForPerms(r.name);
                        setGovTab('permissions');
                      }}
                      className="bg-slate-100 hover:bg-[#0b1c30] hover:text-white text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                    >
                      Configure Scope
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: PERMISSION MATRIX (Specification Section 13: View, Create, Edit, Delete, Approve, Export, Manage & Scopes) */}
      {govTab === 'permissions' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">Role Permission & Scope Matrix</h3>
                <span className="font-mono text-xs font-bold text-[#e05626] bg-[#e05626]/10 px-2 py-0.5 rounded">
                  {selectedRoleForPerms}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure action capabilities (View, Create, Edit, Delete, Approve, Export, Manage) across 6 hierarchical scopes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label className="font-bold text-slate-600">Select Role:</label>
              <select
                value={selectedRoleForPerms}
                onChange={(e) => setSelectedRoleForPerms(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-800 focus:outline-none focus:border-[#e05626]"
              >
                {institutionalRoles.map(r => (
                  <option key={r.id} value={r.name}>{r.name} ({r.division})</option>
                ))}
              </select>

              <label className="font-bold text-slate-600 ml-2">Active Scope:</label>
              <select
                value={permissionScope}
                onChange={(e) => setPermissionScope(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-800 focus:outline-none focus:border-[#e05626]"
              >
                {['Own', 'Assigned Classes', 'Department', 'Grade', 'Campus', 'Institution'].map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3 pl-4">System Module</th>
                  <th className="p-3 text-center">View</th>
                  <th className="p-3 text-center">Create</th>
                  <th className="p-3 text-center">Edit</th>
                  <th className="p-3 text-center">Delete</th>
                  <th className="p-3 text-center">Approve</th>
                  <th className="p-3 text-center">Export</th>
                  <th className="p-3 text-center pr-4">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { module: 'Student Records & Roster', view: true, create: true, edit: true, delete: false, approve: false, export: true, manage: false },
                  { module: 'Admissions & Inquiries', view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: false },
                  { module: 'Daily Attendance Logs', view: true, create: true, edit: true, delete: false, approve: false, export: true, manage: true },
                  { module: 'Curriculum & Timetable', view: true, create: false, edit: false, delete: false, approve: false, export: true, manage: false },
                  { module: 'Homework & Assignments', view: true, create: true, edit: true, delete: true, approve: false, export: false, manage: true },
                  { module: 'Examinations & Grades', view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: false },
                  { module: 'Fee Management & Challans', view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
                  { module: 'Governance & Roles', view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
                  { module: 'Audit Logs & Security', view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 pl-4 font-bold text-slate-800">{row.module}</td>
                    {['view', 'create', 'edit', 'delete', 'approve', 'export', 'manage'].map((action) => {
                      const enabled = selectedRoleForPerms === 'SUPER_ADMIN' ? true : row[action];
                      return (
                        <td key={action} className="p-3 text-center">
                          <button
                            onClick={() => addNotification(`Toggled ${action} permission for ${row.module}`, 'info')}
                            className={`w-5 h-5 rounded flex items-center justify-center mx-auto transition-all ${
                              enabled ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {enabled && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Scope restriction: <strong className="text-slate-800">{permissionScope}</strong>. Changes take effect on next token refresh.
              </span>
              <button
                onClick={() => addNotification(`Permissions updated for ${selectedRoleForPerms}`, 'success')}
                className="bg-[#0b1c30] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Save Permission Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: ACCESS REQUESTS */}
      {govTab === 'access-requests' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800">Privilege & Role Elevation Requests</h3>
            <p className="text-xs text-slate-500">Staff and teacher requests for elevated institutional scopes or temporary department delegations.</p>
          </div>

          <div className="space-y-3">
            {accessRequests.map(req => (
              <div key={req.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{req.user}</span>
                    <span className="text-xs text-slate-500">({req.email})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Requesting elevation to <span className="font-bold text-[#e05626] font-mono">{req.requestedRole}</span> • Dept: <span className="font-medium">{req.department}</span>
                  </div>
                  <p className="text-xs text-slate-500 italic mt-1">"{req.reason}"</p>
                  <span className="text-[11px] text-slate-400 font-mono block">Submitted: {req.date}</span>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = accessRequests.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r);
                        setAccessRequests(updated);
                        addNotification(`Access request approved for ${req.user}`, 'success');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                    >
                      Approve Elevation
                    </button>
                    <button
                      onClick={() => {
                        const updated = accessRequests.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r);
                        setAccessRequests(updated);
                        addNotification(`Access request denied for ${req.user}`, 'info');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: ACTIVE SESSIONS */}
      {govTab === 'sessions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Concurrent User Sessions</h3>
              <p className="text-xs text-slate-500">Live active sessions connected to the academy gateway.</p>
            </div>
            <button
              onClick={() => addNotification('All non-current sessions revoked', 'warning')}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
            >
              Terminate All Other Sessions
            </button>
          </div>

          <div className="space-y-3">
            {activeSessions.map(sess => (
              <div key={sess.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    {sess.device.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sess.user}</span>
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{sess.role}</span>
                      {sess.isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Your Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      IP: <span className="font-mono">{sess.ip}</span> • Location: {sess.location} • Device: {sess.device}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-mono">Last active: {sess.lastActive}</span>
                  {!sess.isCurrent && (
                    <button
                      onClick={() => {
                        setActiveSessions(activeSessions.filter(s => s.id !== sess.id));
                        addNotification(`Session for ${sess.user} terminated`, 'info');
                      }}
                      className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: IMPERSONATION & PREVIEW MANAGEMENT (Specification Section 14) */}
      {govTab === 'impersonation' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Institutional Preview Mode & Impersonation Boundaries</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Preview Mode enables authorized Super Administrators to experience portals exactly as students, parents, teachers, and finance officers see them.
              While in Preview Mode, a persistent high-visibility warning banner is shown at the top of the screen:
            </p>
            <div className="p-3 bg-[#0b1c30] text-white rounded-xl text-xs font-mono flex items-center justify-between border-l-4 border-amber-500">
              <span>⚠ PREVIEW MODE: You are viewing TES as: [User] · [ROLE]</span>
              <span className="bg-[#e05626] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold">[Exit Preview Mode]</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Exiting preview restores your primary SUPER_ADMIN session without losing context or requiring re-authentication.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Select Profile to Launch Instant Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: 'STUDENT', label: 'Student Portal', user: siteProfiles.find(p => p.role === 'STUDENT') || { fullName: 'Alex Rivera', role: 'STUDENT', defaultView: 'student-portal' }, icon: GraduationCap },
                { role: 'PARENT', label: 'Parent Portal', user: siteProfiles.find(p => p.role === 'PARENT') || { fullName: 'Robert Rivera', role: 'PARENT', defaultView: 'parent-portal' }, icon: School },
                { role: 'TEACHER', label: 'Teacher Portal', user: siteProfiles.find(p => p.role === 'TEACHER' || p.role === 'INSTRUCTOR') || { fullName: 'Dr. Sarah Jenkins', role: 'TEACHER', defaultView: 'teacher-portal' }, icon: BookOpen },
                { role: 'ACCOUNTANT', label: 'Finance & Accounts', user: siteProfiles.find(p => p.role === 'ACCOUNTANT' || p.role === 'FINANCE_MANAGER') || { fullName: 'Bursar Office', role: 'ACCOUNTANT', defaultView: 'fee-management' }, icon: DollarSign },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{item.label}</h4>
                      <p className="text-xs text-slate-500">
                        Preview as <strong className="text-slate-800">{item.user?.fullName}</strong> ({item.role})
                      </p>
                    </div>
                    <button
                      onClick={() => impersonateProfile(item.user)}
                      className="w-full bg-[#0b1c30] hover:bg-[#e05626] text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Launch Preview Mode</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Register New Profile */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">Register New Site Profile</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Sterling"
                  value={newProfileForm.fullName}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="clara@tes.edu"
                    value={newProfileForm.email}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={newProfileForm.role}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626] font-bold"
                  >
                    {institutionalRoles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional ID</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2026-098"
                    value={newProfileForm.identifier}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, identifier: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department / Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. Grade 11 - Cambridge"
                    value={newProfileForm.department}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#e05626] hover:bg-[#c9461b] text-white font-bold"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Profile */}
      {isEditModalOpen && editingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">Edit Profile: {editingProfile.fullName}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingProfile.fullName}
                  onChange={(e) => setEditingProfile({ ...editingProfile, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={editingProfile.role}
                    onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626] font-bold"
                  >
                    {institutionalRoles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional ID</label>
                  <input
                    type="text"
                    value={editingProfile.identifier || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, identifier: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingProfile.department || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e05626]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-slate-800 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { exportToCSV } from '../utils/exporter';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  UserCheck, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Download,
  Calendar,
  CheckSquare,
  Square,
  Trash2,
  ListTodo,
  AlertTriangle,
  Bell,
  Clock,
  UserCog,
  UserPlus,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminDashboard = () => {
  const { 
    setCurrentView, 
    setModalType, 
    setIsModalOpen, 
    courses, 
    students,
    adminTasks,
    addAdminTask,
    toggleAdminTask,
    deleteAdminTask,
    addNotification
  } = useApp();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const res = await apiClient.get('/analytics/dashboard');
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        // Fallback default structure
        setDashboardData({
          kpis: {
            totalStudents: 1420,
            activeStudents: 1380,
            totalStaff: 42,
            totalTeachers: 28,
            todayAttendanceCount: 1335,
            todayAttendancePercentage: 94,
            todayFeeCollection: 14200,
            outstandingFees: 27000,
            newAdmissions: 34,
            pendingApplications: 12
          },
          trends: {
            enrollmentTrend: [
              { month: 'Sep', count: 1100 },
              { month: 'Oct', count: 1180 },
              { month: 'Nov', count: 1250 },
              { month: 'Dec', count: 1310 },
              { month: 'Jan', count: 1380 },
              { month: 'Feb', count: 1420 }
            ],
            attendanceTrend: [
              { day: 'Mon', percentage: 95 },
              { day: 'Tue', percentage: 96 },
              { day: 'Wed', percentage: 92 },
              { day: 'Thu', percentage: 94 },
              { day: 'Fri', percentage: 91 }
            ],
            feeCollectionTrend: [
              { month: 'Sep', amount: 45000 },
              { month: 'Oct', amount: 52000 },
              { month: 'Nov', amount: 48000 },
              { month: 'Dec', amount: 61000 },
              { month: 'Jan', amount: 73000 },
              { month: 'Feb', amount: 68000 }
            ]
          }
        });
      }
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const handleExportEnrollments = () => {
    exportToCSV('academy_enrollments_report', students, ['Student ID', 'Student Name', 'Email', 'Batch', 'Course', 'Attendance', 'Status', 'Grade']);
    addNotification('Exported student enrollments to CSV', 'success');
  };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    addAdminTask(newTaskInput, 'High');
    setNewTaskInput('');
    addNotification('Institutional administrative task logged', 'success');
  };

  const kpisData = dashboardData?.kpis || {
    totalStudents: 1420,
    activeStudents: 1380,
    totalTeachers: 28,
    totalStaff: 42,
    todayAttendancePercentage: 94,
    todayFeeCollection: 14200,
    outstandingFees: 27000,
    newAdmissions: 34,
    pendingApplications: 12
  };

  // Recent system activities
  const RECENT_ACTIVITIES = [
    { id: 'act-1', time: '12m ago', user: 'Dr. Sarah Jenkins', action: 'Attendance Submitted', target: 'Grade 11 - Section A (28 Present)', type: 'ACADEMIC' },
    { id: 'act-2', time: '45m ago', user: 'Bilal Ahmed (Bursar)', action: 'Fee Challan Reconciled', target: 'Challan #CH-2026-0988 (PKR 45,000)', type: 'FINANCE' },
    { id: 'act-3', time: '1h ago', user: 'Zainab Malik (Registrar)', action: 'Admission Application', target: 'Julian Vance (Grade 10 Science)', type: 'ADMISSIONS' },
    { id: 'act-4', time: '2h ago', user: 'Super Administrator', action: 'Role Policy Updated', target: 'SEN_COORDINATOR Permissions Modified', type: 'GOVERNANCE' },
    { id: 'act-5', time: '4h ago', user: 'Prof. Marcus Vance', action: 'Homework Published', target: 'Calculus Mechanics Set 4', type: 'ACADEMIC' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. INSTITUTIONAL HEADER */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>21 September 2026</span>
            <span>•</span>
            <span className="text-primary font-bold">Academic Year 2026–2027</span>
            <span>•</span>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
              TES Main Campus Active
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">
            Good morning, Administrator
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Operational cockpit & action center across academic, admissions, and financial domains.
          </p>
        </div>

        {/* Quick Institutional Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentView('admissions')}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Admission</span>
          </button>

          <button
            onClick={() => setCurrentView('admin-roles')}
            className="bg-[#0b1c30] hover:bg-[#162f4d] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Roles & Security (39)</span>
          </button>

          <button
            onClick={handleExportEnrollments}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Export Enrollments CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 2. CORE KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Students */}
        <div 
          onClick={() => setCurrentView('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-primary/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Students</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-slate-900">{kpisData.totalStudents.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{kpisData.activeStudents.toLocaleString()} Active Learners</div>
          </div>
        </div>

        {/* KPI 2: Attendance */}
        <div 
          onClick={() => setCurrentView('admin-attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-emerald-600">{kpisData.todayAttendancePercentage}%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{kpisData.todayAttendanceCount || 1335} Students Present</div>
          </div>
        </div>

        {/* KPI 3: Fee Collection */}
        <div 
          onClick={() => setCurrentView('fee-management')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fee Collection</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-slate-900">PKR {kpisData.todayFeeCollection.toLocaleString()}</div>
            <div className="text-[11px] text-rose-600 font-medium mt-0.5">PKR {kpisData.outstandingFees.toLocaleString()} Overdue</div>
          </div>
        </div>

        {/* KPI 4: Admissions */}
        <div 
          onClick={() => setCurrentView('admissions')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-500/40 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admissions</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-slate-900">{kpisData.newAdmissions} Applications</div>
            <div className="text-[11px] text-sky-600 font-bold mt-0.5">{kpisData.pendingApplications} Awaiting Review</div>
          </div>
        </div>
      </div>

      {/* 3. "NEEDS ATTENTION" PRIORITY ACTION SECTION */}
      <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="font-bold text-sm tracking-wide text-white uppercase">
              Needs Attention ({5})
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Institutional Priority Queue</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* Item 1 */}
          <div 
            onClick={() => setCurrentView('admissions')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">12 Admissions Pending</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Entrance exam & document verification awaiting review by Admissions Desk.
            </p>
          </div>

          {/* Item 2 */}
          <div 
            onClick={() => setCurrentView('admin-attendance')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-300">Grade 10-B Attendance</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Class roll call not submitted yet for morning homeroom session.
            </p>
          </div>

          {/* Item 3 */}
          <div 
            onClick={() => setCurrentView('fee-management')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-300">14 Overdue Fee Challans</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tuition fee notices overdue past grace period. Automated reminder dispatch ready.
            </p>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONAL OVERVIEWS & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Admissions & Attendance Overviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admissions Pipeline Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Admissions Pipeline Status</h3>
                <p className="text-slate-500 text-xs">Academic Session 2026–2027 enrollment funnel</p>
              </div>
              <button 
                onClick={() => setCurrentView('admissions')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Admissions Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New</span>
                <span className="text-xl font-bold text-slate-900 block mt-1">12</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">In Review</span>
                <span className="text-xl font-bold text-amber-700 block mt-1">8</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Interview</span>
                <span className="text-xl font-bold text-purple-700 block mt-1">5</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Accepted</span>
                <span className="text-xl font-bold text-blue-700 block mt-1">14</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Enrolled</span>
                <span className="text-xl font-bold text-emerald-700 block mt-1">29</span>
              </div>
            </div>
          </div>

          {/* Academic Enrollment Trend Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Institutional Enrollment Progression</h3>
                <p className="text-slate-500 text-xs">Total enrolled students over academic terms</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                +14.2% Growth
              </span>
            </div>

            <div className="h-60 w-full">
              <Line
                data={{
                  labels: (dashboardData?.trends?.enrollmentTrend || []).map(d => d.month),
                  datasets: [
                    {
                      fill: true,
                      label: 'Enrolled Students',
                      data: (dashboardData?.trends?.enrollmentTrend || []).map(d => d.count),
                      borderColor: '#e05626',
                      backgroundColor: 'rgba(224, 86, 38, 0.08)',
                      tension: 0.3,
                      pointBackgroundColor: '#e05626',
                      pointRadius: 4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#f1f5f9' }, beginAtZero: false }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity & Admin Tasks */}
        <div className="space-y-6">
          {/* Institutional Activity Stream */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-slate-900">Recent Academy Activity</h3>
              </div>
              <button 
                onClick={() => setCurrentView('audit-logs')}
                className="text-[11px] text-primary hover:underline font-bold"
              >
                Audit Log →
              </button>
            </div>

            <div className="space-y-3">
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{act.user}</span>
                    <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <span className="font-semibold text-slate-700">{act.action}:</span> {act.target}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Action Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-slate-900">Institutional Tasks</h3>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {adminTasks.filter(t => !t.completed).length} Active
              </span>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Log new administrative task..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-3 rounded-lg"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {adminTasks.map((t) => (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs group"
                >
                  <div 
                    onClick={() => toggleAdminTask(t.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-[11px] ${t.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                      {t.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAdminTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

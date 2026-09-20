import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { FormSelect } from '../components/ui/FormControls';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  PieChart, 
  UserCheck, 
  UserX, 
  Clock, 
  Award,
  Filter
} from 'lucide-react';

export const ExecutiveAnalyticsDashboard = () => {
  const { addNotification } = useApp();

  const [activePillar, setActivePillar] = useState('student');
  const [selectedCampus, setSelectedCampus] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    const query = selectedCampus !== 'ALL' ? `?campusId=${encodeURIComponent(selectedCampus)}` : '';
    const res = await apiClient.get(`/analytics/dashboard${query}`);
    setLoading(false);

    if (res.success && res.data) setDashboardData(res.data);
    else setDashboardData(null);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedCampus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Executive Analytics & KPI Intelligence
            </h1>
            <Badge variant="primary">Real DB Aggregated</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Real-time analytics across Student Roster, Attendance, Finances, and Academic Performance.
          </p>
        </div>

        {/* Campus Scope Selector */}
        <div className="w-48">
          <FormSelect
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Campuses (Global)' },
              { value: 'Main Campus', label: 'Main Campus' },
              { value: 'South Campus', label: 'South Campus' }
            ]}
          />
        </div>
      </div>

      {/* 4 Analytics Pillar Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'student', name: 'Student Analytics', icon: Users, desc: 'Enrollment & Demographics' },
          { id: 'attendance', name: 'Attendance Analytics', icon: Calendar, desc: 'Daily Rates & Absenteeism' },
          { id: 'finance', name: 'Finance Analytics', icon: DollarSign, desc: 'Revenue & Fee Defaulters' },
          { id: 'academic', name: 'Academic Analytics', icon: BookOpen, desc: 'Subjects & Grade Curves' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activePillar === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePillar(tab.id)}
              className={`p-4 rounded-3xl border text-left transition-all space-y-2 ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                {isSelected && <Badge variant="primary" className="bg-white/20 text-white">Active</Badge>}
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight">{tab.name}</span>
                <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{tab.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 text-center font-mono text-xs text-slate-500 space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Computing real database analytics aggregation...</p>
        </div>
      ) : dashboardData && (
        <div className="space-y-6">
          {/* PILLAR 1: STUDENT ANALYTICS */}
          {activePillar === 'student' && dashboardData.student && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Enrolled</span>
                  <span className="font-display font-black text-3xl text-slate-900 block">{dashboardData.student.summary.totalStudents}</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Status</span>
                  <span className="font-display font-black text-3xl text-emerald-600 block">{dashboardData.student.summary.activeStudents}</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Male Ratio</span>
                  <span className="font-display font-black text-3xl text-blue-600 block">{dashboardData.student.summary.maleStudents}</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Female Ratio</span>
                  <span className="font-display font-black text-3xl text-rose-600 block">{dashboardData.student.summary.femaleStudents}</span>
                </div>
              </div>

              {/* Class & Campus Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900">Class Distribution</h3>
                  <div className="space-y-3">
                    {dashboardData.student.classDistribution.map((item) => (
                      <div key={item.class} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{item.class}</span>
                          <span>{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900">Campus Distribution</h3>
                  <div className="space-y-3">
                    {dashboardData.student.campusDistribution.map((item) => (
                      <div key={item.campus} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{item.campus}</span>
                          <span>{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 2: ATTENDANCE ANALYTICS */}
          {activePillar === 'attendance' && dashboardData.attendance && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Daily Attendance Rate</span>
                  <span className="font-display font-black text-3xl text-emerald-600 block">{dashboardData.attendance.summary.dailyRate}%</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Weekly Average</span>
                  <span className="font-display font-black text-3xl text-blue-600 block">{dashboardData.attendance.summary.weeklyRate}%</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Average</span>
                  <span className="font-display font-black text-3xl text-slate-800 block">{dashboardData.attendance.summary.monthlyRate}%</span>
                </div>
              </div>

              {/* Chronic Absenteeism Roster */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-display font-bold text-lg text-slate-900">Chronic Absenteeism Watchlist (&lt; 75% Rate)</h3>
                  </div>
                  <Badge variant="warning">{dashboardData.attendance.chronicAbsenteeism.length} Students Flagged</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200">
                        <th className="p-3">Student Code</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Absent Days</th>
                        <th className="p-3">Attendance Rate</th>
                        <th className="p-3">Parent Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {dashboardData.attendance.chronicAbsenteeism.map((st) => (
                        <tr key={st.studentCode} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold">{st.studentCode}</td>
                          <td className="p-3 font-bold text-slate-900">{st.name}</td>
                          <td className="p-3">{st.class}</td>
                          <td className="p-3 text-rose-600 font-bold">{st.absentDays} Days</td>
                          <td className="p-3">
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md font-mono">{st.attendanceRate}%</span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">{st.parentPhone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 3: FINANCE ANALYTICS */}
          {activePillar === 'finance' && dashboardData.finance && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Fee Billed</span>
                  <span className="font-display font-black text-2xl text-slate-900 block">PKR {(dashboardData.finance.summary.totalBilled / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Collected</span>
                  <span className="font-display font-black text-2xl text-emerald-600 block">PKR {(dashboardData.finance.summary.totalCollected / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Outstanding Dues</span>
                  <span className="font-display font-black text-2xl text-rose-600 block">PKR {(dashboardData.finance.summary.totalOutstanding / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Collection Rate</span>
                  <span className="font-display font-black text-2xl text-blue-600 block">{dashboardData.finance.summary.collectionRate}%</span>
                </div>
              </div>

              {/* Defaulters Roster */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Overdue Fee Defaulters Roster</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200">
                        <th className="p-3">Student Code</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Days Overdue</th>
                        <th className="p-3">Balance Overdue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {dashboardData.finance.defaultersRoster.map((df) => (
                        <tr key={df.studentCode} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold">{df.studentCode}</td>
                          <td className="p-3 font-bold text-slate-900">{df.name}</td>
                          <td className="p-3">{df.class}</td>
                          <td className="p-3 text-amber-600 font-bold">{df.overdueDays} Days</td>
                          <td className="p-3 font-mono font-bold text-rose-600">PKR {df.balanceOverdue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 4: ACADEMIC ANALYTICS */}
          {activePillar === 'academic' && dashboardData.academic && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Overall Pass Rate</span>
                  <span className="font-display font-black text-3xl text-emerald-600 block">{dashboardData.academic.summary.overallPassRate}%</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Average GPA</span>
                  <span className="font-display font-black text-3xl text-blue-600 block">{dashboardData.academic.summary.averageGpa}</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pass vs Fail Count</span>
                  <span className="font-display font-black text-2xl text-slate-900 block">{dashboardData.academic.summary.passCount} Pass / {dashboardData.academic.summary.failCount} Fail</span>
                </div>
              </div>

              {/* Grade Distribution Bell Curve */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Grade Distribution Curve</h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {dashboardData.academic.gradeDistribution.map((gr) => (
                    <div key={gr.grade} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 font-mono">
                      <span className="font-display font-black text-2xl text-primary block">{gr.grade}</span>
                      <span className="text-xs font-bold text-slate-700 block font-sans">{gr.count} Students</span>
                      <span className="text-[11px] text-slate-500 block font-sans">{gr.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  DollarSign, 
  Download, 
  FileText, 
  CheckCircle2, 
  Bell, 
  Building, 
  GraduationCap, 
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const DEFAULT_STUDENT_PROFILE = {
  firstName: 'Alex',
  lastName: 'Rivera',
  studentCode: 'STU-2026-089',
  email: 'alex.rivera@edu.com',
  phone: '+92 333 5551234',
  grade: 'Grade 11',
  section: 'Section A (Pre-Engineering & Cambridge)',
  rollNo: '11-04',
  campusName: 'The Education Space Academy (Main Campus)',
  guardianName: 'Robert Rivera',
  guardianPhone: '+92 301 9991122',
  admissionDate: 'September 2024',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
};

const DEFAULT_DASHBOARD_DATA = {
  summary: {
    attendanceRate: '96.4%',
    termGpa: '3.88 / 4.0',
    pendingAssignments: 2,
    nextClass: 'Advanced Computer Science (08:30 AM)'
  },
  todayClasses: [
    { subject: 'Advanced Computer Science', time: '08:30 AM - 09:30 AM', room: 'STEM Lab 2', instructor: 'Dr. Sarah Jenkins' },
    { subject: 'Mathematics & Mechanics', time: '09:45 AM - 10:45 AM', room: 'Room 204', instructor: 'Prof. Marcus Vance' },
    { subject: 'Physics Practical Lab', time: '11:15 AM - 12:15 PM', room: 'Physics Lab 1', instructor: 'Dr. Elena Rostova' }
  ]
};

const DEFAULT_ATTENDANCE_DATA = {
  attendancePercentage: '96.4%',
  totalDays: 40,
  presentDays: 38,
  absentDays: 1,
  lateDays: 1,
  logs: [
    { date: '2026-09-18', status: 'PRESENT', remark: 'On time, active lab demo' },
    { date: '2026-09-17', status: 'PRESENT', remark: 'On time' },
    { date: '2026-09-16', status: 'LATE', remark: 'Transit bus delay (Excused)' },
    { date: '2026-09-15', status: 'PRESENT', remark: 'On time' },
    { date: '2026-09-12', status: 'ABSENT', remark: 'Medical leave approved' }
  ]
};

const DEFAULT_TIMETABLE_DATA = [
  { day: 'Monday', time: '08:30 - 09:30', subject: 'Advanced Computer Science', instructor: 'Dr. Sarah Jenkins', room: 'STEM Lab 2' },
  { day: 'Monday', time: '09:45 - 10:45', subject: 'Mathematics & Mechanics', instructor: 'Prof. Marcus Vance', room: 'Room 204' },
  { day: 'Tuesday', time: '10:00 - 11:00', subject: 'Physics Lab', instructor: 'Dr. Elena Rostova', room: 'Physics Lab 1' },
  { day: 'Wednesday', time: '08:30 - 09:30', subject: 'Robotics & Hardware', instructor: 'Dr. Sarah Jenkins', room: 'Robotics Center' },
  { day: 'Thursday', time: '11:15 - 12:15', subject: 'Algorithm Complexity', instructor: 'Prof. Marcus Vance', room: 'Room 204' },
  { day: 'Friday', time: '09:00 - 10:00', subject: 'Academic English', instructor: 'Prof. Eleanor Vance', room: 'Auditorium Hall' }
];

const DEFAULT_HOMEWORK_DATA = [
  { id: 'hw-1', title: 'Binary Search Tree Implementation', subject: 'Computer Science', dueDate: '2026-09-25', status: 'In Progress', maxMarks: 20 },
  { id: 'hw-2', title: 'Electro-magnetic Field Calculations', subject: 'Physics', dueDate: '2026-09-28', status: 'Pending', maxMarks: 15 },
  { id: 'hw-3', title: 'Integration Calculus Exercise 3.4', subject: 'Mathematics', dueDate: '2026-09-22', status: 'Submitted (Graded 19/20)', maxMarks: 20 }
];

const DEFAULT_RESULTS_DATA = {
  term: 'Fall Term Examination 2026',
  gpa: '3.88',
  grade: 'A+ (Distinction)',
  position: 2,
  results: [
    { subject: 'Advanced Computer Science', score: 96, maxMarks: 100, grade: 'A+' },
    { subject: 'Mathematics & Mechanics', score: 94, maxMarks: 100, grade: 'A+' },
    { subject: 'Physics & Electro-dynamics', score: 90, maxMarks: 100, grade: 'A' },
    { subject: 'English Academic Writing', score: 88, maxMarks: 100, grade: 'A' }
  ]
};

const DEFAULT_FEES_DATA = {
  challanNumber: 'CH-2026-0988',
  status: 'PAID',
  amount: 'PKR 45,000',
  dueDate: '2026-09-25',
  billingMonth: 'September 2026'
};

const DEFAULT_DOCUMENTS_DATA = [
  { id: 'doc-1', title: 'Official Character Certificate 2026', type: 'PDF Document', date: 'Sep 2026' },
  { id: 'doc-2', title: 'Academic Enrollment Verification Letter', type: 'PDF Document', date: 'Aug 2026' },
  { id: 'doc-3', title: 'Term 1 Grade Transcript & Marksheet', type: 'Verified PDF', date: 'Jul 2026' }
];

export const StudentPortal = () => {
  const { addNotification, switchToSuperAdmin, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(DEFAULT_STUDENT_PROFILE);
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [attendanceData, setAttendanceData] = useState(DEFAULT_ATTENDANCE_DATA);
  const [timetableData, setTimetableData] = useState(DEFAULT_TIMETABLE_DATA);
  const [homeworkData, setHomeworkData] = useState(DEFAULT_HOMEWORK_DATA);
  const [resultsData, setResultsData] = useState(DEFAULT_RESULTS_DATA);
  const [feesData, setFeesData] = useState(DEFAULT_FEES_DATA);
  const [documentsData, setDocumentsData] = useState(DEFAULT_DOCUMENTS_DATA);

  // Optional backend sync
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const res = await apiClient.get('/student-portal/me/dashboard');
        if (res?.success && res?.data) {
          setDashboardData(res.data);
          if (res.data.profile) setProfile(res.data.profile);
        }
      } catch (e) {
        // Fallback safely preserved
      }
    };
    syncBackend();
  }, []);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#0b1c30] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#e05626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              Student Self-Service Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Private Learner Account</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Welcome, {profile.firstName}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
            Track your personal attendance, timetable, assignments, exam grades, and official school documents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {userRole !== 'SUPER_ADMIN' && (
            <button
              onClick={switchToSuperAdmin}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Return to Super Admin</span>
            </button>
          )}

          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 font-mono text-xs text-right space-y-0.5">
            <span className="text-emerald-400 font-bold block">{profile.grade} ({profile.section})</span>
            <span className="text-slate-300 block">{profile.studentCode}</span>
            <span className="text-slate-400 text-[11px] block">{profile.campusName}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'dashboard', name: 'Dashboard Overview', icon: GraduationCap },
          { id: 'profile', name: 'My Profile', icon: User },
          { id: 'attendance', name: 'My Attendance', icon: Calendar },
          { id: 'timetable', name: 'My Timetable', icon: Clock },
          { id: 'homework', name: 'Homework & Assignments', icon: BookOpen },
          { id: 'exams_results', name: 'Exams & Results', icon: Award },
          { id: 'fees', name: 'Fee Status', icon: DollarSign },
          { id: 'documents', name: 'School Documents', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="space-y-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
                <span className="font-display font-bold text-3xl text-emerald-600 block">{dashboardData.summary.attendanceRate}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Term GPA</span>
                <span className="font-display font-bold text-3xl text-purple-600 block">{dashboardData.summary.termGpa}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Tasks</span>
                <span className="font-display font-bold text-3xl text-amber-600 block">{dashboardData.summary.pendingAssignments} Tasks</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Next Lecture</span>
                <span className="font-bold text-xs text-slate-800 block truncate">{dashboardData.summary.nextClass}</span>
              </div>
            </div>

            {/* Today's Classes List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Today's Class Schedule</h3>
              <div className="space-y-3">
                {dashboardData.todayClasses.map((cls, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cls.subject}</h4>
                      <p className="text-slate-500 text-xs">{cls.instructor} • {cls.room}</p>
                    </div>
                    <span className="font-mono text-primary font-bold">{cls.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Student Demographics & Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="font-bold text-slate-500 block">Full Name:</span> <span className="text-slate-900 font-bold text-sm">{profile.firstName} {profile.lastName}</span></div>
              <div><span className="font-bold text-slate-500 block">Student Admission Code:</span> <span className="font-mono">{profile.studentCode}</span></div>
              <div><span className="font-bold text-slate-500 block">Email Address:</span> <span className="font-mono">{profile.email}</span></div>
              <div><span className="font-bold text-slate-500 block">Contact Phone:</span> <span className="font-mono">{profile.phone}</span></div>
              <div><span className="font-bold text-slate-500 block">Guardian / Parent:</span> <span>{profile.guardianName} ({profile.guardianPhone})</span></div>
              <div><span className="font-bold text-slate-500 block">Campus Location:</span> <span>{profile.campusName}</span></div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Personal Attendance Log</h3>
              <Badge variant="success">Presence Rate: {attendanceData.attendancePercentage}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-3">Date</th>
                    <th className="p-3">Presence Status</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceData.logs.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{row.date}</td>
                      <td className="p-3">
                        <Badge variant={row.status === 'PRESENT' ? 'success' : row.status === 'LATE' ? 'warning' : 'danger'}>{row.status}</Badge>
                      </td>
                      <td className="p-3 text-slate-600">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Weekly Class Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timetableData.map((slot, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-primary font-bold">
                    <span>{slot.day}</span>
                    <span className="font-mono text-slate-500 text-xs">{slot.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                  <p className="text-slate-500 text-xs">{slot.instructor} • {slot.room}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Homework & Assignments</h3>
            <div className="space-y-3">
              {homeworkData.map((hw) => (
                <div key={hw.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                    <p className="text-slate-500 text-xs">{hw.subject} • Max Marks: {hw.maxMarks} | Due: {hw.dueDate}</p>
                  </div>
                  <Badge variant={hw.status.includes('Submitted') ? 'success' : 'warning'}>{hw.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXAMS & RESULTS */}
        {activeTab === 'exams_results' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{resultsData.term}</h3>
                <span className="text-slate-500 font-mono text-[11px]">GPA: {resultsData.gpa} | Overall Grade: {resultsData.grade}</span>
              </div>
              <Badge variant="primary">Class Position #{resultsData.position}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-3">Course / Subject</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultsData.results.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{sub.subject}</td>
                      <td className="p-3 font-mono font-bold">{sub.score}</td>
                      <td className="p-3 font-mono text-slate-500">{sub.maxMarks}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{sub.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: FEES */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Tuition Fee Status</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold text-sm">
                <span>Challan Code: {feesData.challanNumber}</span>
                <Badge variant="success">{feesData.status}</Badge>
              </div>
              <p className="text-slate-600">Month: {feesData.billingMonth} | Amount: <strong className="text-emerald-600 font-mono">{feesData.amount}</strong></p>
            </div>
          </div>
        )}

        {/* TAB 8: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Official Academy Certificates & Documents</h3>
            <div className="space-y-3">
              {documentsData.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                    <p className="text-slate-500 text-xs">{doc.type} • Issued: {doc.date}</p>
                  </div>
                  <button
                    onClick={() => addNotification(`Downloaded ${doc.title}`, 'success')}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

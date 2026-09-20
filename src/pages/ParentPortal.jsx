import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Award, 
  Clock, 
  BookOpen, 
  Bell, 
  MessageSquare, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronDown,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DEFAULT_CHILDREN = [
  {
    id: 'child-1',
    firstName: 'Alex',
    lastName: 'Rivera',
    studentCode: 'STU-2026-089',
    grade: 'Grade 11',
    section: 'Section A (Pre-Engineering)',
    campusName: 'The Education Space Academy (Main Campus)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rollNo: '11-04'
  },
  {
    id: 'child-2',
    firstName: 'Sophia',
    lastName: 'Rivera',
    studentCode: 'STU-2026-104',
    grade: 'Grade 9',
    section: 'Section B (Cambridge O-Levels)',
    campusName: 'The Education Space Academy (Main Campus)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rollNo: '09-12'
  }
];

const DEFAULT_DASHBOARD_DATA = {
  summary: {
    attendancePercentage: '96.4%',
    feeStatus: 'Paid in Full',
    latestGpa: '3.88 / 4.0',
    pendingHomeworkCount: 2
  },
  recentAnnouncements: [
    { title: 'Annual STEM & Robotics Expo', date: 'Oct 12, 2026', desc: 'Parents are cordially invited to attend the senior science showcases.' },
    { title: 'Parent-Teacher Consultation Schedule', date: 'Oct 18, 2026', desc: 'Term 1 progress evaluation meetings with respective class mentors.' }
  ]
};

const DEFAULT_ATTENDANCE_DATA = {
  attendancePercentage: '96.4%',
  presentDays: 38,
  absentDays: 1,
  lateDays: 1,
  logs: [
    { date: '2026-09-18', status: 'PRESENT', remarks: 'On time, active participation' },
    { date: '2026-09-17', status: 'PRESENT', remarks: 'On time' },
    { date: '2026-09-16', status: 'LATE', remarks: 'Late by 12 mins (School bus transit delay)' },
    { date: '2026-09-15', status: 'PRESENT', remarks: 'On time' },
    { date: '2026-09-12', status: 'ABSENT', remarks: 'Excused - Medical Doctor Slip Approved' }
  ]
};

const DEFAULT_FEES_DATA = {
  challanNumber: 'CH-2026-0988',
  billingMonth: 'September 2026',
  dueDate: '2026-09-25',
  status: 'PAID',
  amountPaid: 'PKR 45,000',
  breakdown: [
    { item: 'Tuition Fee (Senior Cambridge / STEM)', amount: 'PKR 35,000' },
    { item: 'Computer Science & Robotics Lab Fee', amount: 'PKR 5,000' },
    { item: 'Library & Digital Subscriptions', amount: 'PKR 3,000' },
    { item: 'Campus Co-curricular Activities', amount: 'PKR 2,000' }
  ]
};

const DEFAULT_RESULTS_DATA = {
  examName: 'Mid-Term Progress Examination 2026',
  overallGrade: 'A+ (Distinction)',
  overallPercentage: '92.6%',
  subjects: [
    { subject: 'Advanced Computer Science', total: 100, obtained: 96, grade: 'A+' },
    { subject: 'Mathematics & Mechanics', total: 100, obtained: 94, grade: 'A+' },
    { subject: 'Physics & Electro-dynamics', total: 100, obtained: 90, grade: 'A' },
    { subject: 'English Academic Writing', total: 100, obtained: 88, grade: 'A' }
  ],
  teacherRemarks: 'Alex displays exceptional dedication in software development, logic algorithms, and analytical STEM coursework.'
};

const DEFAULT_TIMETABLE = [
  { day: 'Monday', time: '08:30 - 09:30', subject: 'Advanced Computer Science', teacher: 'Dr. Sarah Jenkins', room: 'STEM Lab 2' },
  { day: 'Monday', time: '09:45 - 10:45', subject: 'Mathematics & Mechanics', teacher: 'Prof. Marcus Vance', room: 'Room 204' },
  { day: 'Tuesday', time: '10:00 - 11:00', subject: 'Physics Lab', teacher: 'Dr. Elena Rostova', room: 'Physics Lab 1' },
  { day: 'Wednesday', time: '08:30 - 09:30', subject: 'Robotics & Hardware', teacher: 'Dr. Sarah Jenkins', room: 'Robotics Center' },
  { day: 'Thursday', time: '11:15 - 12:15', subject: 'Algorithm Complexity', teacher: 'Prof. Marcus Vance', room: 'Room 204' }
];

const DEFAULT_HOMEWORK = [
  { title: 'Binary Search Tree Implementation', subject: 'Computer Science', dueDate: '2026-09-25', status: 'Submitted & Under Review' },
  { title: 'Electro-magnetic Induction Numerical Problems', subject: 'Physics', dueDate: '2026-09-28', status: 'Pending Submission' }
];

export const ParentPortal = () => {
  const { addNotification, switchToSuperAdmin, userRole } = useApp();

  const [children, setChildren] = useState(DEFAULT_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState('child-1');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [attendanceData, setAttendanceData] = useState(DEFAULT_ATTENDANCE_DATA);
  const [feesData, setFeesData] = useState(DEFAULT_FEES_DATA);
  const [resultsData, setResultsData] = useState(DEFAULT_RESULTS_DATA);
  const [timetableData, setTimetableData] = useState(DEFAULT_TIMETABLE);
  const [homeworkData, setHomeworkData] = useState(DEFAULT_HOMEWORK);
  
  const [messageText, setMessageText] = useState('');
  const [messagesList, setMessagesList] = useState([
    { id: 'msg-1', sender: 'Dr. Sarah Jenkins (Class Head)', time: 'Yesterday, 02:40 PM', text: 'Alex demonstrated outstanding performance in today’s robotics algorithm test.' },
    { id: 'msg-2', sender: 'Robert Rivera (You)', time: 'Yesterday, 04:15 PM', text: 'Thank you Dr. Jenkins. We are monitoring his project schedule closely at home.' }
  ]);

  // Sync with optional backend if available
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const res = await apiClient.get('/parent/children');
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setChildren(res.data);
          setSelectedChildId(res.data[0].id);
        }
      } catch (e) {
        // Fallback already pre-populated
      }
    };
    syncBackend();
  }, []);

  const activeChild = children.find(c => c.id === selectedChildId) || children[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Robert Rivera (You)',
      time: 'Just now',
      text: messageText
    };
    setMessagesList([...messagesList, newMsg]);
    setMessageText('');
    addNotification('Message dispatched to Class Teacher!', 'success');
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Top Banner with Child Switcher */}
      <div className="bg-[#0b1c30] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#e05626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              Parent Guardian Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Secure Authorized Access</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Welcome, Guardian
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
            Monitor real-time academic progress, attendance, fee challans, and teacher communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Linked Child Selector */}
          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Child Record:</span>
            <select
              value={selectedChildId}
              onChange={(e) => {
                setSelectedChildId(e.target.value);
                addNotification('Switched child record context', 'info');
              }}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {children.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.firstName} {c.lastName} ({c.grade})
                </option>
              ))}
            </select>
          </div>

          {userRole !== 'SUPER_ADMIN' && (
            <button
              onClick={switchToSuperAdmin}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Return to Super Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'dashboard', name: 'Overview', icon: Users },
          { id: 'attendance', name: 'Attendance', icon: Calendar },
          { id: 'fees', name: 'Fees & Challans', icon: DollarSign },
          { id: 'results', name: 'Results & Report Card', icon: Award },
          { id: 'timetable', name: 'Timetable', icon: Clock },
          { id: 'homework', name: 'Homework', icon: BookOpen },
          { id: 'messages', name: 'Teacher Messages', icon: MessageSquare }
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
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Active Child Profile Card */}
            {activeChild && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <img 
                  src={activeChild.avatarUrl} 
                  alt={activeChild.firstName} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-sm" 
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <Badge variant="primary">{activeChild.grade} - {activeChild.section}</Badge>
                  <h2 className="font-display font-bold text-2xl text-slate-900">
                    {activeChild.firstName} {activeChild.lastName}
                  </h2>
                  <p className="text-slate-500 text-xs font-mono">
                    Roll No: {activeChild.rollNo} | Code: {activeChild.studentCode} | Campus: {activeChild.campusName}
                  </p>
                </div>
              </div>
            )}

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
                <span className="font-display font-bold text-3xl text-emerald-600 block">{dashboardData.summary.attendancePercentage}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Fee Status</span>
                <span className="font-display font-bold text-3xl text-blue-600 block">{dashboardData.summary.feeStatus}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Latest Term GPA</span>
                <span className="font-display font-bold text-3xl text-purple-600 block">{dashboardData.summary.latestGpa}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Tasks</span>
                <span className="font-display font-bold text-3xl text-amber-600 block">{dashboardData.summary.pendingHomeworkCount} Tasks</span>
              </div>
            </div>

            {/* School Announcements */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                Academy Notices for Guardians
              </h3>
              <div className="space-y-3">
                {dashboardData.recentAnnouncements.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-slate-600 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Attendance Log & Rate</h3>
                <p className="text-slate-500 text-xs">Monthly Class Presence Records</p>
              </div>
              <Badge variant="success">Attendance: {attendanceData.attendancePercentage}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-3">Date</th>
                    <th className="p-3">Presence Status</th>
                    <th className="p-3">Teacher / System Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceData.logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{log.date}</td>
                      <td className="p-3">
                        <Badge variant={log.status === 'PRESENT' ? 'success' : log.status === 'LATE' ? 'warning' : 'danger'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-600">{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FEES & CHALLANS */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Fee Challan & Payment Summary</h3>
                <p className="text-slate-500 text-xs">Challan Code: {feesData.challanNumber} • {feesData.billingMonth}</p>
              </div>
              <Badge variant="success">{feesData.status}</Badge>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600 text-xs pb-1 border-b border-slate-200">
                <span>Fee Component</span>
                <span>Amount</span>
              </div>
              {feesData.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between font-medium text-slate-800">
                  <span>{item.item}</span>
                  <span className="font-mono font-bold">{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount Paid</span>
                <span className="font-mono text-emerald-600">{feesData.amountPaid}</span>
              </div>
            </div>
            <button
              onClick={() => addNotification('Fee challan official PDF receipt downloaded!', 'success')}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Payment Receipt</span>
            </button>
          </div>
        )}

        {/* TAB 4: RESULTS */}
        {activeTab === 'results' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{resultsData.examName}</h3>
                <p className="text-slate-500 text-xs">Official Cumulative Transcript</p>
              </div>
              <Badge variant="success">Final Grade: {resultsData.overallGrade} ({resultsData.overallPercentage})</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-3">Course / Subject</th>
                    <th className="p-3">Total Marks</th>
                    <th className="p-3">Marks Obtained</th>
                    <th className="p-3">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultsData.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{sub.subject}</td>
                      <td className="p-3 font-mono text-slate-500">{sub.total}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{sub.obtained}</td>
                      <td className="p-3 font-bold text-emerald-600">{sub.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Academic Advisor Comments:</span>
              <p className="text-slate-600 italic">"{resultsData.teacherRemarks}"</p>
            </div>
          </div>
        )}

        {/* TAB 5: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Weekly Class Routine & Subject Periods</h3>
              <Badge variant="primary">{activeChild.grade}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timetableData.map((slot, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-primary font-bold">
                    <span>{slot.day}</span>
                    <span className="font-mono text-slate-500 text-xs">{slot.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                  <p className="text-slate-500 text-xs">{slot.teacher} • {slot.room}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Current Homework Assignments</h3>
              <Badge variant="primary">2 Active</Badge>
            </div>
            <div className="space-y-3">
              {homeworkData.map((hw, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                    <p className="text-slate-500 text-xs">{hw.subject} • Due: {hw.dueDate}</p>
                  </div>
                  <Badge variant={hw.status.includes('Submitted') ? 'success' : 'warning'}>
                    {hw.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TEACHER MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Direct Faculty Communications</h3>
              <Badge variant="primary">Active Conversation</Badge>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messagesList.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{m.sender}</span>
                    <span className="text-slate-400 font-mono">{m.time}</span>
                  </div>
                  <p className="text-slate-700 text-xs">{m.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Write a message to your child's teachers..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

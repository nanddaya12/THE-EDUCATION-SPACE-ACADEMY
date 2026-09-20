import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormControls';
import { 
  Users, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Send,
  Building,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

const DEFAULT_DASHBOARD_DATA = {
  teacherName: 'Dr. Sarah Jenkins',
  assignedClassesCount: 4,
  assignedSubjectsCount: 3,
  todayClassesCount: 5,
  pendingHomeworkGrading: 18,
  todayClasses: [
    { subject: 'Advanced Computer Science', class: 'Grade 11-A', period: '08:30 AM - 09:30 AM', room: 'STEM Lab 2', status: 'In Progress' },
    { subject: 'Data Structures & Algorithms', class: 'Grade 12-B', period: '09:45 AM - 10:45 AM', room: 'Computer Lab 1', status: 'Scheduled' },
    { subject: 'Robotics & Embedded Systems', class: 'Grade 10-A', period: '11:15 AM - 12:15 PM', room: 'Robotics Center', status: 'Scheduled' },
    { subject: 'Web Technologies Lab', class: 'Grade 11-A', period: '01:00 PM - 02:00 PM', room: 'STEM Lab 1', status: 'Scheduled' },
    { subject: 'Student Mentorship & Office Hours', class: 'Open Consultation', period: '02:15 PM - 03:00 PM', room: 'Faculty Office', status: 'Scheduled' }
  ]
};

const DEFAULT_SCHEDULE_DATA = [
  { day: 'Monday', time: '08:30 - 09:30', class: 'Grade 11-A', subject: 'Computer Science', room: 'STEM Lab 2', type: 'Lecture' },
  { day: 'Monday', time: '09:45 - 10:45', class: 'Grade 12-B', subject: 'Data Structures', room: 'Computer Lab 1', type: 'Lab' },
  { day: 'Tuesday', time: '10:00 - 11:00', class: 'Grade 10-A', subject: 'Robotics Lab', room: 'Robotics Center', type: 'Practical' },
  { day: 'Wednesday', time: '08:30 - 09:30', class: 'Grade 11-A', subject: 'Computer Science', room: 'STEM Lab 2', type: 'Lecture' },
  { day: 'Thursday', time: '11:15 - 12:15', class: 'Grade 12-B', subject: 'Algorithm Complexity', room: 'Room 204', type: 'Tutorial' },
  { day: 'Friday', time: '09:00 - 10:00', class: 'Grade 11-A', subject: 'Project Review', room: 'STEM Lab 1', type: 'Evaluation' }
];

const DEFAULT_STUDENTS_ROSTER = [
  { id: 'st-1', rollNo: '10-01', name: 'Alex Rivera', studentCode: 'STU-2026-089', attendanceRate: '96.4%', status: 'Present' },
  { id: 'st-2', rollNo: '10-02', name: 'Sophia Chen', studentCode: 'STU-2026-104', attendanceRate: '98.1%', status: 'Present' },
  { id: 'st-3', rollNo: '10-03', name: 'Zayn Malik', studentCode: 'STU-2026-112', attendanceRate: '91.0%', status: 'Late' },
  { id: 'st-4', rollNo: '10-04', name: 'Fatima Noor', studentCode: 'STU-2026-118', attendanceRate: '99.2%', status: 'Present' },
  { id: 'st-5', rollNo: '10-05', name: 'Hamza Tariq', studentCode: 'STU-2026-125', attendanceRate: '88.5%', status: 'Absent' },
  { id: 'st-6', rollNo: '10-06', name: 'Aaliyah Khan', studentCode: 'STU-2026-130', attendanceRate: '94.0%', status: 'Present' }
];

const DEFAULT_HOMEWORK_LIST = [
  { id: 'hw-1', title: 'Binary Search Tree Implementation', subject: 'Computer Science', class: 'Grade 11-A', dueDate: '2026-09-25', submissionsCount: '24 / 28', status: 'Grading in Progress' },
  { id: 'hw-2', title: 'Arduino Sensor Circuit Diagram', subject: 'Robotics & STEM', class: 'Grade 10-A', dueDate: '2026-09-28', submissionsCount: '19 / 30', status: 'Active' },
  { id: 'hw-3', title: 'Recursion and Big-O Complexity Essay', subject: 'Data Structures', class: 'Grade 12-B', dueDate: '2026-09-22', submissionsCount: '26 / 26', status: 'Graded' }
];

const DEFAULT_EXAMS_LIST = [
  { id: 'ex-1', title: 'Mid-Term Theory Examination', subject: 'Advanced Computer Science', maxMarks: 100, class: 'Grade 11-A', examDate: '2026-10-14', status: 'Schedule Confirmed' },
  { id: 'ex-2', title: 'Robotics Practical Lab Evaluation', subject: 'Robotics & STEM', maxMarks: 50, class: 'Grade 10-A', examDate: '2026-10-18', status: 'Draft Schedule' }
];

const DEFAULT_LEAVE_REQUESTS = [
  { id: 'lv-1', reason: 'Annual Faculty Research Symposium', startDate: '2026-10-05', endDate: '2026-10-07', substituteTeacher: 'Prof. Marcus Vance', status: 'APPROVED' },
  { id: 'lv-2', reason: 'Family Medical Emergency', startDate: '2026-11-12', endDate: '2026-11-12', substituteTeacher: 'Prof. Niaz Dars', status: 'PENDING' }
];

export const TeacherPortal = () => {
  const { addNotification, switchToSuperAdmin, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [scheduleData, setScheduleData] = useState(DEFAULT_SCHEDULE_DATA);
  const [studentsData, setStudentsData] = useState(DEFAULT_STUDENTS_ROSTER);
  const [selectedClassId, setSelectedClassId] = useState('class-10a');
  const [homeworkList, setHomeworkList] = useState(DEFAULT_HOMEWORK_LIST);
  const [examsList, setExamsList] = useState(DEFAULT_EXAMS_LIST);
  const [leaveRequests, setLeaveRequests] = useState(DEFAULT_LEAVE_REQUESTS);

  // Form states
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [newHomework, setNewHomework] = useState({ classId: 'class-10a', subjectId: 'subj-physics', title: '', dueDate: '' });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '', substituteTeacher: 'Prof. Marcus Vance' });

  // Optional backend sync with clean fallback
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const res = await apiClient.get('/teacher-portal/dashboard');
        if (res?.success && res?.data) setDashboardData(res.data);
      } catch (e) {
        // Offline demo fallback retains defaults
      }
    };
    syncBackend();
  }, []);

  const handleCreateHomework = (e) => {
    e.preventDefault();
    if (!newHomework.title || !newHomework.dueDate) {
      addNotification('Please enter title and due date', 'error');
      return;
    }
    const created = {
      id: `hw-${Date.now()}`,
      title: newHomework.title,
      subject: 'Computer Science',
      class: newHomework.classId === 'class-10a' ? 'Grade 10-A' : 'Grade 11-A',
      dueDate: newHomework.dueDate,
      submissionsCount: '0 / 28',
      status: 'Active'
    };
    setHomeworkList([created, ...homeworkList]);
    addNotification('Homework assignment published to student class stream!', 'success');
    setShowHomeworkModal(false);
    setNewHomework({ classId: 'class-10a', subjectId: 'subj-physics', title: '', dueDate: '' });
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      addNotification('Please complete all leave fields', 'error');
      return;
    }
    const created = {
      id: `lv-${Date.now()}`,
      reason: newLeave.reason,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      substituteTeacher: newLeave.substituteTeacher,
      status: 'PENDING'
    };
    setLeaveRequests([created, ...leaveRequests]);
    addNotification('Leave application submitted for administrative review!', 'success');
    setShowLeaveModal(false);
    setNewLeave({ startDate: '', endDate: '', reason: '', substituteTeacher: 'Prof. Marcus Vance' });
  };

  const toggleStudentAttendance = (studentId, status) => {
    setStudentsData(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    addNotification(`Attendance recorded: ${status}`, 'info');
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#0b1c30] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#e05626]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              Faculty & Educator Workspace
            </span>
            <span className="text-xs text-slate-400 font-mono">Assigned Class Scope Enforced</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Welcome, {dashboardData?.teacherName || 'Dr. Sarah Jenkins'}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
            Manage your assigned classes, mark attendance, issue homework assignments, grade exam marks, and submit leave requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {userRole !== 'SUPER_ADMIN' && (
            <button
              onClick={switchToSuperAdmin}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Return to Super Admin</span>
            </button>
          )}

          <button
            onClick={() => setShowLeaveModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Submit Leave Request</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'dashboard', name: 'Dashboard Overview', icon: Users },
          { id: 'schedule', name: "Today's Schedule & Timetable", icon: Clock },
          { id: 'students', name: 'Assigned Students Roster', icon: UserCheck },
          { id: 'attendance', name: 'Attendance Marking', icon: Calendar },
          { id: 'homework', name: 'Homework & Assignments', icon: BookOpen },
          { id: 'exams_marks', name: 'Exam Marks Entry', icon: Award },
          { id: 'leave_requests', name: 'My Leave Applications', icon: FileText }
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
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Classes</span>
                <span className="font-display font-bold text-3xl text-emerald-600 block">{dashboardData.assignedClassesCount} Classes</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Subjects</span>
                <span className="font-display font-bold text-3xl text-blue-600 block">{dashboardData.assignedSubjectsCount} Subjects</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Periods</span>
                <span className="font-display font-bold text-3xl text-purple-600 block">{dashboardData.todayClassesCount} Periods</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Submissions</span>
                <span className="font-display font-bold text-3xl text-amber-600 block">{dashboardData.pendingHomeworkGrading} Pending</span>
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">Today's Class Schedule</h3>
                <span className="text-[11px] text-slate-500 font-mono">Current Term: Fall 2026</span>
              </div>
              <div className="space-y-3">
                {dashboardData.todayClasses.map((cls, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{cls.subject} ({cls.class})</span>
                      <span className="text-slate-500 font-mono text-xs block mt-0.5">{cls.period} | Location: {cls.room}</span>
                    </div>
                    <Badge variant={cls.status === 'In Progress' ? 'primary' : 'success'}>{cls.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE & TIMETABLE */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Weekly Teaching Timetable</h3>
                <p className="text-slate-500 text-xs">Academic Session 2026-2027 Schedule</p>
              </div>
              <Badge variant="primary">Fall Term Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduleData.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{item.day}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{item.time}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.subject}</h4>
                    <p className="text-slate-500 text-xs">{item.class} • {item.room}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED STUDENTS ROSTER */}
        {activeTab === 'students' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">Enrolled Students Roster</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Class Scope:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none"
                >
                  <option value="class-10a">Grade 10 - Sec A</option>
                  <option value="class-11a">Grade 11 - Sec A</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-mono text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Admission Code</th>
                    <th className="p-3">Attendance Rate</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsData.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 font-mono text-slate-500">{st.studentCode}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{st.attendanceRate}</td>
                      <td className="p-3">
                        <Badge variant={st.status === 'Present' ? 'success' : st.status === 'Late' ? 'warning' : 'danger'}>
                          {st.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDANCE MARKING */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Daily Attendance Marking</h3>
                <p className="text-slate-500 text-xs">Grade 10 - Section A • Today's Roll Call</p>
              </div>
              <button
                onClick={() => addNotification('All attendance records successfully saved to institutional ledger!', 'success')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                Save Attendance Ledger
              </button>
            </div>
            <div className="space-y-2">
              {studentsData.map((st) => (
                <div key={st.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{st.name}</span>
                    <span className="text-slate-500 font-mono text-[11px] block">{st.rollNo} | {st.studentCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStudentAttendance(st.id, 'Present')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        st.status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => toggleStudentAttendance(st.id, 'Late')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        st.status === 'Late' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => toggleStudentAttendance(st.id, 'Absent')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        st.status === 'Absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HOMEWORK & ASSIGNMENTS */}
        {activeTab === 'homework' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Homework & Task Assignments</h3>
                <p className="text-slate-500 text-xs">Class Assignments and Digital Homework Submissions</p>
              </div>
              <button
                onClick={() => setShowHomeworkModal(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl shadow-soft transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Homework</span>
              </button>
            </div>
            <div className="space-y-3">
              {homeworkList.map((hw) => (
                <div key={hw.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                    <p className="text-slate-500 text-xs">{hw.subject} • {hw.class} | Due: {hw.dueDate}</p>
                    <span className="text-[11px] font-mono text-primary font-bold mt-1 block">Submissions: {hw.submissionsCount}</span>
                  </div>
                  <Badge variant={hw.status === 'Active' ? 'primary' : hw.status === 'Graded' ? 'success' : 'warning'}>
                    {hw.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXAM MARKS ENTRY */}
        {activeTab === 'exams_marks' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Examinations & Marks Ledger</h3>
                <p className="text-slate-500 text-xs">Scheduled Evaluations & Continuous Assessment Evaluation</p>
              </div>
              <button
                onClick={() => addNotification('Exam gradebook successfully synced with Student Academic Portal!', 'success')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                Submit Exam Marks
              </button>
            </div>
            <div className="space-y-3">
              {examsList.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{ex.title}</h4>
                    <p className="text-slate-500 text-xs">{ex.subject} ({ex.class}) • Max Marks: {ex.maxMarks} • Exam Date: {ex.examDate}</p>
                  </div>
                  <Badge variant="success">{ex.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LEAVE APPLICATIONS */}
        {activeTab === 'leave_requests' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">Faculty Leave Applications Log</h3>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl shadow-soft transition-all"
              >
                Submit New Application
              </button>
            </div>
            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{req.reason}</span>
                    <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                      Dates: {req.startDate} to {req.endDate} | Substitute: {req.substituteTeacher}
                    </span>
                  </div>
                  <Badge variant={req.status === 'APPROVED' ? 'success' : 'warning'}>{req.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE HOMEWORK MODAL */}
      {showHomeworkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-base text-slate-900">Publish New Class Homework</h3>
              <button onClick={() => setShowHomeworkModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateHomework} className="space-y-3 text-xs">
              <FormInput
                label="Assignment Title *"
                required
                placeholder="e.g. Chapter 4 Problem Set"
                value={newHomework.title}
                onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
              />
              <FormInput
                label="Due Date *"
                type="date"
                required
                value={newHomework.dueDate}
                onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
              />
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowHomeworkModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-white font-bold">Publish Homework</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE APPLICATION MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-base text-slate-900">Submit Faculty Leave Application</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Start Date *"
                  type="date"
                  required
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                />
                <FormInput
                  label="End Date *"
                  type="date"
                  required
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                />
              </div>
              <FormInput
                label="Reason for Leave *"
                required
                placeholder="e.g. Academic Research Workshop"
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
              <FormInput
                label="Substitute Faculty Recommendation"
                value={newLeave.substituteTeacher}
                onChange={(e) => setNewLeave({ ...newLeave, substituteTeacher: e.target.value })}
              />
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

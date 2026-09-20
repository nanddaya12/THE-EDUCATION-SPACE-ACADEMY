import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  Activity, 
  Download, 
  Edit, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';

export const StudentMasterProfile = ({ student, onClose, onEdit }) => {
  const { addNotification, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!student) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academic', label: 'Academic' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'homework', label: 'Homework' },
    { id: 'exams', label: 'Exams' },
    { id: 'fees', label: 'Fees' },
    { id: 'documents', label: 'Documents' },
    { id: 'communication', label: 'Communication' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
      {/* 1. MASTER PROFILE HEADER */}
      <div className="p-5 md:p-6 bg-[#0b1c30] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#e05626] text-white font-bold text-2xl flex items-center justify-center shadow-md border-2 border-white/20">
            {student.fullName ? student.fullName.charAt(0) : 'S'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                {student.fullName}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {student.status || 'Active'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono">
              <span>ID: <strong className="text-white">{student.admissionNo || student.studentCode || 'STU-2026-089'}</strong></span>
              <span>•</span>
              <span>Roll: <strong className="text-white">{student.rollNo || '11-04'}</strong></span>
              <span>•</span>
              <span className="text-amber-300 font-sans">{student.batch || 'Grade 11 - Section A (Pre-Engineering)'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(student)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => addNotification(`Direct message thread opened with guardian of ${student.fullName}`, 'info')}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>Message Parent</span>
          </button>

          <button
            onClick={() => addNotification('Official certified transcript PDF generated for student', 'success')}
            className="bg-[#e05626] hover:bg-[#c9461b] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-2"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="flex items-center gap-1 px-4 md:px-6 pt-3 border-b border-slate-200 overflow-x-auto bg-slate-50/70">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-t-lg font-bold text-xs whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-[#e05626] text-[#e05626] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENTS CANVAS */}
      <div className="p-5 md:p-6 min-h-[300px] text-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Bio & Identification</span>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500">Gender:</span> <strong>{student.gender || 'Male'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Date of Birth:</span> <strong>14 March 2009</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Email:</span> <strong className="font-mono">{student.email || 'alex.rivera@edu.com'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Contact:</span> <strong className="font-mono">{student.phone || '+92 333 5551234'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <strong className="text-rose-600 font-bold">B+ Positive</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Parent & Guardian Information</span>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500">Primary Guardian:</span> <strong>{student.guardianName || 'Robert Rivera'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Relationship:</span> <strong>Father</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Guardian Phone:</span> <strong className="font-mono">{student.guardianPhone || '+92 301 9991122'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Residential Address:</span> <strong>Sector F-7/2, Islamabad</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Emergency Contact:</span> <strong className="text-emerald-700 font-bold">Authorized</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Institutional Enrollment</span>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span className="text-slate-500">Campus:</span> <strong>TES Main Campus</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Academic Year:</span> <strong>2026–2027</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Admission Date:</span> <strong>September 2024</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Fee Status:</span> <strong className="text-emerald-600 font-bold">Paid in Full</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Attendance Rate:</span> <strong className="text-primary font-bold">96.4%</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Enrolled Courses & Academic Curriculum</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-mono text-slate-600 border-b border-slate-200">
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Lead Teacher</th>
                    <th className="p-3">Credit Hours</th>
                    <th className="p-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Advanced Computer Science & Algorithms</td>
                    <td className="p-3 font-mono text-slate-600">CS-501</td>
                    <td className="p-3 text-slate-700">Dr. Sarah Jenkins</td>
                    <td className="p-3 font-mono">4.0 Credits</td>
                    <td className="p-3 text-slate-500">STEM Lab 2</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Mathematics & Mechanics</td>
                    <td className="p-3 font-mono text-slate-600">MTH-402</td>
                    <td className="p-3 text-slate-700">Prof. Marcus Vance</td>
                    <td className="p-3 font-mono">4.0 Credits</td>
                    <td className="p-3 text-slate-500">Room 204</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Physics & Electro-dynamics</td>
                    <td className="p-3 font-mono text-slate-600">PHY-401</td>
                    <td className="p-3 text-slate-700">Dr. Elena Rostova</td>
                    <td className="p-3 font-mono">3.0 Credits</td>
                    <td className="p-3 text-slate-500">Physics Lab 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Attendance Presence Journal</h4>
                <p className="text-slate-500 text-[11px]">Cumulative presence rate: 96.4% (38 Present, 1 Late, 1 Excused Medical)</p>
              </div>
              <Badge variant="success">96.4% Attendance</Badge>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-mono text-slate-600 border-b border-slate-200">
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Teacher / System Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">2026-09-18</td>
                    <td className="p-3"><Badge variant="success">PRESENT</Badge></td>
                    <td className="p-3 text-slate-600">On time, active participation</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">2026-09-17</td>
                    <td className="p-3"><Badge variant="success">PRESENT</Badge></td>
                    <td className="p-3 text-slate-600">On time</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">2026-09-16</td>
                    <td className="p-3"><Badge variant="warning">LATE</Badge></td>
                    <td className="p-3 text-slate-600">Late by 12 mins (Transit delay)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">2026-09-12</td>
                    <td className="p-3"><Badge variant="danger">ABSENT</Badge></td>
                    <td className="p-3 text-slate-600">Excused - Doctor Slip Approved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Assigned Homework & Course Deliverables</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">Binary Search Tree Implementation</h5>
                  <span className="text-[11px] text-slate-500">Computer Science • Due: 25 Sep 2026</span>
                </div>
                <Badge variant="success">Submitted & Under Review</Badge>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">Electro-magnetic Induction Numerical Problems</h5>
                  <span className="text-[11px] text-slate-500">Physics • Due: 28 Sep 2026</span>
                </div>
                <Badge variant="warning">Pending Submission</Badge>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Examination Results & GPA</h4>
                <p className="text-slate-500 text-[11px]">Mid-Term Progress Examination 2026</p>
              </div>
              <Badge variant="success">GPA: 3.88 / 4.0</Badge>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-mono text-slate-600 border-b border-slate-200">
                    <th className="p-3">Course</th>
                    <th className="p-3">Total Marks</th>
                    <th className="p-3">Obtained</th>
                    <th className="p-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="p-3 font-bold">Advanced Computer Science</td><td className="p-3 font-mono">100</td><td className="p-3 font-mono font-bold">96</td><td className="p-3 font-bold text-emerald-600">A+</td></tr>
                  <tr><td className="p-3 font-bold">Mathematics & Mechanics</td><td className="p-3 font-mono">100</td><td className="p-3 font-mono font-bold">94</td><td className="p-3 font-bold text-emerald-600">A+</td></tr>
                  <tr><td className="p-3 font-bold">Physics & Electro-dynamics</td><td className="p-3 font-mono">100</td><td className="p-3 font-mono font-bold">90</td><td className="p-3 font-bold text-emerald-600">A</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FEES */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Fee Ledger & Challans</h4>
                <p className="text-slate-500 text-[11px]">Challan #CH-2026-0988 • Billing Month: September 2026</p>
              </div>
              <Badge variant="success">PAID IN FULL</Badge>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between"><span>Tuition Fee (Cambridge / STEM):</span> <strong className="font-mono">PKR 35,000</strong></div>
              <div className="flex justify-between"><span>Computer Science Lab Fee:</span> <strong className="font-mono">PKR 5,000</strong></div>
              <div className="flex justify-between"><span>Library & Digital Subscriptions:</span> <strong className="font-mono">PKR 3,000</strong></div>
              <div className="flex justify-between"><span>Campus Activities:</span> <strong className="font-mono">PKR 2,000</strong></div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Paid:</span>
                <span className="text-emerald-600 font-mono">PKR 45,000</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Official Institutional Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <h5 className="font-bold text-slate-900">Official Grade Transcript</h5>
                    <span className="text-[10px] text-slate-400">PDF • Verified</span>
                  </div>
                </div>
                <button 
                  onClick={() => addNotification('Downloading Grade Transcript PDF', 'success')}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <h5 className="font-bold text-slate-900">Bonafide Student Certificate</h5>
                    <span className="text-[10px] text-slate-400">PDF • Issued</span>
                  </div>
                </div>
                <button 
                  onClick={() => addNotification('Downloading Bonafide Certificate PDF', 'success')}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: COMMUNICATION */}
        {activeTab === 'communication' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Parent-Teacher & Academy Communications</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Dr. Sarah Jenkins (Faculty)</span>
                  <span className="text-[10px] font-mono text-slate-400">Yesterday, 02:40 PM</span>
                </div>
                <p className="text-slate-600 mt-1">"Alex demonstrated exceptional skill in algorithmic recursion during the robotics showcase."</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Co-Curricular & Academy Clubs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900">Robotics & AI Society</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">Team Captain • Junior STEM Olympiad 2026 Gold Medalist</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900">Varsity Badminton Club</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">Active Player • Inter-Campus Sports League</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

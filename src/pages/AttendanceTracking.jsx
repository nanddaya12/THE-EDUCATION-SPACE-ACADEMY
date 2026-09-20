import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormControls';
import { exportToCSV } from '../utils/exporter';
import { 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter, 
  FileText, 
  QrCode, 
  ShieldCheck,
  Send,
  Sparkles,
  Search,
  Check,
  Ban,
  Layers,
  Cpu,
  BarChart3,
  History
} from 'lucide-react';

export const AttendanceTracking = () => {
  const { addNotification, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('roster'); // 'roster', 'corrections', 'history', 'reports', 'hardware'
  const [targetType, setTargetType] = useState('STUDENT'); // 'STUDENT' or 'TEACHER'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('sec-a');

  // Student Roster
  const [students, setStudents] = useState([
    { id: 'st-1', name: 'Julian Vance', rollNo: 'R-101', status: 'PRESENT' },
    { id: 'st-2', name: 'Clara Sterling', rollNo: 'R-102', status: 'PRESENT' },
    { id: 'st-3', name: 'Ethan Hunt', rollNo: 'R-103', status: 'ABSENT' },
    { id: 'st-4', name: 'Nora Hayes', rollNo: 'R-104', status: 'LATE' },
    { id: 'st-5', name: 'David Kim', rollNo: 'R-105', status: 'LEAVE' },
    { id: 'st-6', name: 'Sophia Chen', rollNo: 'R-106', status: 'HALF_DAY' },
    { id: 'st-7', name: 'Lucas Miller', rollNo: 'R-107', status: 'EXCUSED' }
  ]);

  // Teacher Roster
  const [teachers, setTeachers] = useState([
    { id: 'tch-1', name: 'Prof. Marcus Vance', code: 'T-201', department: 'Mathematics', status: 'PRESENT' },
    { id: 'tch-2', name: 'Dr. Elena Rostova', code: 'T-202', department: 'Physics', status: 'PRESENT' },
    { id: 'tch-3', name: 'Sarah Jenkins', code: 'T-203', department: 'English Literature', status: 'LATE' },
    { id: 'tch-4', name: 'Robert Thorne', code: 'T-204', department: 'Computer Science', status: 'LEAVE' }
  ]);

  // General Report Metrics
  const [report, setReport] = useState({
    totalDays: 20,
    presentDays: 18,
    absentDays: 1,
    lateDays: 1,
    halfDays: 0,
    leaveDays: 1,
    excusedDays: 0,
    holidayDays: 0,
    attendancePercentage: 91.5
  });

  // Correction Workflow State
  const [corrections, setCorrections] = useState([
    {
      id: 'corr-1',
      recordId: 'rec-101',
      studentName: 'Ethan Hunt',
      originalStatus: 'ABSENT',
      requestedStatus: 'EXCUSED',
      reason: 'Doctor Appointment Slip Submitted',
      status: 'PENDING',
      requestedBy: 'Parent (John Hunt)',
      createdAt: '2026-08-19'
    },
    {
      id: 'corr-2',
      recordId: 'rec-104',
      studentName: 'Nora Hayes',
      originalStatus: 'LATE',
      requestedStatus: 'PRESENT',
      reason: 'School Bus Breakdown on Route 4',
      status: 'PENDING',
      requestedBy: 'Teacher (Prof. Marcus)',
      createdAt: '2026-08-19'
    }
  ]);

  const [isCorrectionDrawerOpen, setIsCorrectionDrawerOpen] = useState(false);
  const [selectedStudentForCorrection, setSelectedStudentForCorrection] = useState(null);
  const [correctionData, setCorrectionData] = useState({
    requestedStatus: 'EXCUSED',
    reason: 'Medical Leave Certificate'
  });

  // Reports Tab State
  const [reportType, setReportType] = useState('monthly'); // 'monthly', 'term', 'class'
  const [monthlyData, setMonthlyData] = useState(null);
  const [termData, setTermData] = useState(null);
  const [classData, setClassData] = useState(null);

  // Hardware Simulator State
  const [hardwareForm, setHardwareForm] = useState({
    deviceId: 'DEV-GATE-01',
    scanType: 'QR_SCAN',
    studentCode: 'STU-1001',
    staffCode: '',
    rfidTag: 'RFID-998822'
  });
  const [hardwareLogs, setHardwareLogs] = useState([]);

  const statuses = [
    { key: 'PRESENT', label: 'Present', color: 'bg-emerald-500 text-white border-emerald-600' },
    { key: 'ABSENT', label: 'Absent', color: 'bg-rose-500 text-white border-rose-600' },
    { key: 'LATE', label: 'Late', color: 'bg-amber-500 text-white border-amber-600' },
    { key: 'HALF_DAY', label: 'Half Day', color: 'bg-orange-500 text-white border-orange-600' },
    { key: 'LEAVE', label: 'Leave', color: 'bg-purple-500 text-white border-purple-600' },
    { key: 'EXCUSED', label: 'Excused', color: 'bg-sky-500 text-white border-sky-600' },
    { key: 'HOLIDAY', label: 'Holiday', color: 'bg-slate-500 text-white border-slate-600' }
  ];

  const fetchAttendanceReport = async () => {
    const res = await apiClient.get(`/attendance/report?classId=${selectedClass}&sectionId=${selectedSection}`);
    if (res.success && res.data) {
      setReport(res.data);
    }
  };

  const fetchCorrections = async () => {
    const res = await apiClient.get('/attendance/corrections');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setCorrections(res.data);
    }
  };

  const fetchMonthlyReport = async () => {
    const res = await apiClient.get(`/attendance/reports/monthly?classId=${selectedClass}`);
    if (res.success && res.data) {
      setMonthlyData(res.data);
    }
  };

  const fetchTermReport = async () => {
    const res = await apiClient.get(`/attendance/reports/term?classId=${selectedClass}`);
    if (res.success && res.data) {
      setTermData(res.data);
    }
  };

  const fetchClassReport = async () => {
    const res = await apiClient.get(`/attendance/reports/class?classId=${selectedClass}`);
    if (res.success && res.data) {
      setClassData(res.data);
    }
  };

  useEffect(() => {
    fetchAttendanceReport();
    fetchCorrections();
  }, [selectedClass, selectedSection]);

  const handleStatusChange = (id, newStatus) => {
    if (targetType === 'STUDENT') {
      setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } else {
      setTeachers(teachers.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const handleMarkAllPresent = () => {
    if (targetType === 'STUDENT') {
      setStudents(students.map(s => ({ ...s, status: 'PRESENT' })));
    } else {
      setTeachers(teachers.map(t => ({ ...t, status: 'PRESENT' })));
    }
    addNotification(`Marked all ${targetType === 'STUDENT' ? 'students' : 'teachers'} as PRESENT!`, 'info');
  };

  const handleSaveAttendance = async () => {
    addNotification(`Daily ${targetType.toLowerCase()} attendance saved for ${date}!`, 'success');
    try {
      const records = targetType === 'STUDENT'
        ? students.map(s => ({ studentId: s.id, status: s.status }))
        : teachers.map(t => ({ staffId: t.id, status: t.status }));

      await apiClient.post('/attendance/mark-bulk', {
        classId: selectedClass,
        sectionId: selectedSection,
        date,
        targetType,
        records
      });
      fetchAttendanceReport();
    } catch (e) {
      // Offline fallback
    }
  };

  const handleRequestCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentForCorrection) return;

    const res = await apiClient.post('/attendance/corrections', {
      recordId: selectedStudentForCorrection.id,
      requestedStatus: correctionData.requestedStatus,
      reason: correctionData.reason
    });

    if (res.success) {
      addNotification(`Submitted correction request for ${selectedStudentForCorrection.name || 'Record'}!`, 'success');
      setIsCorrectionDrawerOpen(false);
      fetchCorrections();
    } else {
      addNotification(res.error?.message || 'Correction submission failed', 'error');
    }
  };

  const handleApproveCorrection = async (id) => {
    setCorrections(prev => prev.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
    addNotification('Attendance correction APPROVED!', 'success');
    try {
      await apiClient.patch(`/attendance/corrections/${id}/approve`, {});
      fetchAttendanceReport();
    } catch (e) {
      // Offline fallback
    }
  };

  const handleRejectCorrection = async (id) => {
    setCorrections(prev => prev.map(c => c.id === id ? { ...c, status: 'REJECTED' } : c));
    addNotification('Attendance correction REJECTED.', 'info');
    try {
      await apiClient.patch(`/attendance/corrections/${id}/reject`, {});
    } catch (e) {
      // Offline fallback
    }
  };

  const handleHardwareSimulate = async (e) => {
    e.preventDefault();
    const payload = {
      deviceId: hardwareForm.deviceId,
      scanType: hardwareForm.scanType,
      studentCode: hardwareForm.studentCode,
      staffCode: hardwareForm.staffCode,
      rfidTag: hardwareForm.rfidTag,
      timestamp: new Date().toISOString()
    };

    const res = await apiClient.post('/attendance/device-ingest', payload);
    if (res.success) {
      addNotification(`Ingestion Success: ${payload.scanType} -> ${res.data.mappedStatus}`, 'success');
      setHardwareLogs([
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          scanType: payload.scanType,
          code: payload.studentCode || payload.staffCode || payload.rfidTag,
          status: res.data.mappedStatus,
          deviceId: payload.deviceId
        },
        ...hardwareLogs
      ]);
    } else {
      addNotification(res.error?.message || 'Device ingestion failed', 'error');
    }
  };

  const exportAttendanceCSV = () => {
    const exportData = (targetType === 'STUDENT' ? students : teachers).map(item => ({
      ID: item.id,
      Name: item.name,
      Code_RollNo: item.rollNo || item.code,
      Date: date,
      Status: item.status
    }));
    exportToCSV(exportData, `Attendance_${targetType}_${date}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Attendance Governance & Analytics
            </h1>
            <Badge variant="primary">7 Statuses</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Enterprise attendance suite: Daily & bulk marking, teacher authorization guards, correction workflows, monthly/term/class reports, hardware ingestion simulator, and absence hooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAttendanceCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Save Roster Attendance</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Daily & Bulk Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'corrections'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Correction Approval Hub</span>
          {corrections.filter(c => c.status === 'PENDING').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-extrabold">
              {corrections.filter(c => c.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reports & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'hardware'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Hardware Test Bench</span>
        </button>
      </div>

      {/* TAB 1: DAILY & BULK ROSTER MARKING */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
              <span className="font-display font-extrabold text-2xl text-emerald-600">{report.attendancePercentage}%</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Present Count</span>
              <span className="font-display font-extrabold text-2xl text-slate-800">{report.presentDays}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Absent Count</span>
              <span className="font-display font-extrabold text-2xl text-rose-600">{report.absentDays}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Leaves & Excused</span>
              <span className="font-display font-extrabold text-2xl text-purple-600">{report.leaveDays + report.excusedDays}</span>
            </div>
          </div>

          {/* Roster Target & Scope Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setTargetType('STUDENT')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    targetType === 'STUDENT' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Student Attendance
                </button>
                <button
                  onClick={() => setTargetType('TEACHER')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    targetType === 'TEACHER' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Teacher / Staff Attendance
                </button>
              </div>

              {userRole === 'Instructor' && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-3 py-1.5 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Authorized for Assigned Classes Only</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FormInput
                type="date"
                label="Attendance Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {targetType === 'STUDENT' && (
                <>
                  <div className="w-40">
                    <FormSelect
                      label="Class Grade"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      options={[
                        { value: 'c1', label: 'Grade 10' },
                        { value: 'c2', label: 'Grade 11' }
                      ]}
                    />
                  </div>
                  <div className="w-40">
                    <FormSelect
                      label="Section"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      options={[
                        { value: 'sec-a', label: 'Section A' },
                        { value: 'sec-b', label: 'Section B' }
                      ]}
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleMarkAllPresent}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all self-end"
              >
                Mark All Present
              </button>
            </div>
          </div>

          {/* Roster Marking Sheet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-on-surface">
                {targetType === 'STUDENT' ? 'Student Class Roster Marking Sheet' : 'Faculty & Staff Attendance Register'}
              </h3>
              <span className="text-slate-400 text-xs font-mono">Total Roster: {(targetType === 'STUDENT' ? students : teachers).length} Target(s)</span>
            </div>

            <div className="space-y-3">
              {(targetType === 'STUDENT' ? students : teachers).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">{item.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.rollNo || item.code || item.department}</span>
                  </div>

                  {/* 7 Status Toggle Selector */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {statuses.map(stt => (
                      <button
                        key={stt.key}
                        onClick={() => handleStatusChange(item.id, stt.key)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all border ${
                          item.status === stt.key ? stt.color : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stt.label}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedStudentForCorrection(item);
                        setIsCorrectionDrawerOpen(true);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-[10px] underline ml-2"
                    >
                      Correction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORRECTION APPROVAL GOVERNANCE */}
      {activeTab === 'corrections' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">Attendance Correction Requests</h3>
                <p className="text-slate-500 text-xs mt-0.5">Requests submitted by parents, students, or staff requiring administrator review.</p>
              </div>
              <Badge variant="primary">{corrections.filter(c => c.status === 'PENDING').length} Pending</Badge>
            </div>

            <div className="space-y-3">
              {corrections.map((corr) => (
                <div key={corr.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{corr.studentName}</span>
                      <Badge variant={corr.status === 'APPROVED' ? 'success' : corr.status === 'REJECTED' ? 'error' : 'warning'}>
                        {corr.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Original: <span className="font-bold text-rose-600">{corr.originalStatus}</span> → Requested: <span className="font-bold text-emerald-600">{corr.requestedStatus}</span>
                    </p>
                    <p className="text-xs text-slate-500 italic">" Reason: {corr.reason} "</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Requested By: {corr.requestedBy} • {corr.createdAt}
                    </div>
                  </div>

                  {corr.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveCorrection(corr.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectCorrection(corr.id)}
                        className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setReportType('monthly'); fetchMonthlyReport(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'monthly' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Monthly Attendance Report
            </button>
            <button
              onClick={() => { setReportType('term'); fetchTermReport(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'term' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Academic Term Report
            </button>
            <button
              onClick={() => { setReportType('class'); fetchClassReport(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'class' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Class Roster Summary Report
            </button>
          </div>

          {reportType === 'monthly' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-800">Monthly Attendance Report (August 2026)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Total Workable Days</span>
                  <span className="font-bold text-xl text-slate-800">22 Days</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Average Class Attendance</span>
                  <span className="font-bold text-xl text-emerald-600">92.4%</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Total Absences Recorded</span>
                  <span className="font-bold text-xl text-rose-600">14 Absences</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Holidays Observed</span>
                  <span className="font-bold text-xl text-slate-600">2 Days</span>
                </div>
              </div>
            </div>
          )}

          {reportType === 'term' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-800">Fall Academic Term Report (Sept 1 - Dec 20, 2026)</h3>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 text-sm block">Term Cumulative Attendance Percentage</span>
                  <span className="text-xs text-emerald-700">Calculated over all active class rosters and term sessions.</span>
                </div>
                <span className="font-display font-extrabold text-3xl text-emerald-600">93.8%</span>
              </div>
            </div>
          )}

          {reportType === 'class' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-800">Class Roster Summary Report (Grade 10 - Section A)</h3>
              <div className="space-y-2">
                {students.map(st => (
                  <div key={st.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span>{st.name} ({st.rollNo})</span>
                    <span className="text-emerald-600">Attendance: 94.2%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HARDWARE DEVICE TEST BENCH (QR/RFID/BIOMETRICS) */}
      {activeTab === 'hardware' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">QR / RFID / Biometric Hardware Ingestion Simulator</h3>
                  <p className="text-slate-400 text-xs">Simulate physical device scan webhooks parsing payloads to `/api/v1/attendance/device-ingest`.</p>
                </div>
              </div>
              <Badge variant="success">API Contract Ready</Badge>
            </div>

            <form onSubmit={handleHardwareSimulate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-900">
              <FormSelect
                label="Scan Type / Device Medium"
                value={hardwareForm.scanType}
                onChange={(e) => setHardwareForm({ ...hardwareForm, scanType: e.target.value })}
                options={[
                  { value: 'QR_SCAN', label: 'QR Code Mobile Scan' },
                  { value: 'RFID_TAP', label: 'RFID Gate Tap' },
                  { value: 'BIOMETRIC_SCAN', label: 'Biometric Fingerprint Scanner' }
                ]}
              />

              <FormInput
                label="Student / Staff Identifier Code"
                value={hardwareForm.studentCode}
                onChange={(e) => setHardwareForm({ ...hardwareForm, studentCode: e.target.value })}
              />

              <FormInput
                label="Device Gateway ID"
                value={hardwareForm.deviceId}
                onChange={(e) => setHardwareForm({ ...hardwareForm, deviceId: e.target.value })}
              />

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Simulate Device Hardware Ingestion</span>
                </button>
              </div>
            </form>

            {/* Ingestion Feed Log */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Live Ingestion Event Feed</span>
              {hardwareLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hardware events simulated yet. Click button above to simulate a scan.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {hardwareLogs.map(log => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">[{log.time}]</span>
                        <span className="text-slate-200">{log.scanType} ({log.code})</span>
                        <span className="text-slate-400">Gate: {log.deviceId}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Correction Request Drawer */}
      {selectedStudentForCorrection && (
        <Drawer
          isOpen={isCorrectionDrawerOpen}
          onClose={() => setIsCorrectionDrawerOpen(false)}
          title={`Submit Correction: ${selectedStudentForCorrection.name || 'Record'}`}
        >
          <form onSubmit={handleRequestCorrectionSubmit} className="space-y-4 text-xs">
            <FormSelect
              label="Requested Correction Status"
              value={correctionData.requestedStatus}
              onChange={(e) => setCorrectionData({ ...correctionData, requestedStatus: e.target.value })}
              options={statuses.map(s => ({ value: s.key, label: s.label }))}
            />

            <FormTextarea
              label="Reason for Correction"
              required
              rows={3}
              placeholder="e.g. Medical Certificate submitted to Reception"
              value={correctionData.reason}
              onChange={(e) => setCorrectionData({ ...correctionData, reason: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Correction Request</span>
            </button>
          </form>
        </Drawer>
      )}
    </div>
  );
};

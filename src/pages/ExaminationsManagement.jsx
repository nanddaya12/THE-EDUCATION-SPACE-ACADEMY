import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  FileCheck, 
  Calculator,
  Sliders,
  Printer,
  FileText,
  Lock,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap
} from 'lucide-react';

export const ExaminationsManagement = () => {
  const { addNotification, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('exams'); // 'exams', 'components', 'marks', 'grading', 'reports'
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('sec-a');

  // Workflow Stages
  const WORKFLOW_STAGES = ['DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED'];

  // Exam Events List
  const [exams, setExams] = useState([
    {
      id: 'exam-101',
      name: 'Fall Mid-Term Examination 2026',
      examType: 'Mid-Term',
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      status: 'PUBLISHED',
      schedulesCount: 4
    },
    {
      id: 'exam-102',
      name: 'Spring Final Examination 2027',
      examType: 'Final Exam',
      startDate: '2027-05-10',
      endDate: '2027-05-25',
      status: 'DRAFT',
      schedulesCount: 0
    }
  ]);

  // Assessment Components List
  const [components, setComponents] = useState([
    { id: 'comp-1', name: 'Theory Paper', type: 'THEORY', maxMarks: 70, weightage: 70 },
    { id: 'comp-2', name: 'Lab Practical', type: 'PRACTICAL', maxMarks: 20, weightage: 20 },
    { id: 'comp-3', name: 'Classroom Quizzes', type: 'QUIZ', maxMarks: 10, weightage: 10 }
  ]);

  // Student Marks Roster
  const [studentsMarks, setStudentsMarks] = useState([
    { id: 'st-1', name: 'Julian Vance', rollNo: 'R-101', marksObtained: 65, isAbsent: false, remarks: 'Good work' },
    { id: 'st-2', name: 'Clara Sterling', rollNo: 'R-102', marksObtained: 68, isAbsent: false, remarks: 'Top scorer' },
    { id: 'st-3', name: 'Ethan Hunt', rollNo: 'R-103', marksObtained: 42, isAbsent: false, remarks: 'Pass' },
    { id: 'st-4', name: 'Nora Hayes', rollNo: 'R-104', marksObtained: 0, isAbsent: true, remarks: 'Absent' }
  ]);

  // Printable Report Card & Transcript Modals
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [reportCardData, setReportCardData] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);

  // Modals for creation
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({ name: '', examTypeId: 'ext-1', startDate: '2026-10-01', endDate: '2026-10-15' });
  const [componentForm, setComponentForm] = useState({ name: '', type: 'THEORY', maxMarks: 70, weightage: 70 });

  const fetchExams = async () => {
    const res = await apiClient.get('/exams');
    if (res.success && res.data && res.data.length > 0) {
      setExams(res.data);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleWorkflowTransition = async (examId, nextStatus) => {
    const res = await apiClient.patch(`/exams/${examId}/workflow`, { status: nextStatus });
    if (res.success) {
      addNotification(`Exam workflow transitioned to ${nextStatus}!`, 'success');
      setExams(exams.map(e => e.id === examId ? { ...e, status: nextStatus } : e));
    } else {
      addNotification(res.error?.message || 'Failed to transition workflow', 'error');
    }
  };

  const handleOpenReportCard = async (examId, studentId) => {
    const res = await apiClient.get(`/exams/${examId}/report-card/${studentId}`);
    if (res.success) {
      setReportCardData(res.data);
      setIsReportCardOpen(true);
    } else {
      addNotification(res.error?.message || 'Failed to fetch report card', 'error');
    }
  };

  const handleOpenTranscript = async (studentId) => {
    const res = await apiClient.get(`/exams/transcript/${studentId}`);
    if (res.success) {
      setTranscriptData(res.data);
      setIsTranscriptOpen(true);
    } else {
      addNotification(res.error?.message || 'Failed to fetch transcript', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateExamSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/exams', {
      examTypeId: examForm.examTypeId,
      name: examForm.name,
      startDate: examForm.startDate,
      endDate: examForm.endDate,
      status: 'DRAFT'
    });

    if (res.success) {
      addNotification(`Exam "${examForm.name}" created as DRAFT!`, 'success');
      setIsExamModalOpen(false);
      setExamForm({ name: '', examTypeId: 'ext-1', startDate: '2026-10-01', endDate: '2026-10-15' });
      fetchExams();
    } else {
      addNotification(res.error?.message || 'Failed to create exam', 'error');
    }
  };

  const handleCreateComponentSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/exams/components', {
      examScheduleId: 'sched-1',
      name: componentForm.name,
      type: componentForm.type,
      maxMarks: Number(componentForm.maxMarks),
      weightage: Number(componentForm.weightage)
    });

    if (res.success) {
      addNotification(`Assessment component "${componentForm.name}" added!`, 'success');
      setIsComponentModalOpen(false);
      setComponents([...components, { id: `comp-${Date.now()}`, ...componentForm }]);
    } else {
      addNotification(res.error?.message || 'Failed to create component', 'error');
    }
  };

  const handleSaveMarks = async () => {
    const records = studentsMarks.map(s => ({
      examScheduleId: 'sched-1',
      componentId: 'comp-1',
      studentId: s.id,
      marksObtained: s.marksObtained,
      isAbsent: s.isAbsent,
      remarks: s.remarks
    }));

    const res = await apiClient.post('/exams/marks/bulk', { classId: selectedClass, subjectId: 'sub-1', records });
    if (res.success) {
      addNotification('Student marks saved successfully!', 'success');
    } else {
      addNotification(res.error?.message || 'Failed to save marks', 'error');
    }
  };

  const handleCalculateResults = async (examId) => {
    const res = await apiClient.post(`/exams/${examId}/calculate-results`, {});
    if (res.success) {
      addNotification('Result calculation finished! Position ranks, percentages, and GPAs computed.', 'success');
      setExams(exams.map(e => e.id === examId ? { ...e, status: 'CALCULATED' } : e));
    } else {
      addNotification(res.error?.message || 'Calculation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Results Workflow & Academic Governance
            </h1>
            <Badge variant="primary">Workflow Engine</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Lifecycle workflow (DRAFT → REVIEW → APPROVED → PUBLISHED), rank calculations, lock protections, and printable report cards.
          </p>
        </div>

        {(userRole === 'SUPER_ADMIN' || userRole === 'Admin') && (
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exam Event</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'exams' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Exams & Workflow</span>
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'components' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Assessment Components</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'marks' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Marks Entry Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'grading' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Calculations & Ranks</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'reports' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Report Cards & Transcripts</span>
        </button>
      </div>

      {/* TAB 1: EXAM EVENTS & WORKFLOW STAGES */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={exam.status === 'PUBLISHED' ? 'success' : exam.status === 'APPROVED' ? 'primary' : 'warning'}>
                      {exam.status}
                    </Badge>
                    {exam.status === 'PUBLISHED' && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                        <Lock className="w-3 h-3" /> Locked & Protected
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">{exam.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Date Range: {exam.startDate} to {exam.endDate}
                    </p>
                  </div>

                  {/* Workflow Progress Stepper */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Workflow Stage Progress</span>
                    <div className="flex items-center gap-1">
                      {WORKFLOW_STAGES.map((stage, idx) => {
                        const isCurrent = exam.status === stage;
                        const isPassed = WORKFLOW_STAGES.indexOf(exam.status) > idx;
                        return (
                          <div key={stage} className="flex-1 flex flex-col items-center">
                            <div className={`w-full h-2 rounded-full mb-1 transition-all ${
                              isCurrent ? 'bg-primary' : isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                            }`} />
                            <span className={`text-[10px] font-bold ${
                              isCurrent ? 'text-primary' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                            }`}>{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {exam.status === 'DRAFT' && (
                      <button
                        onClick={() => handleWorkflowTransition(exam.id, 'REVIEW')}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Submit for Review
                      </button>
                    )}
                    {exam.status === 'REVIEW' && (
                      <button
                        onClick={() => handleWorkflowTransition(exam.id, 'APPROVED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Approve Results
                      </button>
                    )}
                    {exam.status === 'APPROVED' && (
                      <button
                        onClick={() => handleWorkflowTransition(exam.id, 'PUBLISHED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Publish Results</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleCalculateResults(exam.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Recalculate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRINTABLE REPORT CARDS & TRANSCRIPTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-card">
            <h3 className="font-display font-bold text-lg text-slate-900">Student Official Report Cards & Transcripts</h3>
            <p className="text-slate-500 text-xs">Generate printable academic report cards and multi-term transcripts with rank, GPA, and institutional seals.</p>

            <div className="space-y-3 pt-2">
              {studentsMarks.map((st) => (
                <div key={st.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{st.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{st.rollNo} • Grade 10 Section A</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReportCard('exam-101', st.id)}
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Print Report Card</span>
                    </button>

                    <button
                      onClick={() => handleOpenTranscript(st.id)}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic Transcript</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      <Modal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        title="Official Academic Report Card"
      >
        {reportCardData && (
          <div className="space-y-6 p-4 bg-white text-slate-900 print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">{reportCardData.institutionName}</h2>
                <p className="text-xs font-bold text-slate-500">{reportCardData.campusName} • Official Academic Report Card</p>
              </div>
              <Badge variant="success">OFFICIAL RESULT</Badge>
            </div>

            {/* Student Profile Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-mono border border-slate-200">
              <div>
                <span className="text-slate-400 block">Student Name:</span>
                <span className="font-bold text-slate-900">{reportCardData.student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Roll Number:</span>
                <span className="font-bold text-slate-900">{reportCardData.student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Grade & Section:</span>
                <span className="font-bold text-slate-900">{reportCardData.student.classGrade} ({reportCardData.student.section})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Exam Term:</span>
                <span className="font-bold text-slate-900">{reportCardData.exam.title} ({reportCardData.exam.session})</span>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Subject</th>
                    <th className="p-2.5 text-center">Max Marks</th>
                    <th className="p-2.5 text-center">Obtained</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5 text-center">GPA</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportCardData.subjectResults.map((sub) => (
                    <tr key={sub.code}>
                      <td className="p-2.5 font-bold">{sub.name}</td>
                      <td className="p-2.5 text-center font-mono">{sub.maxMarks}</td>
                      <td className="p-2.5 text-center font-mono font-bold">{sub.marksObtained}</td>
                      <td className="p-2.5 text-center font-bold text-primary">{sub.grade}</td>
                      <td className="p-2.5 text-center font-mono">{sub.gpa}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{sub.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-4 gap-2 bg-slate-900 text-white p-4 rounded-xl text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Grand Total</span>
                <span className="font-bold text-base font-mono">{reportCardData.summary.totalMarksObtained} / {reportCardData.summary.totalMaxMarks}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Percentage</span>
                <span className="font-bold text-base font-mono text-emerald-400">{reportCardData.summary.overallPercentage}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Class Rank</span>
                <span className="font-bold text-base font-mono text-amber-400">#{reportCardData.summary.classRank}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Section Rank</span>
                <span className="font-bold text-base font-mono text-cyan-400">#{reportCardData.summary.sectionRank}</span>
              </div>
            </div>

            {/* Print Action */}
            <button
              onClick={handlePrint}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Report Card PDF</span>
            </button>
          </div>
        )}
      </Modal>

      {/* Printable Academic Transcript Modal */}
      <Modal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        title="Multi-Term Academic Transcript"
      >
        {transcriptData && (
          <div className="space-y-6 p-4 bg-white text-slate-900 print:p-0">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">{transcriptData.institutionName}</h2>
                <p className="text-xs font-bold text-slate-500">Official Multi-Term Academic Transcript</p>
              </div>
              <Badge variant="primary">CGPA: {transcriptData.cumulativeSummary.cumulativeGPA}</Badge>
            </div>

            <div className="space-y-4">
              {transcriptData.academicHistory.map((termRecord, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold bg-slate-100 p-2 rounded-lg">
                    <span>{termRecord.session} • {termRecord.term} ({termRecord.classGrade})</span>
                    <span className="text-primary">Term GPA: {termRecord.termGPA}</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    {termRecord.courses.map((c) => (
                      <div key={c.code} className="flex items-center justify-between font-mono text-[11px] py-1 border-b border-slate-100">
                        <span>{c.code} - {c.title}</span>
                        <span className="font-bold">{c.marks} Marks ({c.grade})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Transcript PDF</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

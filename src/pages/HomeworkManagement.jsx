import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormControls';
import { 
  FileText, 
  Plus, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  Award, 
  Paperclip, 
  Eye, 
  AlertCircle,
  User,
  BookOpen,
  Edit3,
  Globe,
  Lock,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const HomeworkManagement = () => {
  const { addNotification, userRole } = useApp();

  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('sec-a');

  // Parent Linked Child State
  const [selectedChild, setSelectedChild] = useState('st-1');
  const [parentChildren] = useState([
    { id: 'st-1', name: 'Julian Vance (Grade 10 - Sec A)' },
    { id: 'st-2', name: 'Clara Sterling (Grade 11 - Sec B)' }
  ]);

  // Create & Edit Homework Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHwId, setEditingHwId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attachmentUrl: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'PUBLISHED',
    classId: 'c1',
    sectionId: 'sec-a',
    subjectId: 'sub-1'
  });

  // Student Submit Work Modal State
  const [selectedHwForSubmit, setSelectedHwForSubmit] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submissionText: '',
    attachmentUrl: ''
  });

  // Review Submissions Drawer State
  const [selectedHwForReview, setSelectedHwForReview] = useState(null);
  const [submissionsForReview, setSubmissionsForReview] = useState([]);
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] = useState(null);
  const [reviewGradeData, setReviewGradeData] = useState({
    grade: 'A+',
    feedback: 'Excellent problem solving approach and clean proof.'
  });

  const fetchHomework = async () => {
    setLoading(true);
    if (userRole === 'Parent' || userRole === 'PARENT') {
      const res = await apiClient.get(`/academics/homework/child/${selectedChild}`);
      if (res.success && res.data) {
        setHomeworkList(res.data);
      }
    } else {
      const res = await apiClient.get(`/academics/homework?classId=${selectedClass}&sectionId=${selectedSection}`);
      if (res.success && res.data && res.data.length > 0) {
        setHomeworkList(res.data);
      } else {
        setHomeworkList([
          {
            id: 'hw-1',
            title: 'Calculus & Vector Derivatives Worksheet',
            description: 'Complete questions 1 through 15 on page 142. Show all step-by-step proofs.',
            attachmentUrl: 'https://educationspace.edu/files/calculus_ws.pdf',
            dueDate: '2026-09-05',
            status: 'PUBLISHED',
            submissions: [
              { id: 'sub-1', studentId: 'st-1', submissionText: 'Attached full solution PDF.', attachmentUrl: 'https://drive.google.com/file/d/sample', status: 'GRADED', grade: 'A+', feedback: 'Flawless proofs!' }
            ]
          },
          {
            id: 'hw-2',
            title: 'PostgreSQL Database Index Optimization Paper',
            description: 'Write a 2-page essay on B-Tree vs Hash index performance for high-throughput ERPs.',
            attachmentUrl: 'https://educationspace.edu/files/db_indexes.pdf',
            dueDate: '2026-09-10',
            status: 'DRAFT',
            submissions: []
          }
        ]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHomework();
  }, [selectedClass, selectedSection, selectedChild, userRole]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/academics/homework', {
      classId: selectedClass,
      sectionId: selectedSection,
      subjectId: formData.subjectId || 'sub-1',
      title: formData.title,
      description: formData.description,
      attachmentUrl: formData.attachmentUrl,
      dueDate: formData.dueDate,
      status: formData.status
    });

    if (res.success) {
      addNotification(`Homework "${formData.title}" created successfully!`, 'success');
      setIsCreateModalOpen(false);
      resetForm();
      fetchHomework();
    } else {
      addNotification(res.error?.message || 'Failed to create homework', 'error');
    }
  };

  const handleEditOpen = (hw) => {
    setEditingHwId(hw.id);
    setFormData({
      title: hw.title,
      description: hw.description,
      attachmentUrl: hw.attachmentUrl || '',
      dueDate: new Date(hw.dueDate).toISOString().split('T')[0],
      status: hw.status,
      classId: hw.classId || selectedClass,
      sectionId: hw.sectionId || selectedSection,
      subjectId: hw.subjectId || 'sub-1'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingHwId) return;

    const res = await apiClient.put(`/academics/homework/${editingHwId}`, formData);
    if (res.success) {
      addNotification(`Updated assignment "${formData.title}"!`, 'success');
      setIsEditModalOpen(false);
      resetForm();
      fetchHomework();
    } else {
      addNotification(res.error?.message || 'Update failed', 'error');
    }
  };

  const handlePublishToggle = async (hwId) => {
    const res = await apiClient.patch(`/academics/homework/${hwId}/publish`, {});
    if (res.success) {
      addNotification('Assignment status set to PUBLISHED!', 'success');
      fetchHomework();
    } else {
      addNotification(res.error?.message || 'Publish failed', 'error');
    }
  };

  const handleStudentSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedHwForSubmit) return;

    const res = await apiClient.post(`/academics/homework/${selectedHwForSubmit.id}/submit`, submissionData);
    if (res.success) {
      addNotification(`Assignment submitted for "${selectedHwForSubmit.title}"!`, 'success');
      setSelectedHwForSubmit(null);
      setSubmissionData({ submissionText: '', attachmentUrl: '' });
      fetchHomework();
    } else {
      addNotification(res.error?.message || 'Submission failed', 'error');
    }
  };

  const handleOpenReviewDrawer = async (hw) => {
    setSelectedHwForReview(hw);
    const res = await apiClient.get(`/academics/homework/${hw.id}/submissions`);
    if (res.success && res.data && res.data.length > 0) {
      setSubmissionsForReview(res.data);
    } else {
      setSubmissionsForReview(hw.submissions || []);
    }
  };

  const handleGradeSubmissionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubmissionToGrade) return;

    const res = await apiClient.post(`/academics/homework/submissions/${selectedSubmissionToGrade.id}/review`, reviewGradeData);
    if (res.success) {
      addNotification(`Grade (${reviewGradeData.grade}) assigned successfully!`, 'success');
      setSelectedSubmissionToGrade(null);
      if (selectedHwForReview) handleOpenReviewDrawer(selectedHwForReview);
      fetchHomework();
    } else {
      addNotification(res.error?.message || 'Grading failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      attachmentUrl: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PUBLISHED',
      classId: 'c1',
      sectionId: 'sec-a',
      subjectId: 'sub-1'
    });
    setEditingHwId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Homework & Assignments Hub
            </h1>
            <Badge variant="primary">Relationship Authorized</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Publish assignments, attach resource files, submit coursework, and review/grade submissions across classes & sections.
          </p>
        </div>

        {(userRole === 'Instructor' || userRole === 'TEACHER' || userRole === 'SUPER_ADMIN' || userRole === 'Admin') && (
          <button
            onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Homework</span>
          </button>
        )}
      </div>

      {/* Role-Adapted Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {(userRole === 'Parent' || userRole === 'PARENT') ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Guardian Access</span>
            </div>

            <div className="w-64">
              <FormSelect
                label="Linked Child"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                options={parentChildren.map(c => ({ value: c.id, label: c.name }))}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-48">
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
            <div className="w-48">
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
          </div>
        )}
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeworkList.map((hw) => (
          <div key={hw.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={hw.status === 'PUBLISHED' ? 'success' : 'neutral'}>{hw.status}</Badge>
                  {hw.submissions && hw.submissions.some(s => s.status === 'GRADED') && (
                    <Badge variant="warning">Graded</Badge>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due: {new Date(hw.dueDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">{hw.title}</h3>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{hw.description}</p>
              </div>

              {hw.attachmentUrl && (
                <a
                  href={hw.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Download Attached Reference File</span>
                </a>
              )}

              {/* Student/Parent Grade View */}
              {hw.submissions && hw.submissions.length > 0 && hw.submissions[0].grade && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center justify-between">
                  <span>Assigned Grade: <span className="text-emerald-700 font-extrabold text-sm ml-1">{hw.submissions[0].grade}</span></span>
                  <span className="text-emerald-700 font-normal italic">"{hw.submissions[0].feedback}"</span>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-slate-400">
                Submissions: {hw.submissions?.length || 0} Student(s)
              </span>

              <div className="flex items-center gap-2">
                {(userRole === 'Student' || userRole === 'STUDENT') ? (
                  <button
                    onClick={() => setSelectedHwForSubmit(hw)}
                    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                ) : (userRole === 'Parent' || userRole === 'PARENT') ? (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                    Linked Child View
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    {hw.status === 'DRAFT' && (
                      <button
                        onClick={() => handlePublishToggle(hw.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditOpen(hw)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenReviewDrawer(hw)}
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Submissions</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Homework Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Assign New Homework"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <FormInput
            label="Assignment Title"
            required
            placeholder="e.g. Calculus Vector Proofs"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <FormTextarea
            label="Description & Instructions"
            required
            rows={3}
            placeholder="Provide clear instructions for students..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <FormInput
            label="Attachment URL / Resource Link (Optional)"
            placeholder="https://educationspace.edu/files/worksheet.pdf"
            value={formData.attachmentUrl}
            onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
          />

          <FormInput
            type="date"
            label="Due Date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <FormSelect
            label="Initial Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'PUBLISHED', label: 'Publish Immediately' },
              { value: 'DRAFT', label: 'Save as Draft' }
            ]}
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Publish Homework Assignment</span>
          </button>
        </form>
      </Modal>

      {/* Edit Homework Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Homework Assignment"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <FormInput
            label="Assignment Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <FormTextarea
            label="Description & Instructions"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <FormInput
            label="Attachment URL"
            value={formData.attachmentUrl}
            onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
          />

          <FormInput
            type="date"
            label="Due Date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'CLOSED', label: 'Closed' }
            ]}
          />

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
          >
            Save Assignment Changes
          </button>
        </form>
      </Modal>

      {/* Student Submit Work Modal */}
      {selectedHwForSubmit && (
        <Modal
          isOpen={!!selectedHwForSubmit}
          onClose={() => setSelectedHwForSubmit(null)}
          title={`Submit Work: ${selectedHwForSubmit.title}`}
        >
          <form onSubmit={handleStudentSubmitWork} className="space-y-4 text-xs">
            <FormTextarea
              label="Solution Notes / Answer Text"
              required
              rows={4}
              placeholder="Type your submission answers or explanation..."
              value={submissionData.submissionText}
              onChange={(e) => setSubmissionData({ ...submissionData, submissionText: e.target.value })}
            />

            <FormInput
              label="File Attachment Link (Drive / PDF)"
              placeholder="https://drive.google.com/file/d/..."
              value={submissionData.attachmentUrl}
              onChange={(e) => setSubmissionData({ ...submissionData, attachmentUrl: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Work to Teacher</span>
            </button>
          </form>
        </Modal>
      )}

      {/* Review Submissions Drawer */}
      {selectedHwForReview && (
        <Drawer
          isOpen={!!selectedHwForReview}
          onClose={() => { setSelectedHwForReview(null); setSelectedSubmissionToGrade(null); }}
          title={`Review Submissions: ${selectedHwForReview.title}`}
        >
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Student Submission Roster</h4>
            {submissionsForReview && submissionsForReview.length > 0 ? (
              submissionsForReview.map((sub) => (
                <div key={sub.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Student ID: {sub.studentId}</span>
                    <Badge variant={sub.grade ? 'success' : 'warning'}>{sub.grade ? `Grade: ${sub.grade}` : sub.status}</Badge>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-100">{sub.submissionText}</p>

                  {sub.attachmentUrl && (
                    <a href={sub.attachmentUrl} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" /> View Submitted Attachment
                    </a>
                  )}

                  {sub.feedback && (
                    <p className="text-emerald-700 italic font-semibold">Teacher Feedback: "{sub.feedback}"</p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedSubmissionToGrade(sub)}
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all"
                    >
                      Grade & Provide Feedback
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">No student submissions received for this assignment yet.</p>
            )}

            {/* Sub-Modal / Form for Grading */}
            {selectedSubmissionToGrade && (
              <form onSubmit={handleGradeSubmissionSubmit} className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3 mt-4">
                <h5 className="font-bold text-slate-900">Assign Grade for {selectedSubmissionToGrade.studentId}</h5>
                <FormInput
                  label="Grade (e.g. A+, 95%)"
                  required
                  value={reviewGradeData.grade}
                  onChange={(e) => setReviewGradeData({ ...reviewGradeData, grade: e.target.value })}
                />
                <FormTextarea
                  label="Teacher Feedback"
                  rows={2}
                  value={reviewGradeData.feedback}
                  onChange={(e) => setReviewGradeData({ ...reviewGradeData, feedback: e.target.value })}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmissionToGrade(null)}
                    className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-1.5 rounded-lg font-bold"
                  >
                    Submit Grade & Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
};

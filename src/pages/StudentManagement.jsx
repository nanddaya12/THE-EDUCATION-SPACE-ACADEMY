import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { exportToCSV } from '../utils/exporter';
import { StudentMasterProfile } from '../components/students/StudentMasterProfile';
import { 
  Users, 
  UserPlus, 
  Search, 
  Download, 
  Upload, 
  Archive, 
  Eye, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Square,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Activity,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const StudentManagement = () => {
  const { addNotification } = useApp();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIds, setSelectedIds] = useState([]);

  // Create Student Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNo: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
    rollNo: `R-${Math.floor(100 + Math.random() * 900)}`,
    email: '',
    phone: '',
    gender: 'Male',
    guardianName: '',
    guardianPhone: ''
  });
  const [formError, setFormError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    const res = await apiClient.get('/students');
    if (res.success && res.data?.students) {
      setStudents(res.data.students);
    } else {
      // Seed default fallback data if empty
      setStudents([
        { id: 'st-1', admissionNo: 'ADM-2026-001', rollNo: 'R-101', fullName: 'Alex Rivera', email: 'alex.rivera@edu.com', phone: '+1-555-0192', gender: 'Male', status: 'Active', batch: 'Grade 10 - Sec A' },
        { id: 'st-2', admissionNo: 'ADM-2026-002', rollNo: 'R-102', fullName: 'Sophia Chen', email: 'sophia.c@edu.com', phone: '+1-555-0193', gender: 'Female', status: 'Active', batch: 'Grade 11 - Sec B' },
        { id: 'st-3', admissionNo: 'ADM-2026-003', rollNo: 'R-103', fullName: 'Michael Brown', email: 'm.brown@edu.com', phone: '+1-555-0194', gender: 'Male', status: 'Pending', batch: 'Grade 10 - Sec A' },
        { id: 'st-4', admissionNo: 'ADM-2026-004', rollNo: 'R-104', fullName: 'Emily Davis', email: 'e.davis@edu.com', phone: '+1-555-0195', gender: 'Female', status: 'Active', batch: 'Grade 12 - Sec C' },
        { id: 'st-5', admissionNo: 'ADM-2026-005', rollNo: 'R-105', fullName: 'Carlos Mendez', email: 'carlos.m@edu.com', phone: '+1-555-0196', gender: 'Male', status: 'Archived', batch: 'Grade 11 - Sec A' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const res = await apiClient.post('/students', formData);

    if (res.success) {
      addNotification(`Student "${formData.fullName}" registered successfully!`, 'success');
      setIsCreateOpen(false);
      setFormData({
        fullName: '',
        admissionNo: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
        rollNo: `R-${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        phone: '',
        gender: 'Male',
        guardianName: '',
        guardianPhone: ''
      });
      fetchStudents();
    } else {
      setFormError(res.error?.message || 'Failed to register student');
    }
  };

  const handleExportCSV = () => {
    exportToCSV('student_directory_export', students, ['Admission No', 'Roll No', 'Full Name', 'Email', 'Phone', 'Gender', 'Status']);
    addNotification('Exported student directory to CSV', 'success');
  };

  const profileTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'fees', label: 'Fees' },
    { id: 'payments', label: 'Payments' },
    { id: 'exams', label: 'Exams' },
    { id: 'results', label: 'Results' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'homework', label: 'Homework' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'documents', label: 'Documents' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'communication', label: 'Communication' },
    { id: 'activity', label: 'Activity' }
  ];

  const columns = [
    {
      key: 'select',
      label: '#',
      sortable: false,
      render: (_, row) => {
        const isSelected = selectedIds.includes(row.id);
        return (
          <button
            onClick={() => {
              if (isSelected) setSelectedIds(selectedIds.filter(id => id !== row.id));
              else setSelectedIds([...selectedIds, row.id]);
            }}
            className="text-slate-400 hover:text-primary"
          >
            {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
          </button>
        );
      }
    },
    {
      key: 'admissionNo',
      label: 'Admission No',
      render: (val) => <span className="font-mono font-bold text-slate-800 text-[11px]">{val}</span>
    },
    {
      key: 'fullName',
      label: 'Student Name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
            {val.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-800 block text-xs">{val}</span>
            <span className="text-[10px] text-slate-400 font-medium block">{row.email || 'No Email'}</span>
          </div>
        </div>
      )
    },
    { key: 'gender', label: 'Gender' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : val === 'Pending' ? 'warning' : 'neutral'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedStudent(row);
              setActiveTab('overview');
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100"
            title="View 13-Tab Student Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
            Student Management Directory
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage student admissions, 13-tab academic profiles, guardians, enrollment, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl shadow-card transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        searchPlaceholder="Search by name, admission no, or roll no..."
      />

      {/* Register Student Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register New Academy Student"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Admission Number"
              required
              value={formData.admissionNo}
              onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
            />
            <FormInput
              label="Roll Number"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
          </div>

          <FormInput
            label="Student Full Name"
            required
            placeholder="e.g. Alex Rivera"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="student@edu.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormSelect
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <FormInput
              label="Primary Guardian Name"
              placeholder="e.g. Carlos Rivera"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            />
            <FormInput
              label="Guardian Phone"
              placeholder="+1-555-0190"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
          >
            Submit Student Registration
          </button>
        </form>
      </Modal>

      {/* Full Student Master Profile Workspace View */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 flex items-start justify-center">
          <div className="w-full max-w-5xl my-4">
            <StudentMasterProfile
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
              onEdit={() => {
                addNotification(`Editing profile for ${selectedStudent.fullName}`, 'info');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

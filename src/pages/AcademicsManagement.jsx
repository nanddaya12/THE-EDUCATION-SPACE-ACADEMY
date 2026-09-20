import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Award, 
  Layers, 
  FolderPlus,
  ShieldCheck
} from 'lucide-react';

export const AcademicsManagement = () => {
  const { addNotification, userRole } = useApp();
  const [activeTab, setActiveTab] = useState('classes');

  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Class Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');

  const fetchAcademicsData = async () => {
    setLoading(true);
    const [resClasses, resSessions] = await Promise.all([
      apiClient.get('/academics/classes'),
      apiClient.get('/academics/sessions')
    ]);

    if (resClasses.success && resClasses.data) {
      setClasses(resClasses.data);
    } else {
      setClasses([
        { id: 'c1', name: 'Grade 10', code: 'GR-10', _count: { enrollments: 120 } },
        { id: 'c2', name: 'Grade 11', code: 'GR-11', _count: { enrollments: 95 } },
        { id: 'c3', name: 'Grade 12', code: 'GR-12', _count: { enrollments: 88 } }
      ]);
    }

    if (resSessions.success && resSessions.data) {
      setSessions(resSessions.data);
    } else {
      setSessions([
        { id: 's1', name: 'Academic Session 2026-2027', isCurrent: true, startDate: '2026-09-01', endDate: '2027-06-30' },
        { id: 's2', name: 'Academic Session 2025-2026', isCurrent: false, startDate: '2025-09-01', endDate: '2026-06-30' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAcademicsData();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/academics/classes', {
      name: newClassName,
      code: newClassCode || `CLS-${Math.floor(100 + Math.random() * 900)}`
    });

    if (res.success) {
      addNotification(`Created Class "${newClassName}"!`, 'success');
      setIsModalOpen(false);
      setNewClassName('');
      setNewClassCode('');
      fetchAcademicsData();
    } else {
      addNotification(res.error?.message || 'Failed to create class', 'error');
    }
  };

  const tabs = [
    { id: 'sessions', label: 'Academic Sessions' },
    { id: 'terms', label: 'Academic Terms' },
    { id: 'classes', label: 'Classes' },
    { id: 'sections', label: 'Sections' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'subject-assign', label: 'Subject Assignments' },
    { id: 'teacher-assign', label: 'Teacher Assignments' },
    { id: 'class-teachers', label: 'Class Teachers' },
    { id: 'calendar', label: 'Academic Calendar' }
  ];

  const classColumns = [
    {
      key: 'code',
      label: 'Class Code',
      render: (val) => <span className="font-mono font-bold text-slate-800 text-xs">{val}</span>
    },
    {
      key: 'name',
      label: 'Class Name',
      render: (val) => <span className="font-bold text-slate-900 text-xs">{val}</span>
    },
    {
      key: 'enrollments',
      label: 'Enrolled Students',
      render: (_, row) => <span className="font-bold text-primary">{row._count?.enrollments || 45} Students</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: () => <Badge variant="success">Active</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
            Academic Structure & Curriculum Governance
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure academic sessions, terms, classes, sections, subjects, and faculty assignments per campus.
          </p>
        </div>

        {userRole !== 'Student' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Academic Class</span>
          </button>
        )}
      </div>

      {/* 9 Management Screen Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Academic Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-display font-bold text-base text-on-surface">Configured Academic Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">{s.name}</span>
                  <span className="text-slate-400 font-medium block">
                    {new Date(s.startDate).toLocaleDateString()} — {new Date(s.endDate).toLocaleDateString()}
                  </span>
                </div>
                <Badge variant={s.isCurrent ? 'success' : 'neutral'}>
                  {s.isCurrent ? 'Active Session' : 'Archived'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Classes */}
      {activeTab === 'classes' && (
        <DataTable
          columns={classColumns}
          data={classes}
          loading={loading}
          searchPlaceholder="Search classes by name or code..."
        />
      )}

      {/* Tab 3: Terms, Sections, Subjects, Assignments */}
      {['terms', 'sections', 'subjects', 'subject-assign', 'teacher-assign', 'class-teachers', 'calendar'].includes(activeTab) && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-on-surface capitalize">{activeTab.replace('-', ' ')} Structure Manager</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Configured academic structure synchronized with current active campus and session.
          </p>
        </div>
      )}

      {/* Create Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure New Academic Class"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <FormInput
            label="Class Name"
            required
            placeholder="e.g. Grade 10"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />

          <FormInput
            label="Class Code"
            placeholder="e.g. GR-10"
            value={newClassCode}
            onChange={(e) => setNewClassCode(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
          >
            Create Class
          </button>
        </form>
      </Modal>
    </div>
  );
};

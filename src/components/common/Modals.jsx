import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  BookOpen, 
  Shield, 
  GraduationCap, 
  Check, 
  Award, 
  Download, 
  Printer, 
  Plus, 
  Trash2,
  Edit3
} from 'lucide-react';

export const Modals = () => {
  const { 
    isModalOpen, 
    setIsModalOpen, 
    modalType, 
    addCourse, 
    editCourse, 
    selectedEditCourse, 
    addRole, 
    addNotification, 
    courses,
    certificateData 
  } = useApp();

  // Create Course Form State
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Technology',
    instructor: '',
    price: 399,
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
  });

  // Edit Course Form State
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (selectedEditCourse && modalType === 'editCourse') {
      setEditForm(JSON.parse(JSON.stringify(selectedEditCourse)));
    }
  }, [selectedEditCourse, modalType]);

  // Create Role Form State
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    type: 'Custom'
  });

  // Enroll Form State
  const [enrollForm, setEnrollForm] = useState({
    studentName: '',
    email: '',
    selectedCourseId: courses[0]?.id || 'c1'
  });

  if (!isModalOpen) return null;

  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.instructor) return;
    
    addCourse({
      id: `c_${Date.now()}`,
      ...courseForm,
      price: Number(courseForm.price),
      rating: 5.0,
      enrolledCount: 1,
      totalModules: 6,
      completedModules: 0,
      completionPercentage: 0,
      status: 'Published',
      modules: [
        { id: 'm_1', title: 'Module 1: Course Orientation & Fundamentals', duration: '2.0 hrs', completed: false }
      ]
    });
    setIsModalOpen(false);
  };

  const handleEditCourseSubmit = (e) => {
    e.preventDefault();
    if (!editForm || !editForm.title) return;
    editCourse(editForm);
    setIsModalOpen(false);
  };

  const handleAddModuleToEdit = () => {
    if (!editForm) return;
    const newMod = {
      id: `m_${Date.now()}`,
      title: `Module ${editForm.modules.length + 1}: New Curriculum Topic`,
      duration: '3.0 hrs',
      completed: false
    };
    setEditForm({
      ...editForm,
      modules: [...editForm.modules, newMod],
      totalModules: editForm.modules.length + 1
    });
  };

  const handleRemoveModuleFromEdit = (modId) => {
    if (!editForm) return;
    const updatedMods = editForm.modules.filter(m => m.id !== modId);
    setEditForm({
      ...editForm,
      modules: updatedMods,
      totalModules: updatedMods.length
    });
  };

  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!roleForm.name) return;

    addRole({
      id: `r_${Date.now()}`,
      name: roleForm.name,
      usersCount: 0,
      type: roleForm.type,
      description: roleForm.description || 'Custom administrative access role.',
      permissions: {
        'Courses': { create: true, read: true, update: false, delete: false, audit: false },
        'Attendance': { create: true, read: true, update: false, delete: false, audit: false },
        'User Roles': { create: false, read: true, update: false, delete: false, audit: false },
        'Financials': { create: false, read: false, update: false, delete: false, audit: false },
        'Analytics': { create: false, read: true, update: false, delete: false, audit: false }
      }
    });
    setIsModalOpen(false);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!enrollForm.studentName || !enrollForm.email) return;
    addNotification(`Enrollment application received for ${enrollForm.studentName}!`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden border border-slate-200 ${
        modalType === 'certificate' ? 'max-w-2xl' : 'max-w-lg'
      }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            {modalType === 'createCourse' && <BookOpen className="w-5 h-5 text-primary" />}
            {modalType === 'editCourse' && <Edit3 className="w-5 h-5 text-primary" />}
            {modalType === 'createRole' && <Shield className="w-5 h-5 text-primary" />}
            {modalType === 'enroll' && <GraduationCap className="w-5 h-5 text-primary" />}
            {modalType === 'certificate' && <Award className="w-5 h-5 text-amber-500" />}
            <h3 className="font-display font-bold text-base text-on-surface">
              {modalType === 'createCourse' && 'Create New Course'}
              {modalType === 'editCourse' && 'Edit Course Details & Modules'}
              {modalType === 'createRole' && 'Define Access Control Role'}
              {modalType === 'enroll' && 'Student Enrollment Portal'}
              {modalType === 'certificate' && 'Official Certificate of Completion'}
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Create Course Form */}
          {modalType === 'createCourse' && (
            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Machine Learning Systems"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Instructor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Vance"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Summary</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of learning outcomes..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft"
                >
                  Publish Course
                </button>
              </div>
            </form>
          )}

          {/* Edit Course Form */}
          {modalType === 'editCourse' && editForm && (
            <form onSubmit={handleEditCourseSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Instructor</label>
                <input
                  type="text"
                  required
                  value={editForm.instructor}
                  onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Module Syllabus Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Syllabus Modules Builder ({editForm.modules?.length || 0})</label>
                  <button
                    type="button"
                    onClick={handleAddModuleToEdit}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Module</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editForm.modules?.map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...editForm.modules];
                          updated[idx].title = e.target.value;
                          setEditForm({ ...editForm, modules: updated });
                        }}
                        className="flex-1 text-xs bg-white px-2 py-1 border border-slate-200 rounded outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveModuleFromEdit(m.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft"
                >
                  Save Course Changes
                </button>
              </div>
            </form>
          )}

          {/* Certificate Generator Modal */}
          {modalType === 'certificate' && (
            <div className="space-y-6 text-center">
              {/* Official Certificate Card */}
              <div className="border-8 border-slate-900 p-8 rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 text-slate-900 shadow-2xl relative">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold text-xs">
                  SEAL
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary block">
                    THE EDUCATION SPACE ACADEMY
                  </span>

                  <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                    Certificate of Academic Achievement
                  </h2>

                  <p className="text-xs text-slate-500">This certifies that</p>

                  <div className="font-display font-extrabold text-2xl text-primary underline underline-offset-8">
                    {certificateData?.studentName || 'Alex Rivera'}
                  </div>

                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    has successfully fulfilled all course requirements, module examinations, and practical projects for the mastery of
                  </p>

                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {certificateData?.courseTitle || 'UX/UI Product Design System & Figma Pro'}
                  </h3>

                  <div className="pt-6 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                    <div>
                      <span className="block font-bold text-slate-800">Dr. Sarah Jenkins</span>
                      <span className="text-[10px] text-slate-400">Academic Director</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800">Issue Date: Aug 2026</span>
                      <span className="text-[10px] text-slate-400">ID: #ESC-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addNotification('Printing official certificate...', 'info');
                    window.print();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft"
                >
                  Close View
                </button>
              </div>
            </div>
          )}

          {/* Create Role Form */}
          {modalType === 'createRole' && (
            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Content Auditor"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe scope of administrative permissions..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft"
                >
                  Create Role
                </button>
              </div>
            </form>
          )}

          {/* Enrollment Form */}
          {modalType === 'enroll' && (
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={enrollForm.studentName}
                  onChange={(e) => setEnrollForm({ ...enrollForm, studentName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@example.com"
                  value={enrollForm.email}
                  onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Program</label>
                <select
                  value={enrollForm.selectedCourseId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, selectedCourseId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (${c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

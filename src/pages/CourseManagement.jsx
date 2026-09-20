import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy,
  DollarSign,
  Award,
  Layers
} from 'lucide-react';

export const CourseManagement = () => {
  const { 
    courses, 
    updateCourseStatus, 
    deleteCourse, 
    duplicateCourse, 
    setModalType, 
    setIsModalOpen, 
    setCurrentView, 
    setSelectedCourse,
    setSelectedEditCourse,
    hasPermission
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Technology', 'Data Science', 'Design', 'Business'];
  const statuses = ['All', 'Published', 'Draft', 'Archived'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalEnrolled = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalGrossRevenue = courses.reduce((acc, c) => acc + (c.price * (c.enrolledCount || 0)), 0);

  return (
    <div className="flex bg-surface min-h-[calc(100vh-76px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden max-w-[1440px] mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Course Management System
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Curate, edit, monitor, duplicate, and publish academy course syllabi and learning tracks.
            </p>
          </div>

          {hasPermission('Courses', 'create') && (
            <button
              onClick={() => {
                setModalType('createCourse');
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-soft transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          )}
        </div>

        {/* Summary Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Courses</span>
              <div className="font-display font-extrabold text-xl text-on-surface">{courses.length} Active Tracks</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Course Enrollments</span>
              <div className="font-display font-extrabold text-xl text-on-surface">{totalEnrolled.toLocaleString()} Students</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Gross Intake</span>
              <div className="font-display font-extrabold text-xl text-on-surface">${totalGrossRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course title or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status & Category Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-white text-on-surface shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-on-surface font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-white/40">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      course.status === 'Published'
                        ? 'bg-emerald-500 text-white'
                        : course.status === 'Draft'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-500 text-white'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-base">${course.price}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-on-surface line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-700 truncate max-w-[120px]">{course.instructor}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {course.enrolledCount}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {course.totalModules}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 pt-0 space-y-2">
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setCurrentView('student-hub');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {hasPermission('Courses', 'update') && (
                    <button
                      onClick={() => {
                        setSelectedEditCourse(course);
                        setModalType('editCourse');
                        setIsModalOpen(true);
                      }}
                      className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs p-2 rounded-lg transition-colors"
                      title="Edit Course Details & Modules"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {hasPermission('Courses', 'create') && (
                    <button
                      onClick={() => duplicateCourse(course.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs p-2 rounded-lg transition-colors"
                      title="Duplicate Course"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {hasPermission('Courses', 'delete') && (
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs p-2 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

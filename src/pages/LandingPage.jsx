import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Trophy, 
  Star, 
  ShieldCheck, 
  PlayCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentView, courses, setIsModalOpen, setModalType } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const categories = ['All', 'Technology', 'Data Science', 'Design', 'Business'];

  const stats = [
    { label: 'Enrolled Active Students', value: '14,200+', icon: Users, change: '+18% this term' },
    { label: 'Course Completion Rate', value: '94.8%', icon: Trophy, change: 'Top 5% Industry' },
    { label: 'Certified Instructors', value: '180+', icon: ShieldCheck, change: 'Enterprise Experts' },
    { label: 'Career Placement Rate', value: '91.2%', icon: Star, change: 'Avg $85k Starting' }
  ];

  return (
    <div className="w-full bg-surface min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 max-w-container-max mx-auto overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Education Platform</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-on-surface tracking-tight leading-[1.1]">
              Empowering Minds, <br />
              <span className="gradient-text-accent">Shaping Tomorrow.</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed max-w-2xl">
              An elite unified academy management ecosystem designed for immersive learning, 
              real-time administrative authority, and seamless student advancement.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setModalType('enroll');
                  setIsModalOpen(true);
                }}
                className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:bg-primary-dark shadow-float transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <span>Enroll in Academy</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('student-hub')}
                className="bg-white text-on-surface border border-slate-300 font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full hover:bg-slate-50 transition-all flex items-center gap-2 shadow-card"
              >
                <PlayCircle className="w-4 h-4 text-primary" />
                <span>Explore Student Hub</span>
              </button>

              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className="text-slate-600 hover:text-primary font-bold text-xs uppercase tracking-wider px-4 py-4 transition-all flex items-center gap-1"
              >
                <span>Admin Command</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Bullet Badges */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold text-slate-600 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Certified Credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Live Admin Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Role-Based Access</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="Academy Students"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="glass-card text-slate-900 p-4 rounded-2xl w-full border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Featured Masterclass</span>
                      <h4 className="font-display font-bold text-sm text-slate-900">Full-Stack Cloud Architecture 2026</h4>
                    </div>
                    <span className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                      Live Cohort
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Stats Grid */}
      <section className="bg-white py-12 border-y border-slate-200">
        <div className="px-4 md:px-8 max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-surface-low border border-slate-200/60 space-y-2 hover:border-primary/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-display font-extrabold text-3xl text-on-surface">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-700">{stat.label}</div>
                  <div className="text-[10px] font-bold text-primary">{stat.change}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Catalog */}
      <section className="py-20 px-4 md:px-8 max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">
              EXPLORE CURRICULUM
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-on-surface">
              Featured Academy Programs
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-soft font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-on-surface font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-white/50">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-primary text-white font-bold text-xs px-3 py-1 rounded-full shadow-soft">
                    ${course.price}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                    <span className="text-slate-400 text-[11px] font-normal">({course.enrolledCount} students)</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-700 truncate max-w-[130px]">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.totalModules} Modules</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setModalType('enroll');
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-slate-900 hover:bg-primary text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Enroll In Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-admin-sidebar text-white py-16 px-4 md:px-8 border-t border-slate-800">
        <div className="max-w-container-max mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">JOIN THE ACADEMY</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl max-w-2xl mx-auto">
            Ready to Elevate Your Educational Institution?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Access live dashboards, manage student performance, configure permissions, and explore world-class course modules.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentView('admin-dashboard')}
              className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-primary-dark shadow-float transition-all"
            >
              Launch Admin Dashboard
            </button>
            <button
              onClick={() => setCurrentView('student-hub')}
              className="bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-slate-700 transition-all border border-slate-700"
            >
              Open Student Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

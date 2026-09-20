import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  Flame, 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ChevronRight,
  Download,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const StudentHub = () => {
  const { courses, selectedCourse, setSelectedCourse, setCertificateData, setModalType, setIsModalOpen, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'player', 'achievements'
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Interactive Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const activeCourse = selectedCourse || courses[0];
  const activeModule = activeCourse.modules[activeModuleIndex] || activeCourse.modules[0];

  // Mock quiz questions per module
  const sampleQuiz = {
    question: `Knowledge Assessment: ${activeModule?.title || 'Module Concept'}`,
    options: [
      { id: 0, text: 'Optimum component state isolation using pure architecture functions.' },
      { id: 1, text: 'Direct mutation of global state variables inside render loops.' },
      { id: 2, text: 'Asynchronous event binding without cleanup listeners.' }
    ],
    correctId: 0,
    explanation: 'Pure functions and isolated state containers prevent memory leaks and unpredictable render side-effects.'
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    const isCorrect = selectedQuizOption === sampleQuiz.correctId;
    setQuizScore(isCorrect ? 100 : 0);
    setQuizSubmitted(true);
    if (isCorrect) {
      addNotification('Great job! 100% score recorded for this module check.', 'success');
    } else {
      addNotification('Incorrect option. Review the explanation and retry!', 'error');
    }
  };

  const handleResetQuiz = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleMarkComplete = () => {
    addNotification(`Lesson marked as complete! Course progress updated.`, 'success');
  };

  const handleOpenCertificate = (courseTitle) => {
    setCertificateData({
      studentName: 'Alex Rivera',
      courseTitle: courseTitle || activeCourse.title
    });
    setModalType('certificate');
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-76px)] py-8 px-4 md:px-8 max-w-container-max mx-auto space-y-8">
      {/* Student Welcome Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-300" />
            <span>12-Day Learning Streak!</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl md:text-4xl">
            Welcome back, Alex Rivera! 👋
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            You are on track to complete your <span className="text-white font-bold">{activeCourse.title}</span> certification this month.
          </p>

          <div className="pt-3 flex items-center gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary-light" />
              <span>4 Enrolled Courses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3 Certificates Earned</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar Circle */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex items-center gap-4 min-w-[240px]">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center font-display font-extrabold text-xl text-white shadow-soft">
            {activeCourse.completionPercentage}%
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Overall Track</span>
            <span className="font-display font-bold text-sm text-white block">Course Progress</span>
            <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">8 / 12 Modules Done</span>
          </div>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          My Courses & Deadlines
        </button>

        <button
          onClick={() => setActiveTab('player')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'player'
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Interactive Video Player</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Achievements & Badges
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ENROLLED COURSES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Enrolled Courses Grid */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-on-surface">
              Enrolled Learning Tracks
            </h2>

            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-primary/40 transition-all"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-36 h-28 rounded-xl object-cover"
                  />

                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-on-surface">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Completion Rate</span>
                        <span>{course.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${course.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('player');
                      }}
                      className="flex-1 sm:flex-none w-full bg-slate-900 hover:bg-primary text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Continue</span>
                    </button>

                    {course.completionPercentage === 100 && (
                      <button
                        onClick={() => handleOpenCertificate(course.title)}
                        className="flex-1 sm:flex-none w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Schedule & Deadlines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Upcoming Deadlines</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">React Architecture Assignment</span>
                    <span className="text-[10px] text-slate-500">Full-Stack Web Dev • Due Tomorrow</span>
                  </div>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                    High Priority
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Machine Learning Quiz 4</span>
                    <span className="text-[10px] text-slate-500">AI & Data Science • Aug 22, 2026</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Quiz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE VIDEO PLAYER & QUIZ ENGINE VIEW */}
      {activeTab === 'player' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Player & Quiz Screen */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mock Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl flex items-center justify-center group border border-slate-800">
              <img
                src={activeCourse.thumbnail}
                alt="Lesson Thumbnail"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />

              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="absolute w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-float"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>

              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs font-semibold">
                <span>{activeModule?.title || 'Lesson Overview'}</span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px]">1080p HD</span>
              </div>
            </div>

            {/* Lesson Title & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                  {activeCourse.title}
                </span>
                <h2 className="font-display font-bold text-xl text-on-surface mt-0.5">
                  {activeModule?.title}
                </h2>
                <p className="text-slate-500 text-xs mt-1">Duration: {activeModule?.duration || '45 mins'}</p>
              </div>

              <button
                onClick={handleMarkComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-soft flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            </div>

            {/* Interactive Module Knowledge Assessment Engine */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>Module Knowledge Assessment Check</span>
                </h3>
                {quizScore !== null && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    quizScore === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    Score: {quizScore}%
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800">{sampleQuiz.question}</p>

                <div className="space-y-2">
                  {sampleQuiz.options.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(opt.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedQuizOption === opt.id
                          ? 'border-primary bg-primary/5 font-semibold text-primary'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedQuizOption === opt.id ? 'border-primary bg-primary text-white' : 'border-slate-300'
                      }`}>
                        {selectedQuizOption === opt.id && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>

                {quizSubmitted && (
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block">Explanation:</span>
                    <p className="text-slate-600 leading-relaxed">{sampleQuiz.explanation}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  {quizSubmitted ? (
                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Assessment</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedQuizOption === null}
                      className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-soft disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Module Syllabus Drawer Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-on-surface">
              Course Syllabus Modules
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {activeCourse.modules.map((m, idx) => {
                const isActive = idx === activeModuleIndex;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveModuleIndex(idx);
                      handleResetQuiz();
                    }}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-primary/10 border-primary font-bold text-primary'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="line-clamp-1">{m.title}</span>
                      {m.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal mt-1 block">{m.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS & CERTIFICATES */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-on-surface">
            Earned Certificates & Verified Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">UX/UI Product Design System</h3>
                <p className="text-slate-400 text-xs">Issued Aug 2026 • Certificate ID: #ESC-9081</p>
              </div>
              <button
                onClick={() => handleOpenCertificate('UX/UI Product Design System')}
                className="w-full bg-slate-900 hover:bg-primary text-white font-bold text-xs uppercase py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View & Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

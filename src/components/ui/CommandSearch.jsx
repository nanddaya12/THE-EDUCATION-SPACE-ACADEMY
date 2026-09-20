import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  User, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  DollarSign, 
  Bell, 
  ArrowRight, 
  Clock, 
  X,
  CornerDownLeft,
  Shield
} from 'lucide-react';

export const CommandSearch = ({ isOpen, onClose }) => {
  const { setCurrentView, students, courses } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Search dataset combining real context records & institutional entities
  const SEARCH_ITEMS = [
    // Students
    { id: 's-1', type: 'STUDENT', name: 'Alex Rivera', identifier: 'STU-2026-089', metadata: 'Grade 11 - Pre-Engineering', view: 'students' },
    { id: 's-2', type: 'STUDENT', name: 'Sophia Rivera', identifier: 'STU-2026-104', metadata: 'Grade 9 - Cambridge O-Levels', view: 'students' },
    { id: 's-3', type: 'STUDENT', name: 'Julian Vance', identifier: 'STU-2026-012', metadata: 'Grade 10 - Science Track', view: 'students' },
    { id: 's-4', type: 'STUDENT', name: 'Emily Davis', identifier: 'STU-2026-045', metadata: 'Grade 12 - Pre-Medical', view: 'students' },
    
    // Parents
    { id: 'p-1', type: 'PARENT', name: 'Robert Rivera', identifier: 'PAR-8821', metadata: 'Guardian of Alex & Sophia Rivera', view: 'site-profiles' },
    { id: 'p-2', type: 'PARENT', name: 'Dr. Tariq Vance', identifier: 'PAR-7714', metadata: 'Guardian of Julian Vance', view: 'site-profiles' },

    // Teachers
    { id: 't-1', type: 'TEACHER', name: 'Dr. Sarah Jenkins', identifier: 'FAC-CS-01', metadata: 'Head of Computer Science & Robotics', view: 'academics' },
    { id: 't-2', type: 'TEACHER', name: 'Prof. Marcus Vance', identifier: 'FAC-MTH-02', metadata: 'Senior Mathematics & Mechanics Faculty', view: 'academics' },
    { id: 't-3', type: 'TEACHER', name: 'Dr. Elena Rostova', identifier: 'FAC-PHY-03', metadata: 'Physics & Applied Laboratory Head', view: 'academics' },

    // Courses
    { id: 'c-1', type: 'COURSE', name: 'Advanced Computer Science & Algorithms', identifier: 'CS-501', metadata: 'Term Fall 2026 • 4 Credit Hours', view: 'admin-courses' },
    { id: 'c-2', type: 'COURSE', name: 'Mathematics & Mechanics', identifier: 'MTH-402', metadata: 'Senior Cambridge & Board • 4 Credit Hours', view: 'admin-courses' },
    { id: 'c-3', type: 'COURSE', name: 'Electro-dynamics & Quantum Physics', identifier: 'PHY-401', metadata: 'Physics Lab Track • 3 Credit Hours', view: 'admin-courses' },

    // Admissions
    { id: 'a-1', type: 'ADMISSION', name: 'Clara Sterling Application', identifier: 'APP-2026-902', metadata: 'Status: Documents Pending • Grade 11', view: 'admissions' },
    { id: 'a-2', type: 'ADMISSION', name: 'Ethan Hunt Application', identifier: 'APP-2026-903', metadata: 'Status: Interview Scheduled • Grade 10', view: 'admissions' },

    // Fee Challans
    { id: 'f-1', type: 'CHALLAN', name: 'Challan CH-2026-0988', identifier: 'CH-2026-0988', metadata: 'Tuition Fee PKR 45,000 • Status: Paid', view: 'fee-management' },
    { id: 'f-2', type: 'CHALLAN', name: 'Challan CH-2026-1044', identifier: 'CH-2026-1044', metadata: 'Lab & STEM Fee PKR 18,500 • Status: Pending', view: 'fee-management' },

    // Governance & Security
    { id: 'g-1', type: 'SECURITY', name: 'Roles & Security Matrix', identifier: 'SEC-39-ROLES', metadata: 'Manage 39 Institutional School Roles', view: 'admin-roles' },
    { id: 'g-2', type: 'CONFIG', name: 'System Configuration Center', identifier: 'SYS-CFG-15', metadata: 'Campuses, Sessions, Academic Rules', view: 'system-config' },
    { id: 'g-3', type: 'AUDIT', name: 'System Audit Logs', identifier: 'AUDIT-LOGS', metadata: 'Governance & Security Action Trails', view: 'audit-logs' },

    // Documents
    { id: 'd-1', type: 'DOCUMENT', name: 'Official Grade Transcript Template', identifier: 'DOC-TR-2026', metadata: 'Academic Registrar Certified Format', view: 'documents' },
    { id: 'd-2', type: 'DOCUMENT', name: 'Bonafide Student Certificate', identifier: 'DOC-BON-01', metadata: 'Principal Office Sign-off', view: 'documents' },

    // Announcements
    { id: 'n-1', type: 'ANNOUNCEMENT', name: 'Annual STEM & Robotics Expo', identifier: 'NOT-2026-12', metadata: 'Academy Noticeboard • Scheduled Oct 12', view: 'admin-dashboard' }
  ];

  const RECENT_SEARCHES = [
    { name: 'Alex Rivera', type: 'STUDENT', identifier: 'STU-2026-089', view: 'students' },
    { name: 'Dr. Sarah Jenkins', type: 'TEACHER', identifier: 'FAC-CS-01', view: 'academics' },
    { name: 'CH-2026-0988', type: 'CHALLAN', identifier: 'CH-2026-0988', view: 'fee-management' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? SEARCH_ITEMS.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.identifier.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const displayList = query.trim() ? filteredItems : RECENT_SEARCHES;

  const handleSelect = (item) => {
    if (item.view) {
      setCurrentView(item.view);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (displayList.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + displayList.length) % (displayList.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayList[selectedIndex]) {
        handleSelect(displayList[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'STUDENT':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">STUDENT</span>;
      case 'PARENT':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">PARENT</span>;
      case 'TEACHER':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded">TEACHER</span>;
      case 'COURSE':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">COURSE</span>;
      case 'ADMISSION':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">ADMISSION</span>;
      case 'CHALLAN':
        return <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">FEE CHALLAN</span>;
      case 'SECURITY':
      case 'AUDIT':
      case 'CONFIG':
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">GOVERNANCE</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{type}</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[560px]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search students, parents, teachers, courses, challans, documents..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded">
            <span>ESC</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Recents Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {!query.trim() && (
            <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Searches</span>
            </div>
          )}

          {displayList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No matching academy records found</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Try searching by student code, roll number, course, or teacher name.</p>
            </div>
          ) : (
            displayList.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id || item.identifier}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getTypeBadge(item.type)}
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.identifier && (
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">{item.identifier}</span>
                        )}
                      </div>
                      {item.metadata && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.metadata}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[11px] font-semibold text-slate-400">Jump to module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Instructions Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↑</strong> <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↓</strong> to navigate</span>
            <span><strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↵</strong> to select</span>
            <span><strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">esc</strong> to dismiss</span>
          </div>
          <span className="font-semibold text-primary">The Education Space ERP</span>
        </div>
      </div>
    </div>
  );
};

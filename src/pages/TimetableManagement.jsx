import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { exportToCSV } from '../utils/exporter';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Printer, 
  Download, 
  AlertCircle, 
  User, 
  BookOpen, 
  Building2, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const TimetableManagement = () => {
  const { addNotification, userRole } = useApp();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('weekly'); // weekly, my-schedule

  // Filters
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('sec-a');

  // New Slot Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotData, setSlotData] = useState({
    dayOfWeek: 'Monday',
    periodNumber: 1,
    subjectName: 'Mathematics',
    teacherName: 'Prof. Marcus Vance',
    room: 'Room 302'
  });
  const [formError, setFormError] = useState(null);

  const fetchTimetable = async () => {
    setLoading(true);
    const res = await apiClient.get(`/academics/timetable?classId=${selectedClass}&sectionId=${selectedSection}`);

    if (res.success && res.data && res.data.length > 0) {
      setSlots(res.data);
    } else {
      // Seed default weekly grid
      setSlots([
        { id: 't1', dayOfWeek: 'Monday', periodNumber: 1, room: 'Room 302', subject: { name: 'Mathematics' }, class: { name: 'Grade 10' }, section: { name: 'Section A' } },
        { id: 't2', dayOfWeek: 'Monday', periodNumber: 2, room: 'Physics Lab', subject: { name: 'Physics' }, class: { name: 'Grade 10' }, section: { name: 'Section A' } },
        { id: 't3', dayOfWeek: 'Tuesday', periodNumber: 1, room: 'Room 302', subject: { name: 'Computer Science' }, class: { name: 'Grade 10' }, section: { name: 'Section A' } },
        { id: 't4', dayOfWeek: 'Wednesday', periodNumber: 3, room: 'Room 302', subject: { name: 'English Literature' }, class: { name: 'Grade 10' }, section: { name: 'Section A' } }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass, selectedSection]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setFormError(null);

    const res = await apiClient.post('/academics/timetable', {
      classId: selectedClass,
      sectionId: selectedSection,
      subjectId: 'sub-1',
      teacherId: 'teacher-1',
      room: slotData.room,
      dayOfWeek: slotData.dayOfWeek,
      periodNumber: Number(slotData.periodNumber)
    });

    if (res.success) {
      addNotification(`Scheduled ${slotData.subjectName} for ${slotData.dayOfWeek} Period ${slotData.periodNumber}!`, 'success');
      setIsModalOpen(false);
      fetchTimetable();
    } else {
      setFormError(res.error?.message || 'Timetable conflict detected');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = slots.map(s => ({
      Day: s.dayOfWeek,
      Period: `Period ${s.periodNumber}`,
      Subject: s.subject?.name || 'N/A',
      Room: s.room,
      Class: `${s.class?.name} - ${s.section?.name}`
    }));
    exportToCSV(dataToExport, 'Weekly_Timetable_Schedule');
    addNotification('Exported Timetable to CSV!', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSlotForDayAndPeriod = (day, pNum) => {
    return slots.find(s => s.dayOfWeek === day && s.periodNumber === pNum);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Header & Print Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
            Academic Timetable & Schedule Matrix
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Weekly timetable builder with real-time 3-way conflict detection for Teachers, Sections, and Rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Schedule</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {userRole !== 'Student' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Class & Section Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-4 print:hidden">
        <div className="w-48">
          <FormSelect
            label="Class Grade"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
              { value: 'c1', label: 'Grade 10' },
              { value: 'c2', label: 'Grade 11' },
              { value: 'c3', label: 'Grade 12' }
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

      {/* Weekly Matrix Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-slate-800 w-28">Period / Day</th>
                {days.map(d => (
                  <th key={d} className="p-4 border-b border-slate-800 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {periods.map(pNum => (
                <tr key={pNum} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-800 bg-slate-50 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>Period {pNum}</span>
                    </div>
                  </td>

                  {days.map(d => {
                    const slot = getSlotForDayAndPeriod(d, pNum);
                    return (
                      <td key={d} className="p-2 border-r border-slate-100 h-20 vertical-top">
                        {slot ? (
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl space-y-1">
                            <span className="font-bold text-slate-900 block text-xs">{slot.subject?.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">{slot.room}</span>
                          </div>
                        ) : (
                          <div className="h-full min-h-[50px] border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:border-slate-200 cursor-pointer">
                            <span className="text-[10px] font-medium">+ Free</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Timetable Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Day of Week"
              value={slotData.dayOfWeek}
              onChange={(e) => setSlotData({ ...slotData, dayOfWeek: e.target.value })}
              options={days.map(d => ({ value: d, label: d }))}
            />
            <FormSelect
              label="Period Number"
              value={slotData.periodNumber}
              onChange={(e) => setSlotData({ ...slotData, periodNumber: Number(e.target.value) })}
              options={periods.map(p => ({ value: p, label: `Period ${p}` }))}
            />
          </div>

          <FormInput
            label="Subject Name"
            required
            placeholder="e.g. Mathematics"
            value={slotData.subjectName}
            onChange={(e) => setSlotData({ ...slotData, subjectName: e.target.value })}
          />

          <FormInput
            label="Room / Lab"
            required
            placeholder="e.g. Room 302"
            value={slotData.room}
            onChange={(e) => setSlotData({ ...slotData, room: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
          >
            Assign Period Slot
          </button>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Building, 
  Filter, 
  RefreshCw, 
  Users, 
  DollarSign, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  FileCheck,
  Briefcase,
  Globe
} from 'lucide-react';

export const EnterpriseReportsCenter = () => {
  const { addNotification } = useApp();

  const [activeDomain, setActiveDomain] = useState('students');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Universal Filter Controls
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    campusId: 'ALL',
    sessionId: '2026-2027',
    classId: 'ALL',
    sectionId: 'ALL',
    status: 'ALL'
  });

  const REPORT_DOMAINS = [
    { id: 'students', name: 'Students Roster', icon: Users },
    { id: 'admissions', name: 'Admissions Funnel', icon: BookOpen },
    { id: 'attendance', name: 'Attendance Trends', icon: Calendar },
    { id: 'fees', name: 'Fee Billing', icon: DollarSign },
    { id: 'payments', name: 'Payment Transactions', icon: FileCheck },
    { id: 'defaulters', name: 'Fee Defaulters', icon: AlertTriangle },
    { id: 'expenses', name: 'Operational Expenses', icon: Layers },
    { id: 'exams', name: 'Exams Roster', icon: FileText },
    { id: 'results', name: 'Academic Results', icon: CheckCircle2 },
    { id: 'staff', name: 'Staff Roster', icon: Briefcase },
    { id: 'payroll', name: 'Payroll Summary', icon: DollarSign },
    { id: 'website_content', name: 'CMS Website Content', icon: Globe }
  ];

  const fetchReport = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      campusId: filters.campusId,
      sessionId: filters.sessionId,
      classId: filters.classId,
      sectionId: filters.sectionId,
      status: filters.status
    }).toString();

    const res = await apiClient.get(`/reports/${activeDomain}?${query}`);
    setLoading(false);

    if (res.success && res.data) setReportData(res.data);
    else setReportData(null);
  };

  useEffect(() => {
    fetchReport();
  }, [activeDomain, filters]);

  const handleExport = (format) => {
    const query = new URLSearchParams({
      format,
      startDate: filters.startDate,
      endDate: filters.endDate,
      campusId: filters.campusId,
      sessionId: filters.sessionId,
      classId: filters.classId,
      sectionId: filters.sectionId,
      status: filters.status
    }).toString();

    const exportUrl = `${window.location.origin}/api/v1/reports/${activeDomain}/export?${query}`;
    window.open(exportUrl, '_blank');
    addNotification(`Exporting ${activeDomain.toUpperCase()} report in ${format.toUpperCase()} format...`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Centralized Enterprise Reporting Hub
            </h1>
            <Badge variant="primary">Server-Side Generated</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Real-time analytics and server-side exports across 12 institutional domains.
          </p>
        </div>

        {/* 4 Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('print')}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 12 Report Domain Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {REPORT_DOMAINS.map((dom) => {
          const Icon = dom.icon;
          const isSelected = activeDomain === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => setActiveDomain(dom.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
              <span>{dom.name}</span>
            </button>
          );
        })}
      </div>

      {/* Universal Filter Control Panel */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-card grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <FormInput
          label="Start Date"
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <FormInput
          label="End Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <FormSelect
          label="Campus"
          value={filters.campusId}
          onChange={(e) => setFilters({ ...filters, campusId: e.target.value })}
          options={[
            { value: 'ALL', label: 'All Campuses' },
            { value: 'Main Campus', label: 'Main Campus' },
            { value: 'South Campus', label: 'South Campus' }
          ]}
        />
        <FormSelect
          label="Class"
          value={filters.classId}
          onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
          options={[
            { value: 'ALL', label: 'All Classes' },
            { value: 'Grade 9', label: 'Grade 9' },
            { value: 'Grade 10', label: 'Grade 10' },
            { value: 'Grade 11', label: 'Grade 11' }
          ]}
        />
        <FormSelect
          label="Section"
          value={filters.sectionId}
          onChange={(e) => setFilters({ ...filters, sectionId: e.target.value })}
          options={[
            { value: 'ALL', label: 'All Sections' },
            { value: 'Sec-A', label: 'Sec-A' },
            { value: 'Sec-B', label: 'Sec-B' }
          ]}
        />
        <FormSelect
          label="Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'PAID', label: 'PAID' },
            { value: 'PUBLISHED', label: 'PUBLISHED' }
          ]}
        />
      </div>

      {/* Summary Metrics Cards */}
      {reportData && reportData.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(reportData.summary).map(([key, val]) => (
            <div key={key} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-display font-black text-2xl text-slate-900 block">{String(val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Report Data Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-slate-500 space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span>Generating domain report preview...</span>
          </div>
        ) : reportData && reportData.rows ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-700 uppercase">
                  {reportData.columns?.map((col) => (
                    <th key={col} className="p-4 font-bold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {reportData.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {reportData.columns?.map((col) => (
                      <td key={col} className="p-4 font-medium text-slate-800">
                        {row[col] !== undefined ? String(row[col]) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No report data available for selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

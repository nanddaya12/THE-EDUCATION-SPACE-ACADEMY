import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Terminal, 
  Globe, 
  Clock, 
  Eye, 
  Lock, 
  FileText, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const AuditLogManagement = () => {
  const { addNotification } = useApp();

  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const [filters, setFilters] = useState({
    module: 'ALL',
    action: 'ALL',
    userEmail: '',
    startDate: '',
    endDate: '',
    q: ''
  });

  const fetchAuditLogs = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      module: filters.module,
      action: filters.action,
      userEmail: filters.userEmail,
      startDate: filters.startDate,
      endDate: filters.endDate,
      q: filters.q
    }).toString();

    const res = await apiClient.get(`/system/audit-logs?${query}`);
    setLoading(false);

    if (res.success && res.data) setAuditData(res.data);
    else setAuditData(null);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const getActionBadgeVariant = (action) => {
    if (action.includes('FAILED') || action.includes('DELETE') || action.includes('REFUND')) return 'error';
    if (action.includes('LOGIN') || action.includes('PUBLISH') || action.includes('CREATE')) return 'success';
    if (action.includes('CHANGE') || action.includes('UPDATE') || action.includes('CORRECTION')) return 'warning';
    return 'primary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Security Audit Logging & Compliance Hub
            </h1>
            <Badge variant="primary">ISO 27001 & RBAC Protected</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Real-time audit log stream recording 16 sensitive operations, IP addresses, user agents, and before/after state diffs.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {auditData && auditData.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Logged Events</span>
              <span className="font-display font-black text-3xl text-slate-900 block">{auditData.summary.totalEvents}</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Failed Logins</span>
              <span className="font-display font-black text-3xl text-rose-600 block">{auditData.summary.failedLogins}</span>
            </div>
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Financial Refunds / Overrides</span>
              <span className="font-display font-black text-3xl text-amber-600 block">{auditData.summary.refundsCount}</span>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-card grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <FormSelect
          label="Module"
          value={filters.module}
          onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          options={[
            { value: 'ALL', label: 'All Modules' },
            { value: 'AUTH', label: 'Authentication' },
            { value: 'RBAC', label: 'Roles & Permissions' },
            { value: 'STUDENTS', label: 'Students Roster' },
            { value: 'ATTENDANCE', label: 'Attendance' },
            { value: 'FEES', label: 'Fees & Payments' },
            { value: 'EXAMS', label: 'Exams & Results' },
            { value: 'PAYROLL', label: 'Payroll' },
            { value: 'CMS', label: 'CMS Publishing' },
            { value: 'DOCUMENTS', label: 'Document Access' }
          ]}
        />

        <FormInput
          label="Search User Email"
          placeholder="e.g. admin@edu.com"
          value={filters.userEmail}
          onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
        />

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

        <div className="col-span-2">
          <FormInput
            label="Search Keywords"
            placeholder="Search action, IP, resource ID..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-slate-500 space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span>Fetching audit logs stream...</span>
          </div>
        ) : auditData && auditData.logs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-700 uppercase">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User / Email</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Resource & ID</th>
                  <th className="p-4">Client IP</th>
                  <th className="p-4 text-center">State Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {auditData.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      <span className="block font-bold">{log.userEmail}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{log.userId}</span>
                    </td>
                    <td className="p-4 font-mono">
                      <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-700 font-mono">{log.module}</td>
                    <td className="p-4 text-slate-600 font-mono">
                      <span className="block font-bold text-slate-900">{log.resource}</span>
                      <span className="text-[11px] text-slate-400 block">{log.resourceId}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{log.ipAddress}</td>
                    <td className="p-4 text-center">
                      {(log.beforeState || log.afterState) ? (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>Inspect</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No audit logs found matching criteria.
          </div>
        )}
      </div>

      {/* JSON State Diff Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`Audit State Diff Inspector - ${selectedLog.action}`}
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 font-sans">
              <span className="font-bold text-slate-900 block">{selectedLog.userEmail} ({selectedLog.userId})</span>
              <span className="text-slate-500 text-[11px] block">{new Date(selectedLog.timestamp).toISOString()}</span>
              <span className="text-slate-600 text-xs block font-mono">IP: {selectedLog.ipAddress} | User-Agent: {selectedLog.userAgent}</span>
            </div>

            {selectedLog.beforeState && (
              <div className="space-y-1">
                <span className="font-bold text-rose-600 block uppercase">Before State (Previous)</span>
                <pre className="p-3 bg-slate-900 text-rose-300 rounded-xl overflow-x-auto text-[11px]">
                  {selectedLog.beforeState}
                </pre>
              </div>
            )}

            {selectedLog.afterState && (
              <div className="space-y-1">
                <span className="font-bold text-emerald-600 block uppercase">After State (New State)</span>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl overflow-x-auto text-[11px]">
                  {selectedLog.afterState}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

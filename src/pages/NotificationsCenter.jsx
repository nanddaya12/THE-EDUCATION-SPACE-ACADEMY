import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sliders, 
  Zap, 
  UserCheck, 
  FileText, 
  Smartphone,
  Calendar,
  Layers
} from 'lucide-react';

export const NotificationsCenter = () => {
  const { addNotification } = useApp();

  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'tester', 'preferences', 'history'

  // State
  const [inboxItems, setInboxItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [preferences, setPreferences] = useState({ inAppEnabled: true, emailEnabled: true, smsEnabled: true });
  const [historyLogs, setHistoryLogs] = useState([]);

  // Event Tester Form
  const [selectedEvent, setSelectedEvent] = useState('STUDENT_ABSENT');
  const [testPayload, setTestPayload] = useState({
    studentName: 'Julian Vance',
    date: '2026-08-20',
    classGrade: 'Grade 10',
    amount: '12,000',
    invoiceNumber: 'INV-2026-1001',
    dueDate: '2026-08-31',
    examTitle: 'Mid-Term Examinations 2026',
    grade: 'A+',
    gpa: '3.90',
    applicantName: 'Nora Hayes',
    status: 'ADMITTED',
    headline: 'Sports Day Gala 2026 Announced',
    announcementContent: 'Annual Sports Gala will be held on Nov 15th at Campus Main Arena.'
  });

  const fetchNotificationData = async () => {
    const iRes = await apiClient.get('/notifications/inbox');
    if (iRes.success && iRes.data) setInboxItems(iRes.data);

    const tRes = await apiClient.get('/notifications/templates');
    if (tRes.success && tRes.data) setTemplates(tRes.data);

    const pRes = await apiClient.get('/notifications/preferences');
    if (pRes.success && pRes.data) setPreferences(pRes.data);

    const hRes = await apiClient.get('/notifications/history');
    if (hRes.success && hRes.data) setHistoryLogs(hRes.data);
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const handleTriggerEvent = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/notifications/trigger', {
      event: selectedEvent,
      payload: testPayload
    });

    if (res.success) {
      addNotification(`Trigger event '${selectedEvent}' fired! Dispatched across ${res.data.totalDispatched} channels.`, 'success');
      fetchNotificationData();
    } else {
      addNotification(res.error?.message || 'Failed to trigger event', 'error');
    }
  };

  const handleTogglePreference = async (key, val) => {
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    const res = await apiClient.put('/notifications/preferences', updated);
    if (res.success) {
      addNotification('Notification channel preferences updated!', 'success');
    }
  };

  const handleRetryFailed = async () => {
    const res = await apiClient.post('/notifications/retry');
    if (res.success) {
      addNotification(`Retried ${res.data.retriedCount} failed notifications!`, 'success');
      fetchNotificationData();
    } else {
      addNotification('Failed to retry notifications', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Centralized Omnichannel Communication Engine
            </h1>
            <Badge variant="primary">Async Queue Worker</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            3 Channels (In-App Inbox, Email, SMS), 6 System Events, Preferences, History, and Auto-Retry Engine.
          </p>
        </div>

        <button
          onClick={handleRetryFailed}
          className="bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Failed Queue Jobs</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'inbox' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>In-App User Inbox ({inboxItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tester')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'tester' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Event Templates & Trigger Tester</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'preferences' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Channel Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Delivery Queue & Log Monitor</span>
        </button>
      </div>

      {/* TAB 1: IN-APP INBOX */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">Personal In-App Notification Feed</h3>
            
            <div className="space-y-3">
              {inboxItems.length > 0 ? (
                inboxItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">{item.event}</Badge>
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{item.body}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs font-mono">
                  Your In-App notification inbox is currently empty. Fire a test event trigger below!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES & TRIGGER TESTER */}
      {activeTab === 'tester' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 6 Event Templates Overview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">System Notification Templates (6 Events)</h3>
              
              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{tmpl.event}</span>
                      <div className="flex items-center gap-1">
                        {tmpl.channels.map(c => (
                          <span key={c} className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold">{c}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-slate-800 font-bold block">{tmpl.titleTemplate}</span>
                    <span className="text-slate-500 block">{tmpl.bodyTemplate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Event Trigger Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">Live Event Trigger Hook Dispatcher</h3>
              
              <form onSubmit={handleTriggerEvent} className="space-y-4 text-xs">
                <FormSelect
                  label="Select System Trigger Event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  options={[
                    { value: 'STUDENT_ABSENT', label: '1. Student Absent Event' },
                    { value: 'FEE_GENERATED', label: '2. Fee Generated Event' },
                    { value: 'FEE_OVERDUE', label: '3. Fee Overdue Event' },
                    { value: 'RESULT_PUBLISHED', label: '4. Result Published Event' },
                    { value: 'ADMISSION_STATUS_CHANGED', label: '5. Admission Status Changed' },
                    { value: 'ANNOUNCEMENT_PUBLISHED', label: '6. Announcement Published' }
                  ]}
                />

                <FormInput
                  label="Student / Recipient Name"
                  value={testPayload.studentName}
                  onChange={(e) => setTestPayload({ ...testPayload, studentName: e.target.value })}
                />

                <FormInput
                  label="Fee Amount / Invoice #"
                  value={testPayload.amount}
                  onChange={(e) => setTestPayload({ ...testPayload, amount: e.target.value })}
                />

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Omnichannel Event Trigger</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">User Channel Notification Preferences</h3>
              <p className="text-slate-500 text-xs mt-0.5">Toggle channel delivery preferences for In-App Inbox, SMTP Email, and Mobile SMS Gateway.</p>
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">In-App Notification Feed</span>
                    <span className="text-slate-500 text-xs">Receive real-time notifications in your web dashboard.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.inAppEnabled}
                  onChange={(e) => handleTogglePreference('inAppEnabled', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Email Notifications (SMTP)</span>
                    <span className="text-slate-500 text-xs">Receive email alerts for invoices, results, and absences.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailEnabled}
                  onChange={(e) => handleTogglePreference('emailEnabled', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">SMS Mobile Alerts</span>
                    <span className="text-slate-500 text-xs">Receive instant SMS text messages on your phone.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.smsEnabled}
                  onChange={(e) => handleTogglePreference('smsEnabled', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERY QUEUE & LOG MONITOR */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">Background Queue & Delivery Log</h3>

            <div className="space-y-3">
              {historyLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.event}</span>
                      <Badge variant={log.channel === 'IN_APP' ? 'primary' : log.channel === 'EMAIL' ? 'neutral' : 'warning'}>
                        {log.channel}
                      </Badge>
                      <Badge variant={log.status === 'DELIVERED' ? 'success' : log.status === 'QUEUED' ? 'warning' : 'error'}>
                        {log.status}
                      </Badge>
                    </div>
                    <span className="text-slate-500 block pt-1">{log.title}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Retries: {log.retryCount}/{log.maxRetries}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

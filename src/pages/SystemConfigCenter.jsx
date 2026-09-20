import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormControls';
import { 
  Sliders, 
  Building, 
  MapPin, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Award, 
  Bell, 
  Mail, 
  MessageSquare, 
  Palette, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Globe,
  CheckCircle2,
  Lock,
  ExternalLink,
  Users,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';

const DEFAULT_SYSTEM_CONFIG = {
  general: {
    systemName: 'The Education Space Academy ERP',
    academicYear: 'Academic Session 2026-2027',
    timezone: 'Asia/Karachi (UTC+5)',
    primaryLanguage: 'English (US)',
    portalStatus: 'Operational / Online',
    supportContact: 'support@educationspace.edu',
    systemMotto: 'Nurturing Intellect, Character & Leadership'
  },
  institution: {
    institutionName: 'The Education Space Academy',
    registrationCode: 'EDU-REG-2026-PAK',
    accreditationBody: 'Cambridge International & BISE National Board',
    founderMessage: 'Dedicated to cultivating scholarly excellence, innovation, and character leadership.',
    establishedYear: '2012',
    taxIdentifier: 'NTN-8849201-9'
  },
  campuses: {
    primaryCampus: 'The Education Space Academy (Main Campus)',
    totalCampuses: '1 Campus (Single Active)',
    branchCode: 'TES-MAIN-01',
    crossCampusEnrollment: 'Single Campus Mode (Multi-Branch Architecture Ready)',
    registeredBranches: [
      { id: 'b-1', name: 'The Education Space Academy (Main Campus)', code: 'TES-MAIN-01', type: 'Headquarters / Main', status: 'OPERATIONAL', city: 'Qasimabad, Hyderabad, Sindh' }
    ]
  },
  academic: {
    termSystem: 'Semester System (Fall & Spring)',
    gradingScale: 'GPA 4.0 Standard Scale',
    passPercentageThreshold: 50,
    allowCourseRetakes: 'Allowed within 1 Academic Year',
    creditHoursRequired: 136
  },
  attendance: {
    minimumRequiredAttendance: 75,
    lateCutoffTime: '08:15 AM',
    notifyParentsOnAbsence: 'Enabled (Automated SMS & App Notice)',
    leaveApprovalLevel: 'Class Teacher & Principal'
  },
  fees: {
    currency: 'PKR (₨)',
    gracePeriodDays: 10,
    lateFeePenaltyRate: 5,
    allowPartialInstallments: 'Enabled (Max 3 Installments)',
    paymentGatewayStatus: 'Active (Stripe / 1Link Portal)'
  },
  examinations: {
    gpaFormula: 'Continuous Assessment 40% + Final Examination 60%',
    allowGradeAppeals: 'Allowed within 14 days of publication',
    marksModerationWorkflow: 'HOD Review → Principal Approval'
  },
  notifications: {
    emailNotifications: 'Active',
    smsAlerts: 'Active',
    emergencyBroadcasts: 'High-Priority SMS & WhatsApp Push',
    parentAbsenceAlerts: 'Instant Dispatch at 09:00 AM'
  },
  email: {
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    senderName: 'The Education Space Academy Notifications',
    senderEmail: 'notifications@educationspace.edu',
    smtpPasswordSecret: '••••••••••••••••'
  },
  sms: {
    provider: 'Twilio / Infobip Enterprise Gateway',
    senderId: 'EDUSPACE',
    monthlyQuota: '50,000 Messages',
    maskingRegistered: 'Yes (PTA Approved)'
  },
  branding: {
    primaryColorHex: '#0b1c30',
    accentColorHex: '#e05626',
    websiteTitle: 'The Education Space Academy',
    headerLogoUrl: '/favicon.svg'
  },
  documents: {
    autoWatermarkCertificates: 'Enabled with Academy Seal',
    qrVerificationEnabled: 'Enabled (Tamper-Proof Online Validation)',
    signatureSignOff: 'Dr. Arthur Pendelton (Campus Principal)'
  },
  reports: {
    defaultFormat: 'PDF Document & Excel XLSX',
    headerLogoOnPrint: 'Enabled',
    confidentialStampOnTranscripts: 'Official Registrar Seal'
  },
  security: {
    mfaEnforced: 'ADMINS_ONLY',
    sessionTimeoutMinutes: 30,
    maxFailedLogins: 5,
    auditLogRetention: '365 Days Rolling'
  },
  localization: {
    locale: 'en-US',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '₨ (PKR)',
    firstDayOfWeek: 'Monday'
  }
};

export const SystemConfigCenter = () => {
  const { addNotification, setCurrentView, roles } = useApp();

  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_system_config_v2');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && parsed.general) {
        if (parsed.campuses?.totalCampuses === '4 Campuses' || !parsed.campuses?.registeredBranches) {
          parsed.campuses = DEFAULT_SYSTEM_CONFIG.campuses;
        }
        return parsed;
      }
      return DEFAULT_SYSTEM_CONFIG;
    } catch (e) {
      return DEFAULT_SYSTEM_CONFIG;
    }
  });

  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchData, setNewBranchData] = useState({
    name: '',
    code: '',
    type: 'Sub-Branch Campus',
    city: '',
    status: 'PLANNED'
  });

  const CONFIG_SECTIONS = [
    { id: 'general', name: 'General', icon: Sliders },
    { id: 'institution', name: 'Institution', icon: Building },
    { id: 'campuses', name: 'Campuses', icon: MapPin },
    { id: 'academic', name: 'Academic', icon: BookOpen },
    { id: 'attendance', name: 'Attendance', icon: Calendar },
    { id: 'fees', name: 'Fees & Rules', icon: DollarSign },
    { id: 'examinations', name: 'Examinations', icon: Award },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'sms', name: 'SMS Settings', icon: MessageSquare },
    { id: 'branding', name: 'Branding', icon: Palette },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'reports', name: 'Reports', icon: Printer },
    { id: 'security', name: 'Security', icon: ShieldCheck },
    { id: 'localization', name: 'Localization', icon: Globe }
  ];

  // Attempt backend fetch, fallback safely to local defaults
  useEffect(() => {
    const loadBackend = async () => {
      try {
        const res = await apiClient.get('/system/config');
        if (res?.success && res?.data) {
          setConfig(prev => ({ ...prev, ...res.data }));
        }
      } catch (e) {
        // Safe offline client fallback
      }
    };
    loadBackend();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      localStorage.setItem('edu_system_config_v2', JSON.stringify(config));
      await apiClient.put('/system/config', config).catch(() => {});
      addNotification('System configuration updated across all 15 sections!', 'success');
    } catch (e) {
      addNotification('Settings saved locally', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBranch = (e) => {
    e?.preventDefault();
    if (!newBranchData.name.trim() || !newBranchData.code.trim()) {
      addNotification('Please enter Branch Name and Branch Code', 'warning');
      return;
    }
    const currentBranches = config.campuses?.registeredBranches || [
      { id: 'b-1', name: 'The Education Space Academy (Main Campus)', code: 'TES-MAIN-01', type: 'Headquarters / Main', status: 'OPERATIONAL', city: 'Qasimabad, Hyderabad, Sindh' }
    ];
    const newBranch = {
      id: `b-${Date.now()}`,
      name: newBranchData.name.trim(),
      code: newBranchData.code.trim().toUpperCase(),
      type: newBranchData.type,
      city: newBranchData.city.trim() || 'Pakistan',
      status: newBranchData.status
    };
    const updatedBranches = [...currentBranches, newBranch];
    const updatedConfig = {
      ...config,
      campuses: {
        ...config.campuses,
        totalCampuses: `${updatedBranches.length} Campuses (${updatedBranches.filter(b => b.status === 'OPERATIONAL').length} Active, ${updatedBranches.filter(b => b.status !== 'OPERATIONAL').length} Future Expansion)`,
        registeredBranches: updatedBranches
      }
    };
    setConfig(updatedConfig);
    localStorage.setItem('edu_system_config_v2', JSON.stringify(updatedConfig));
    setNewBranchData({ name: '', code: '', type: 'Sub-Branch Campus', city: '', status: 'PLANNED' });
    setShowAddBranchModal(false);
    addNotification(`Future campus branch "${newBranch.name}" successfully registered!`, 'success');
  };

  const handleRemoveBranch = (branchId) => {
    const currentBranches = config.campuses?.registeredBranches || [];
    const target = currentBranches.find(b => b.id === branchId);
    if (target?.code === 'TES-MAIN-01') {
      addNotification('The primary operational campus (Main Campus) cannot be removed.', 'warning');
      return;
    }
    const updatedBranches = currentBranches.filter(b => b.id !== branchId);
    const updatedConfig = {
      ...config,
      campuses: {
        ...config.campuses,
        totalCampuses: `${updatedBranches.length} Campus${updatedBranches.length === 1 ? ' (Single Active)' : 'es'}`,
        registeredBranches: updatedBranches
      }
    };
    setConfig(updatedConfig);
    localStorage.setItem('edu_system_config_v2', JSON.stringify(updatedConfig));
    addNotification('Campus branch removed from registry', 'info');
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
              System Configuration & Administration Center
            </h1>
            <Badge variant="primary">Audit Logged</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Centralized management across 15 system configuration domains with secret masking and policy enforcement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin-roles')}
            className="bg-[#0b1c30] hover:bg-[#162f4d] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#e05626]" />
            <span>Manage 39 Roles & Security</span>
          </button>

          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Quick Governance Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setCurrentView('admin-roles')}
          className="bg-[#0b1c30] text-white p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-[#e05626] transition-all flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e05626]/20 flex items-center justify-center text-[#e05626]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Roles & Capabilities Matrix</div>
              <div className="text-[11px] text-slate-400">{roles?.length || 39} Roles Configured</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#e05626] group-hover:translate-x-1 transition-transform" />
        </div>

        <div 
          onClick={() => setCurrentView('site-profiles')}
          className="bg-white text-slate-800 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-primary transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Site Profiles Hub</div>
              <div className="text-[11px] text-slate-500">Manage Students, Faculty & Staff</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>

        <div 
          onClick={() => setCurrentView('public-site-customizer')}
          className="bg-white text-slate-800 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-[#e05626] transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#e05626]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Public Website Customizer</div>
              <div className="text-[11px] text-slate-500">Live Hero, Banners & Admissions</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#e05626] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 15 Section Switcher Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
        {CONFIG_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-soft ring-2 ring-primary/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
              <span className="font-bold text-[11px] leading-tight block">{sec.name}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION FORM PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* SECTION: GENERAL */}
        {activeSection === 'general' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              General System Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="System Display Name"
                value={config.general.systemName}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, systemName: e.target.value } })}
              />
              <FormInput
                label="Active Academic Session"
                value={config.general.academicYear}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, academicYear: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Primary Timezone"
                value={config.general.timezone}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, timezone: e.target.value } })}
              />
              <FormInput
                label="Default Language"
                value={config.general.primaryLanguage}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, primaryLanguage: e.target.value } })}
              />
              <FormInput
                label="Portal Operational Status"
                value={config.general.portalStatus}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, portalStatus: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="System Support Email"
                value={config.general.supportContact}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, supportContact: e.target.value } })}
              />
              <FormInput
                label="Institutional Motto / Vision"
                value={config.general.systemMotto}
                onChange={(e) => setConfig({ ...config, general: { ...config.general, systemMotto: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: INSTITUTION */}
        {activeSection === 'institution' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Institution Legal & Accreditation Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Institution Legal Name"
                value={config.institution.institutionName}
                onChange={(e) => setConfig({ ...config, institution: { ...config.institution, institutionName: e.target.value } })}
              />
              <FormInput
                label="Registration & Board Code"
                value={config.institution.registrationCode}
                onChange={(e) => setConfig({ ...config, institution: { ...config.institution, registrationCode: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Accreditation Body"
                value={config.institution.accreditationBody}
                onChange={(e) => setConfig({ ...config, institution: { ...config.institution, accreditationBody: e.target.value } })}
              />
              <FormInput
                label="Year of Foundation"
                value={config.institution.establishedYear}
                onChange={(e) => setConfig({ ...config, institution: { ...config.institution, establishedYear: e.target.value } })}
              />
            </div>
            <FormInput
              label="Executive Message from Patron / Rector"
              value={config.institution.founderMessage}
              onChange={(e) => setConfig({ ...config, institution: { ...config.institution, founderMessage: e.target.value } })}
            />
          </div>
        )}

        {/* SECTION: CAMPUSES */}
        {activeSection === 'campuses' && (
          <div className="space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Campuses & Institutional Multi-Branch Architecture</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  The Education Space Academy operates from a centralized Main Campus with built-in multi-branch scaling.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">1 Active Operational Campus</Badge>
                <Badge variant="primary">Future Expansion Ready</Badge>
              </div>
            </div>

            {/* Architecture Explanatory Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0b1c30] text-white border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Single Campus Operational • Future Expansion Ready</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Currently, <strong>The Education Space Academy (TES)</strong> has <strong>1 active campus</strong> (Main Campus). The ERP engine is architected with scoped branch partitioning: when new physical or regional campuses are launched in the future, you can register and assign roles, staff, and student cohorts to them instantly without database schema migration.
              </p>
            </div>

            {/* Operational Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <FormInput
                label="Primary Executive Campus Name"
                value={config.campuses.primaryCampus}
                onChange={(e) => setConfig({ ...config, campuses: { ...config.campuses, primaryCampus: e.target.value } })}
              />
              <FormInput
                label="Primary Branch Operational Code"
                value={config.campuses.branchCode}
                onChange={(e) => setConfig({ ...config, campuses: { ...config.campuses, branchCode: e.target.value } })}
              />
              <FormInput
                label="Total Registered Campuses"
                value={config.campuses.totalCampuses}
                onChange={(e) => setConfig({ ...config, campuses: { ...config.campuses, totalCampuses: e.target.value } })}
              />
              <FormInput
                label="Cross-Campus Student Records Access"
                value={config.campuses.crossCampusEnrollment}
                onChange={(e) => setConfig({ ...config, campuses: { ...config.campuses, crossCampusEnrollment: e.target.value } })}
              />
            </div>

            {/* Campus Registry & Future Branch Manager */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Registered Campus Directory</h4>
                  <p className="text-slate-500 text-[11px]">Manage current active facilities and register prospective branches.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(!showAddBranchModal)}
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddBranchModal ? 'Cancel Registration' : '+ Register Future Branch'}</span>
                </button>
              </div>

              {/* Add Branch Inline Form */}
              {showAddBranchModal && (
                <form onSubmit={handleAddBranch} className="p-4 rounded-xl bg-slate-50 border border-primary/30 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Building className="w-4 h-4" />
                    <span>Register Prospective / Future Campus Branch</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-[11px]">Branch Name</label>
                      <input
                        type="text"
                        placeholder="e.g. TES South Campus / DHA Branch"
                        value={newBranchData.name}
                        onChange={(e) => setNewBranchData({ ...newBranchData, name: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-[11px]">Branch Code</label>
                      <input
                        type="text"
                        placeholder="e.g. TES-BR-02"
                        value={newBranchData.code}
                        onChange={(e) => setNewBranchData({ ...newBranchData, code: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-[11px]">City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Lahore / Rawalpindi"
                        value={newBranchData.city}
                        onChange={(e) => setNewBranchData({ ...newBranchData, city: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-[11px]">Branch Status</label>
                      <select
                        value={newBranchData.status}
                        onChange={(e) => setNewBranchData({ ...newBranchData, status: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-bold bg-white"
                      >
                        <option value="PLANNED">Planned (Future Expansion)</option>
                        <option value="UNDER_CONSTRUCTION">Under Construction</option>
                        <option value="OPERATIONAL">Operational (Active)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddBranchModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Future Branch</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Branches Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-[11px] font-mono border-b border-slate-200">
                      <th className="p-3">Campus Branch Name</th>
                      <th className="p-3">Branch Code</th>
                      <th className="p-3">Facility Type</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Operational Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {(config.campuses?.registeredBranches || [
                      { id: 'b-1', name: 'The Education Space Academy (Main Campus)', code: 'TES-MAIN-01', type: 'Headquarters / Main', status: 'OPERATIONAL', city: 'Qasimabad, Hyderabad, Sindh' }
                    ]).map((branch) => {
                      const isMain = branch.code === 'TES-MAIN-01' || branch.status === 'OPERATIONAL' && branch.id === 'b-1';
                      return (
                        <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{branch.name}</div>
                            {isMain && (
                              <span className="text-[10px] text-primary font-bold">★ Active Institutional Headquarters</span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">{branch.code}</td>
                          <td className="p-3 text-slate-600">{branch.type}</td>
                          <td className="p-3 text-slate-600">{branch.city || 'Pakistan'}</td>
                          <td className="p-3">
                            <Badge variant={branch.status === 'OPERATIONAL' ? 'success' : 'warning'}>
                              {branch.status === 'OPERATIONAL' ? 'Operational (Active)' : branch.status === 'UNDER_CONSTRUCTION' ? 'Under Construction' : 'Planned (Future Expansion)'}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {isMain ? (
                              <span className="text-slate-400 font-mono text-[11px] italic">Protected Core</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveBranch(branch.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-all"
                                title="Remove Branch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ACADEMIC */}
        {activeSection === 'academic' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Academic Curriculum & Grading Policy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Term Structure"
                value={config.academic.termSystem}
                onChange={(e) => setConfig({ ...config, academic: { ...config.academic, termSystem: e.target.value } })}
              />
              <FormInput
                label="Grading Scale"
                value={config.academic.gradingScale}
                onChange={(e) => setConfig({ ...config, academic: { ...config.academic, gradingScale: e.target.value } })}
              />
              <FormInput
                label="Passing Threshold (%)"
                type="number"
                value={config.academic.passPercentageThreshold}
                onChange={(e) => setConfig({ ...config, academic: { ...config.academic, passPercentageThreshold: Number(e.target.value) } })}
              />
            </div>
            <FormInput
              label="Course Retake Policy"
              value={config.academic.allowCourseRetakes}
              onChange={(e) => setConfig({ ...config, academic: { ...config.academic, allowCourseRetakes: e.target.value } })}
            />
          </div>
        )}

        {/* SECTION: ATTENDANCE */}
        {activeSection === 'attendance' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Attendance Rules & Thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Minimum Required Attendance (%)"
                type="number"
                value={config.attendance.minimumRequiredAttendance}
                onChange={(e) => setConfig({ ...config, attendance: { ...config.attendance, minimumRequiredAttendance: Number(e.target.value) } })}
              />
              <FormInput
                label="Late Arrival Cutoff Time"
                value={config.attendance.lateCutoffTime}
                onChange={(e) => setConfig({ ...config, attendance: { ...config.attendance, lateCutoffTime: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Parent Absence Notification Policy"
                value={config.attendance.notifyParentsOnAbsence}
                onChange={(e) => setConfig({ ...config, attendance: { ...config.attendance, notifyParentsOnAbsence: e.target.value } })}
              />
              <FormInput
                label="Medical Leave Approval Authority"
                value={config.attendance.leaveApprovalLevel}
                onChange={(e) => setConfig({ ...config, attendance: { ...config.attendance, leaveApprovalLevel: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: FEES */}
        {activeSection === 'fees' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Fee Rules, Currencies & Concessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Billing Currency Code"
                value={config.fees.currency}
                onChange={(e) => setConfig({ ...config, fees: { ...config.fees, currency: e.target.value } })}
              />
              <FormInput
                label="Grace Period (Days)"
                type="number"
                value={config.fees.gracePeriodDays}
                onChange={(e) => setConfig({ ...config, fees: { ...config.fees, gracePeriodDays: Number(e.target.value) } })}
              />
              <FormInput
                label="Late Fee Fine Rate (%)"
                type="number"
                value={config.fees.lateFeePenaltyRate}
                onChange={(e) => setConfig({ ...config, fees: { ...config.fees, lateFeePenaltyRate: Number(e.target.value) } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Installment Payment Policy"
                value={config.fees.allowPartialInstallments}
                onChange={(e) => setConfig({ ...config, fees: { ...config.fees, allowPartialInstallments: e.target.value } })}
              />
              <FormInput
                label="Payment Gateway Configuration"
                value={config.fees.paymentGatewayStatus}
                onChange={(e) => setConfig({ ...config, fees: { ...config.fees, paymentGatewayStatus: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: EXAMINATIONS */}
        {activeSection === 'examinations' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Examinations & Results Governance
            </h3>
            <FormInput
              label="Evaluation Weightage Formula"
              value={config.examinations.gpaFormula}
              onChange={(e) => setConfig({ ...config, examinations: { ...config.examinations, gpaFormula: e.target.value } })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Grade Appeal Window"
                value={config.examinations.allowGradeAppeals}
                onChange={(e) => setConfig({ ...config, examinations: { ...config.examinations, allowGradeAppeals: e.target.value } })}
              />
              <FormInput
                label="Moderation Sign-off Chain"
                value={config.examinations.marksModerationWorkflow}
                onChange={(e) => setConfig({ ...config, examinations: { ...config.examinations, marksModerationWorkflow: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Automated Notification Gateways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Automated Email Channel"
                value={config.notifications.emailNotifications}
                onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, emailNotifications: e.target.value } })}
              />
              <FormInput
                label="Automated SMS Dispatch Channel"
                value={config.notifications.smsAlerts}
                onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, smsAlerts: e.target.value } })}
              />
            </div>
            <FormInput
              label="Campus Emergency Broadcast Protocol"
              value={config.notifications.emergencyBroadcasts}
              onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, emergencyBroadcasts: e.target.value } })}
            />
          </div>
        )}

        {/* SECTION: EMAIL SETTINGS */}
        {activeSection === 'email' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-lg text-slate-900">Email SMTP Credentials</h3>
              <Badge variant="warning"><Lock className="w-3.5 h-3.5 inline mr-1" /> Secrets Masked</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="SMTP Host"
                value={config.email.smtpHost}
                onChange={(e) => setConfig({ ...config, email: { ...config.email, smtpHost: e.target.value } })}
              />
              <FormInput
                label="SMTP Port"
                type="number"
                value={config.email.smtpPort}
                onChange={(e) => setConfig({ ...config, email: { ...config.email, smtpPort: Number(e.target.value) } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Sender Display Name"
                value={config.email.senderName}
                onChange={(e) => setConfig({ ...config, email: { ...config.email, senderName: e.target.value } })}
              />
              <FormInput
                label="SMTP Password Secret (Masked)"
                type={showSecrets ? 'text' : 'password'}
                value={config.email.smtpPasswordSecret}
                onChange={(e) => setConfig({ ...config, email: { ...config.email, smtpPasswordSecret: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: SMS SETTINGS */}
        {activeSection === 'sms' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              SMS Gateway Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="SMS Telecom Provider"
                value={config.sms.provider}
                onChange={(e) => setConfig({ ...config, sms: { ...config.sms, provider: e.target.value } })}
              />
              <FormInput
                label="Official Sender Brand ID"
                value={config.sms.senderId}
                onChange={(e) => setConfig({ ...config, sms: { ...config.sms, senderId: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Allocated Monthly Quota"
                value={config.sms.monthlyQuota}
                onChange={(e) => setConfig({ ...config, sms: { ...config.sms, monthlyQuota: e.target.value } })}
              />
              <FormInput
                label="Brand Masking Regulatory Status"
                value={config.sms.maskingRegistered}
                onChange={(e) => setConfig({ ...config, sms: { ...config.sms, maskingRegistered: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: BRANDING */}
        {activeSection === 'branding' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Website & Portal Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Primary Brand Color (Hex)"
                value={config.branding.primaryColorHex}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColorHex: e.target.value } })}
              />
              <FormInput
                label="Accent Brand Color (Hex)"
                value={config.branding.accentColorHex}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, accentColorHex: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Brand Title"
                value={config.branding.websiteTitle}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, websiteTitle: e.target.value } })}
              />
              <FormInput
                label="Header Logo URL"
                value={config.branding.headerLogoUrl}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, headerLogoUrl: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: DOCUMENTS */}
        {activeSection === 'documents' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Official Certificates & Document Printing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Certificate Watermark Status"
                value={config.documents.autoWatermarkCertificates}
                onChange={(e) => setConfig({ ...config, documents: { ...config.documents, autoWatermarkCertificates: e.target.value } })}
              />
              <FormInput
                label="QR Code Tamper-Proof Verification"
                value={config.documents.qrVerificationEnabled}
                onChange={(e) => setConfig({ ...config, documents: { ...config.documents, qrVerificationEnabled: e.target.value } })}
              />
            </div>
            <FormInput
              label="Default Signature Sign-Off"
              value={config.documents.signatureSignOff}
              onChange={(e) => setConfig({ ...config, documents: { ...config.documents, signatureSignOff: e.target.value } })}
            />
          </div>
        )}

        {/* SECTION: REPORTS */}
        {activeSection === 'reports' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Institutional Reports & Print Formats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Default Export Formats"
                value={config.reports.defaultFormat}
                onChange={(e) => setConfig({ ...config, reports: { ...config.reports, defaultFormat: e.target.value } })}
              />
              <FormInput
                label="Print Header Logo"
                value={config.reports.headerLogoOnPrint}
                onChange={(e) => setConfig({ ...config, reports: { ...config.reports, headerLogoOnPrint: e.target.value } })}
              />
              <FormInput
                label="Confidential Stamp"
                value={config.reports.confidentialStampOnTranscripts}
                onChange={(e) => setConfig({ ...config, reports: { ...config.reports, confidentialStampOnTranscripts: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: SECURITY */}
        {activeSection === 'security' && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Institutional Security Policies & Access Control
              </h3>
              <Badge variant="primary">Security Hardened</Badge>
            </div>

            {/* Dedicated link to Roles & Security Matrix */}
            <div className="bg-[#0b1c30] text-white p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#e05626]" />
                <div>
                  <h4 className="font-bold text-sm text-white">Full Academy Roles & Capability Matrix (39 Roles)</h4>
                  <p className="text-xs text-slate-300">
                    Fine-grained role creation, deletion, capability matrix, MFA enforcement, and audit logs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('admin-roles')}
                className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Open Roles & Security Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Multi-Factor Authentication (MFA) Policy"
                value={config.security.mfaEnforced}
                onChange={(e) => setConfig({ ...config, security: { ...config.security, mfaEnforced: e.target.value } })}
              />
              <FormInput
                label="Session Max Idle Timeout (Minutes)"
                type="number"
                value={config.security.sessionTimeoutMinutes}
                onChange={(e) => setConfig({ ...config, security: { ...config.security, sessionTimeoutMinutes: Number(e.target.value) } })}
              />
            </div>
          </div>
        )}

        {/* SECTION: LOCALIZATION */}
        {activeSection === 'localization' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Regional & Localization Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="System Locale"
                value={config.localization.locale}
                onChange={(e) => setConfig({ ...config, localization: { ...config.localization, locale: e.target.value } })}
              />
              <FormInput
                label="Official Date Format"
                value={config.localization.dateFormat}
                onChange={(e) => setConfig({ ...config, localization: { ...config.localization, dateFormat: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Currency Symbol"
                value={config.localization.currencySymbol}
                onChange={(e) => setConfig({ ...config, localization: { ...config.localization, currencySymbol: e.target.value } })}
              />
              <FormInput
                label="First Day of the Week"
                value={config.localization.firstDayOfWeek}
                onChange={(e) => setConfig({ ...config, localization: { ...config.localization, firstDayOfWeek: e.target.value } })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

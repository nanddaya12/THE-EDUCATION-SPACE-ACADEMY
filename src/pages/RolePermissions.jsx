import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Check, 
  X, 
  Lock, 
  Unlock,
  AlertTriangle,
  Info,
  ShieldAlert,
  Edit2,
  Trash2,
  RotateCcw,
  Sliders,
  KeyRound,
  Fingerprint,
  Clock,
  Globe2,
  Save,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

export const RolePermissions = () => {
  const { 
    roles, 
    addRole, 
    updateRole, 
    deleteRole, 
    updateRolePermission, 
    batchUpdateRolePermissions,
    resetRolesToDefault,
    availablePermissions,
    securitySettings,
    updateSecuritySettings,
    securityAuditLogs,
    addNotification,
    userRole
  } = useApp();

  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'security'
  const [selectedRoleId, setSelectedRoleId] = useState(() => roles[0]?.id || 'r_super_admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    displayName: '',
    category: 'Academic',
    description: '',
    cloneFromId: ''
  });

  // Security policies local editing state
  const [securityForm, setSecurityForm] = useState({ ...securitySettings });

  // Selected active role
  const currentRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  // Category list covering all school departments
  const categories = [
    'ALL',
    'Executive',
    'Academic',
    'Faculty',
    'Student Care',
    'Admissions',
    'Finance',
    'Library & IT',
    'Logistics & Safety',
    'Operations',
    'Portal',
    'Custom'
  ];

  // Filtered roles
  const filteredRoles = roles.filter(role => {
    const matchesCat = categoryFilter === 'ALL' || role.category === categoryFilter;
    const matchesSearch = (role.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (role.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (role.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Modules grouping of available permissions
  const moduleGroups = {};
  (availablePermissions || []).forEach(p => {
    if (!moduleGroups[p.module]) {
      moduleGroups[p.module] = [];
    }
    moduleGroups[p.module].push(p);
  });

  // Permission check helper
  const isPermGranted = (role, permKey) => {
    if (!role || !role.permissions) return false;
    if (role.name === 'SUPER_ADMIN') return true;
    return !!role.permissions[permKey];
  };

  // Toggle single permission
  const handleTogglePermission = (permKey) => {
    if (currentRole.isProtected && currentRole.name === 'SUPER_ADMIN') {
      addNotification('SUPER_ADMIN maintains full system permissions and cannot be restricted.', 'warning');
      return;
    }
    const currentVal = isPermGranted(currentRole, permKey);
    updateRolePermission(currentRole.id, permKey, !currentVal);
  };

  // Grant all in current role
  const handleGrantAll = () => {
    if (currentRole.isProtected && currentRole.name === 'SUPER_ADMIN') return;
    const allTrue = {};
    availablePermissions.forEach(p => {
      allTrue[p.key] = true;
    });
    batchUpdateRolePermissions(currentRole.id, allTrue);
    addNotification(`All permissions granted to "${currentRole.displayName || currentRole.name}"`, 'success');
  };

  // Revoke all in current role
  const handleRevokeAll = () => {
    if (currentRole.isProtected && currentRole.name === 'SUPER_ADMIN') {
      addNotification('SUPER_ADMIN cannot be revoked.', 'error');
      return;
    }
    batchUpdateRolePermissions(currentRole.id, {});
    addNotification(`All permissions revoked from "${currentRole.displayName || currentRole.name}"`, 'info');
  };

  // Create new role submission
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleForm.displayName) {
      addNotification('Please enter a role name', 'error');
      return;
    }

    let initialPerms = {};
    if (newRoleForm.cloneFromId) {
      const source = roles.find(r => r.id === newRoleForm.cloneFromId);
      if (source && source.permissions) {
        initialPerms = { ...source.permissions };
      }
    }

    const formattedCode = newRoleForm.displayName.toUpperCase().replace(/\s+/g, '_');

    addRole({
      name: formattedCode,
      displayName: newRoleForm.displayName,
      category: newRoleForm.category,
      description: newRoleForm.description || 'Custom administrative or operational capability role.',
      permissions: initialPerms
    });

    setIsAddModalOpen(false);
    setNewRoleForm({ name: '', displayName: '', category: 'Academic', description: '', cloneFromId: '' });
  };

  // Edit role submission
  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    if (!editingRole || !editingRole.displayName) return;

    updateRole(editingRole.id, {
      displayName: editingRole.displayName,
      category: editingRole.category,
      description: editingRole.description
    });

    setIsEditModalOpen(false);
    setEditingRole(null);
  };

  // Delete role handler
  const handleDeleteRole = (role) => {
    if (role.isProtected || role.name === 'SUPER_ADMIN') {
      addNotification('System-protected roles cannot be removed', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${role.displayName || role.name}"? This action is immediate.`)) {
      deleteRole(role.id);
      if (selectedRoleId === role.id) {
        setSelectedRoleId(roles[0]?.id || 'r_super_admin');
      }
    }
  };

  // Save security settings
  const handleSaveSecuritySettings = (e) => {
    e.preventDefault();
    updateSecuritySettings(securityForm);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-[#0b1c30] text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#e05626]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e05626]/20 border border-[#e05626]/30 text-[#e05626] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Super Administrator Governance Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-serif">
              Roles, Permissions & Security Center
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Full authoring, modification, and deletion capabilities over system access matrices, granular dot-notation permissions, multi-factor authentication, and institutional security posture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#e05626] hover:bg-[#c9461b] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Role</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all roles to factory system defaults? Custom roles will remain untouched.')) {
                  resetRolesToDefault();
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-semibold text-xs px-4 py-3 rounded-xl transition-all flex items-center gap-2"
              title="Reset System Roles"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Quick Governance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Roles</div>
            <div className="text-xl font-bold text-white mt-0.5">{roles.length} Roles Active</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Capabilities Defined</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{availablePermissions.length} Granular Rules</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Security Enforcement</div>
            <div className="text-xl font-bold text-[#e05626] mt-0.5">{securitySettings.mfaEnforcement}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Session Max Idle</div>
            <div className="text-xl font-bold text-slate-200 mt-0.5">{securitySettings.sessionTimeoutMinutes} Minutes</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-[#0b1c30] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Roles & Capability Matrix</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
            {roles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-[#0b1c30] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Security & Authentication Policies</span>
        </button>
      </div>

      {/* TAB 1: ROLES & CAPABILITY MATRIX */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Role Selector & Search */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Role to Manage
                </span>
                <span className="text-[11px] font-bold text-primary">
                  {filteredRoles.length} Matching
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role code or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category Pill Filters */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${
                      categoryFilter === cat
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Role List Cards */}
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredRoles.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-md ring-2 ring-[#e05626]/30'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold block truncate">
                            {role.displayName || role.name}
                          </span>
                          <span className={`text-[10px] font-mono block truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {role.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected 
                              ? 'bg-[#e05626] text-white' 
                              : role.category === 'Executive' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {role.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/40">
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                          {role.usersCount || 0} assigned users
                        </span>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setEditingRole(role);
                              setIsEditModalOpen(true);
                            }}
                            className={`p-1 rounded hover:bg-white/20 transition-all ${isSelected ? 'text-white' : 'text-slate-500'}`}
                            title="Edit Role Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {!role.isProtected && role.name !== 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-1 rounded hover:bg-rose-500/20 text-rose-500 transition-all"
                              title="Delete Role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Permission Matrix for Selected Role */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
              {/* Card Header with Quick Actions */}
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-on-surface">
                      Capability Matrix:
                    </h3>
                    <span className="bg-[#0b1c30] text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {currentRole?.displayName || currentRole?.name}
                    </span>
                    {currentRole?.isProtected && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Protected Core</span>
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    {currentRole?.description}
                  </p>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGrantAll}
                    disabled={currentRole?.name === 'SUPER_ADMIN'}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Grant All</span>
                  </button>

                  <button
                    onClick={handleRevokeAll}
                    disabled={currentRole?.name === 'SUPER_ADMIN'}
                    className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Revoke All</span>
                  </button>
                </div>
              </div>

              {/* Module-by-Module Permission Checkboxes */}
              <div className="p-6 space-y-6">
                {Object.keys(moduleGroups).map((moduleName) => {
                  const perms = moduleGroups[moduleName];
                  const allGrantedInModule = perms.every(p => isPermGranted(currentRole, p.key));

                  return (
                    <div key={moduleName} className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/40">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            {moduleName} Capabilities
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {perms.filter(p => isPermGranted(currentRole, p.key)).length} of {perms.length} Enabled
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map((perm) => {
                          const isChecked = isPermGranted(currentRole, perm.key);
                          const isSuper = currentRole?.name === 'SUPER_ADMIN';

                          return (
                            <label
                              key={perm.key}
                              onClick={(e) => {
                                e.preventDefault();
                                handleTogglePermission(perm.key);
                              }}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-white border-primary/40 shadow-sm ring-1 ring-primary/10'
                                  : 'bg-white/60 border-slate-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className="pr-2">
                                <span className="font-bold text-slate-800 block text-xs">
                                  {perm.label}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                                  {perm.key}
                                </span>
                              </div>

                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isChecked
                                  ? 'bg-primary border-primary text-white'
                                  : 'bg-white border-slate-300'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & AUTHENTICATION POLICIES */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Policy Settings Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-[#e05626]" />
                  <span>Institutional Security & Access Governance</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure enterprise multi-factor authentication, session lifecycle, password complexity, and lockout policies.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSecuritySettings} className="space-y-6">
              {/* MFA Policy */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Multi-Factor Authentication (MFA) Policy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'DISABLED', label: 'Disabled', desc: 'Single-factor password' },
                    { id: 'ADMINS_ONLY', label: 'Admins & Staff Only', desc: 'Enforced for executive roles' },
                    { id: 'ALL_USERS', label: 'Enforce for All', desc: 'Required for students, teachers & staff' }
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSecurityForm({ ...securityForm, mfaEnforcement: opt.id })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        securityForm.mfaEnforcement === opt.id
                          ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${securityForm.mfaEnforcement === opt.id ? 'text-slate-300' : 'text-slate-400'}`}>
                        {opt.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Security */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Session Idle Timeout (Minutes)
                  </label>
                  <select
                    value={securityForm.sessionTimeoutMinutes}
                    onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeoutMinutes: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
                  >
                    <option value={15}>15 Minutes (Strict Security)</option>
                    <option value={30}>30 Minutes (Recommended)</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={120}>120 Minutes (Extended)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Failed Logins Before Lockout
                  </label>
                  <select
                    value={securityForm.maxFailedLogins}
                    onChange={(e) => setSecurityForm({ ...securityForm, maxFailedLogins: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
                  >
                    <option value={3}>3 Attempts (High Protection)</option>
                    <option value={5}>5 Attempts (Standard)</option>
                    <option value={10}>10 Attempts (Relaxed)</option>
                  </select>
                </div>
              </div>

              {/* Password Complexity */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Password Governance Complexity Rules
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.passwordPolicy?.requireUppercase}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        passwordPolicy: { ...securityForm.passwordPolicy, requireUppercase: e.target.checked }
                      })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Require Uppercase Letters (A-Z)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.passwordPolicy?.requireNumbers}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        passwordPolicy: { ...securityForm.passwordPolicy, requireNumbers: e.target.checked }
                      })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Require Numerical Digits (0-9)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.passwordPolicy?.requireSpecialChars}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        passwordPolicy: { ...securityForm.passwordPolicy, requireSpecialChars: e.target.checked }
                      })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Require Special Symbols (!@#$%^&*)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.enforceHttpsOnly}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        enforceHttpsOnly: e.target.checked
                      })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Enforce HTTPS SSL Only</span>
                  </label>
                </div>
              </div>

              {/* IP Whitelisting */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    IP Whitelisting & Network Restrictions
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.ipRestrictionEnabled}
                      onChange={(e) => setSecurityForm({ ...securityForm, ipRestrictionEnabled: e.target.checked })}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Enable Restriction</span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8"
                  value={securityForm.allowedIpRanges}
                  onChange={(e) => setSecurityForm({ ...securityForm, allowedIpRanges: e.target.value })}
                  disabled={!securityForm.ipRestrictionEnabled}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary disabled:opacity-50 disabled:bg-slate-100"
                />
                <p className="text-[10px] text-slate-400">
                  Comma-separated CIDR blocks or specific IP addresses allowed to access executive administrative tools.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Security Policies</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Security Event & Audit Log */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Real-Time Security Audit Log</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Audit Stream
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {(securityAuditLogs || []).map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-700">{log.action}</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-xs font-medium">
                    {log.details}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>Actor: {log.actor}</span>
                    <span className="font-mono">IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW ROLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">Create New Custom Role</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Role Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Exam Proctor or Dean of Students"
                  value={newRoleForm.displayName}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, displayName: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Role Category
                </label>
                <select
                  value={newRoleForm.category}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                >
                  <option value="Executive">Executive Governance</option>
                  <option value="Academic">Academic Leadership</option>
                  <option value="Faculty">Faculty & Instructional</option>
                  <option value="Student Care">Student Care & Health</option>
                  <option value="Admissions">Admissions & Registrar</option>
                  <option value="Finance">Finance & Treasury</option>
                  <option value="Library & IT">Library & IT Systems</option>
                  <option value="Logistics & Safety">Logistics, Fleet & Safety</option>
                  <option value="Operations">Operations & Facilities</option>
                  <option value="Portal">Portal Stakeholder</option>
                  <option value="Custom">Custom Role</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Clone Capabilities From Existing Role (Optional)
                </label>
                <select
                  value={newRoleForm.cloneFromId}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, cloneFromId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                >
                  <option value="">Start with Empty Permissions</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      Clone from {r.displayName || r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the duties, campus scopes, and organizational purpose of this role..."
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark font-bold text-white shadow-sm"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {isEditModalOpen && editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Edit Role: {editingRole.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingRole(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditRoleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  value={editingRole.displayName || editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, displayName: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={editingRole.category}
                  onChange={(e) => setEditingRole({ ...editingRole, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                >
                  <option value="Executive">Executive Governance</option>
                  <option value="Academic">Academic Leadership</option>
                  <option value="Faculty">Faculty & Instructional</option>
                  <option value="Student Care">Student Care & Health</option>
                  <option value="Admissions">Admissions & Registrar</option>
                  <option value="Finance">Finance & Treasury</option>
                  <option value="Library & IT">Library & IT Systems</option>
                  <option value="Logistics & Safety">Logistics, Fleet & Safety</option>
                  <option value="Operations">Operations & Facilities</option>
                  <option value="Portal">Portal Stakeholder</option>
                  <option value="Custom">Custom Role</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingRole.description || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark font-bold text-white shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

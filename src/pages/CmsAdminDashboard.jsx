import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Bell, 
  Newspaper, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  Download as DownloadIcon, 
  HelpCircle, 
  Briefcase, 
  Inbox, 
  Sliders, 
  Plus, 
  CheckCircle2, 
  Eye, 
  Archive, 
  XCircle, 
  Send,
  Layers,
  Clock,
  Trash2,
  Upload,
  Mail,
  ShieldCheck,
  FileCheck,
  ArrowUp,
  ArrowDown,
  Layout
} from 'lucide-react';

export const CmsAdminDashboard = () => {
  const { addNotification, setCurrentView } = useApp();

  const [selectedModule, setSelectedModule] = useState('home_builder');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Homepage Config State
  const [homepageConfig, setHomepageConfig] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);

  const CMS_MODULES = [
    { id: 'home_builder', name: 'Homepage Builder', icon: Layout },
    { id: 'contact_messages', name: 'Contact Inbox', icon: Inbox },
    { id: 'careers', name: 'Careers & Vacancies', icon: Briefcase },
    { id: 'downloads', name: 'Downloads', icon: DownloadIcon },
    { id: 'faqs', name: 'FAQs', icon: HelpCircle },
    { id: 'gallery', name: 'Media Gallery', icon: ImageIcon },
    { id: 'news', name: 'News & Articles', icon: Newspaper },
    { id: 'announcements', name: 'Announcements', icon: Bell },
    { id: 'pages', name: 'Pages', icon: FileText },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'faculty', name: 'Faculty & Staff', icon: Users },
    { id: 'programs', name: 'Programs', icon: Award },
    { id: 'admissions', name: 'Admissions', icon: BookOpen },
    { id: 'settings', name: 'Website Settings', icon: Sliders }
  ];

  const fetchCmsData = async () => {
    if (selectedModule === 'home_builder') {
      const res = await apiClient.get('/website/admin/homepage');
      if (res.success && res.data) setHomepageConfig(res.data);
    } else if (selectedModule === 'contact_messages') {
      const res = await apiClient.get('/website/admin/contact-messages');
      if (res.success && res.data) setContactMessages(res.data);
    } else if (selectedModule === 'careers') {
      const vRes = await apiClient.get('/website/admin/careers/vacancies');
      if (vRes.success && vRes.data) setVacancies(vRes.data);

      const aRes = await apiClient.get('/website/admin/careers/applications');
      if (aRes.success && aRes.data) setJobApplications(aRes.data);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, [selectedModule, statusFilter]);

  const handleMoveSection = (index, direction) => {
    if (!homepageConfig) return;
    const newOrders = [...homepageConfig.sectionOrder];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrders.length) return;

    const temp = newOrders[index];
    newOrders[index] = newOrders[targetIdx];
    newOrders[targetIdx] = temp;

    setHomepageConfig({ ...homepageConfig, sectionOrder: newOrders });
  };

  const handleSaveHomepageConfig = async () => {
    if (!homepageConfig) return;
    const res = await apiClient.put('/website/admin/homepage', homepageConfig);
    if (res.success) {
      addNotification('Homepage configuration and section orders saved! Audit log updated.', 'success');
      fetchCmsData();
    } else {
      addNotification(res.error?.message || 'Failed to save homepage configuration', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Dynamic Homepage & CMS Control Hub
            </h1>
            <Badge variant="primary">Audit Logged</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Reorder 11 homepage sections, manage hero banners, welcome text, principal message, stats, and CTAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('website')}
            className="bg-white hover:bg-orange-50 text-slate-800 border border-slate-200 hover:border-primary/40 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-primary" />
            <span>View Live Website</span>
          </button>

          {selectedModule === 'home_builder' && (
            <button
              onClick={handleSaveHomepageConfig}
              className="bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Homepage Layout</span>
            </button>
          )}
        </div>
      </div>

      {/* 14 CMS Module Switcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {CMS_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
              <span className="font-bold text-[11px] leading-tight block">{mod.name}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE VIEW: HOMEPAGE BUILDER */}
      {selectedModule === 'home_builder' && homepageConfig && (
        <div className="space-y-6">
          {/* 1. Section Ordering Control Board */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Homepage Section Display Order</h3>
                <p className="text-slate-500 text-xs">Public homepage dynamically renders sections in this exact sequence.</p>
              </div>
              <Badge variant="primary">{homepageConfig.sectionOrder.length} Sections Configured</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {homepageConfig.sectionOrder.map((sec, idx) => (
                <div key={sec} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center text-[11px]">{idx + 1}</span>
                    <span className="font-bold text-slate-900 uppercase font-sans">{sec}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'UP')}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === homepageConfig.sectionOrder.length - 1}
                      onClick={() => handleMoveSection(idx, 'DOWN')}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Hero Banners & Welcome Message Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Welcome Message */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 text-xs">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Director Welcome Message</h3>
              <FormInput
                label="Welcome Title"
                value={homepageConfig.welcomeMessage.title}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  welcomeMessage: { ...homepageConfig.welcomeMessage, title: e.target.value }
                })}
              />
              <FormInput
                label="Welcome Subtitle"
                value={homepageConfig.welcomeMessage.subtitle}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  welcomeMessage: { ...homepageConfig.welcomeMessage, subtitle: e.target.value }
                })}
              />
              <FormInput
                label="Message Body"
                value={homepageConfig.welcomeMessage.body}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  welcomeMessage: { ...homepageConfig.welcomeMessage, body: e.target.value }
                })}
              />
            </div>

            {/* Principal Message */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 text-xs">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Principal Message Block</h3>
              <FormInput
                label="Principal Name"
                value={homepageConfig.principalMessage.name}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  principalMessage: { ...homepageConfig.principalMessage, name: e.target.value }
                })}
              />
              <FormInput
                label="Designation"
                value={homepageConfig.principalMessage.designation}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  principalMessage: { ...homepageConfig.principalMessage, designation: e.target.value }
                })}
              />
              <FormInput
                label="Featured Quote"
                value={homepageConfig.principalMessage.quote}
                onChange={(e) => setHomepageConfig({
                  ...homepageConfig,
                  principalMessage: { ...homepageConfig.principalMessage, quote: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

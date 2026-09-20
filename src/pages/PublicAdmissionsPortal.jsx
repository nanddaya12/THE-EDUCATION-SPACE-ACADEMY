import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Navbar } from '../components/layout/Navbar';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  DollarSign, 
  Send, 
  Search, 
  Copy, 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Building2,
  ArrowRight
} from 'lucide-react';

export const PublicAdmissionsPortal = () => {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Application Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    gender: 'Male',
    program: 'Full-Stack Web Development',
    guardianName: '',
    guardianPhone: '',
    fileName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [formError, setFormError] = useState(null);

  // Application Tracking State
  const [trackAppNo, setTrackAppNo] = useState('');
  const [trackVerificationKey, setTrackVerificationKey] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const res = await apiClient.post('/public/admissions/submit', formData);

    if (res.success && res.data) {
      setConfirmationData(res.data);
      addNotification(`Application #${res.data.applicationNo} submitted successfully!`, 'success');
      setActiveTab('confirmation');
    } else {
      setFormError(res.error?.message || 'Failed to submit online application');
    }
    setIsSubmitting(false);
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setTrackError(null);
    setTrackResult(null);
    setIsTrackLoading(true);

    const res = await apiClient.post('/public/admissions/track', {
      applicationNo: trackAppNo,
      verificationKey: trackVerificationKey
    });

    if (res.success && res.data) {
      setTrackResult(res.data);
    } else {
      setTrackError(res.error?.message || 'No matching application found');
    }
    setIsTrackLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Admissions Overview' },
    { id: 'programs', label: 'Programs & Tracks' },
    { id: 'eligibility', label: 'Eligibility Criteria' },
    { id: 'fees', label: 'Fee Information' },
    { id: 'apply', label: 'Online Application Form' },
    { id: 'track', label: 'Application Tracking' }
  ];

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary-dark via-primary to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl space-y-4 relative overflow-hidden">
          <div className="max-w-2xl space-y-3 z-10 relative">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Spring 2026 Academic Enrollment Open
            </span>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight">
              Online Admissions Portal
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-normal">
              Apply online for degree courses, professional certifications, and executive diplomas. Instant tracking & secure PII protection.
            </p>
          </div>
        </div>

        {/* Public Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
            <h2 className="font-display font-bold text-xl text-on-surface">5-Step Simple Admission Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Submit Application', desc: 'Fill candidate bio & guardian info online.' },
                { step: '02', title: 'Doc Verification', desc: 'Upload high school transcripts & ID proofs.' },
                { step: '03', title: 'Entrance Assessment', desc: 'Complete online cognitive aptitude test.' },
                { step: '04', title: 'Committee Review', desc: 'Faculty interview & waitlist evaluation.' },
                { step: '05', title: 'Final Enrollment', desc: 'Receive acceptance & pay initial fee challan.' }
              ].map((s) => (
                <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-xl font-extrabold text-primary font-mono">{s.step}</span>
                  <h3 className="font-bold text-sm text-slate-800">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Programs & Tracks */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Full-Stack Web Development', duration: '2 Years Degree', fee: '$499 / Term', desc: 'React, Node.js, TypeScript, PostgreSQL, and Cloud DevOps.' },
              { title: 'AI & Data Science Engineering', duration: '2 Years Degree', fee: '$699 / Term', desc: 'Python, PyTorch, Neural Networks, and Generative AI.' },
              { title: 'UX/UI Product Design System', duration: '1 Year Certification', fee: '$349 / Term', desc: 'Figma Auto-Layouts, Design Tokens, & Micro-animations.' }
            ].map((prog) => (
              <div key={prog.title} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">{prog.title}</h3>
                  <span className="text-xs font-semibold text-slate-400 block mt-0.5">{prog.duration} • {prog.fee}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{prog.desc}</p>
                <button
                  onClick={() => {
                    setFormData({ ...formData, program: prog.title });
                    setActiveTab('apply');
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-soft"
                >
                  Apply for Track
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Eligibility */}
        {activeTab === 'eligibility' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-4 text-xs text-slate-700">
            <h2 className="font-display font-bold text-xl text-on-surface">Academic Entry Criteria</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Secondary High School Diploma or equivalent GPA of 2.8 / 4.0 minimum.</li>
              <li>Proficiency in Mathematics & English language communication.</li>
              <li>Satisfactory performance on the Academy Cognitive Assessment Test.</li>
            </ul>
          </div>
        )}

        {/* Tab 4: Fee Information */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-4 text-xs">
            <h2 className="font-display font-bold text-xl text-on-surface">Tuition & Financial Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              Tuition fees cover course materials, cloud sandbox environments, library access, and diploma generation. Instalment payment plans are available upon acceptance.
            </p>
          </div>
        )}

        {/* Tab 5: Online Application Form */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl text-on-surface">Spring 2026 Online Application</h2>
              <p className="text-slate-400 text-xs">Submit candidate and guardian info to receive an Application Number.</p>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <FormInput
                label="Candidate Full Name"
                required
                placeholder="e.g. Julian Sterling"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Email Address"
                  type="email"
                  required
                  placeholder="candidate@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <FormInput
                  label="Phone Number"
                  required
                  placeholder="+1-555-8811"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
                <FormSelect
                  label="Program Choice"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  options={[
                    { value: 'Full-Stack Web Development', label: 'Full-Stack Web Dev' },
                    { value: 'AI & Data Science Engineering', label: 'AI & Data Science' },
                    { value: 'UX/UI Product Design', label: 'UX/UI Product Design' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <FormInput
                  label="Guardian Full Name"
                  placeholder="e.g. Clara Sterling"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
                <FormInput
                  label="Guardian Phone"
                  placeholder="+1-555-9988"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Upload Transcript / ID PDF</label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-600 block">Click to upload document (PDF, PNG)</span>
                  <span className="text-[10px] text-slate-400 block">Max file size 10MB</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application Form'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Application Confirmation */}
        {activeTab === 'confirmation' && confirmationData && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-display font-extrabold text-2xl text-on-surface">Application Submitted!</h2>
              <p className="text-slate-500 text-xs mt-1">Your online application has been received by our Admissions Board.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Your Application Code</span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-extrabold text-xl text-primary">{confirmationData.applicationNo}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(confirmationData.applicationNo);
                    addNotification('Copied Application Number to clipboard!', 'info');
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setTrackAppNo(confirmationData.applicationNo);
                setActiveTab('track');
              }}
              className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
            >
              Track Status Now
            </button>
          </div>
        )}

        {/* Tab 7: Application Tracking */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl text-on-surface">Application Status Tracker</h2>
              <p className="text-slate-400 text-xs">Enter your Application Number and verification email/phone.</p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <FormInput
                label="Application Number"
                required
                placeholder="APP-2026-XXXX"
                value={trackAppNo}
                onChange={(e) => setTrackAppNo(e.target.value)}
              />

              <FormInput
                label="Verification Email or Phone"
                required
                placeholder="candidate@gmail.com"
                value={trackVerificationKey}
                onChange={(e) => setTrackVerificationKey(e.target.value)}
              />

              <button
                type="submit"
                disabled={isTrackLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{isTrackLoading ? 'Searching...' : 'Lookup Application Status'}</span>
              </button>
            </form>

            {trackError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackResult && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-mono font-bold text-slate-800 block text-sm">{trackResult.applicationNo}</span>
                    <span className="text-slate-500 font-medium">Candidate: {trackResult.maskedApplicantName}</span>
                  </div>
                  <Badge variant="primary">{trackResult.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Document Verification:</span>
                    <span className="font-bold text-slate-800">{trackResult.documentVerified ? '✓ Verified' : 'Pending Review'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Entrance Score:</span>
                    <span className="font-bold text-slate-800">{trackResult.testScore !== null ? `${trackResult.testScore} / 100` : 'Awaiting Test'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

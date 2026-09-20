import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  FileText, 
  Award, 
  Users, 
  ShieldCheck, 
  Download, 
  Plus, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Lock,
  Building
} from 'lucide-react';

export const DocumentCertificatesCenter = () => {
  const { addNotification } = useApp();

  const [activeTab, setActiveTab] = useState('certificate_system');
  const [loading, setLoading] = useState(false);

  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [studentDocs, setStudentDocs] = useState([]);
  const [staffDocs, setStaffDocs] = useState([]);

  // Modal states
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newCert, setNewCert] = useState({
    templateId: 'tpl-merit',
    recipientId: 'st-1001',
    recipientName: 'Zainab Ahmed',
    recipientRole: 'STUDENT',
    title: 'First Place - Annual Physics Olympiad 2026',
    issuedDate: new Date().toISOString().split('T')[0]
  });

  const [selectedPrintCert, setSelectedPrintCert] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const certRes = await apiClient.get('/documents/certificates');
    if (certRes.success) setCertificates(certRes.data);

    const tplRes = await apiClient.get('/documents/certificates/templates');
    if (tplRes.success) setTemplates(tplRes.data);

    const stRes = await apiClient.get('/documents/student/st-1001');
    if (stRes.success) setStudentDocs(stRes.data);

    const sfRes = await apiClient.get('/documents/staff/teacher-101');
    if (sfRes.success) setStaffDocs(sfRes.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueCertificate = async () => {
    if (!newCert.recipientName || !newCert.title) return;
    const res = await apiClient.post('/documents/certificates/issue', newCert);
    if (res.success) {
      addNotification(`Certificate issued with unique Serial #${res.data.serialNumber}!`, 'success');
      setShowIssueModal(false);
      fetchData();
    } else {
      addNotification(res.error?.message || 'Failed to issue certificate', 'error');
    }
  };

  const handleRevokeCertificate = async (serialNumber) => {
    const reason = prompt('Enter reason for revoking this certificate:');
    if (!reason) return;

    const res = await apiClient.put(`/documents/certificates/${serialNumber}/revoke`, { reason });
    if (res.success) {
      addNotification(`Certificate ${serialNumber} has been revoked.`, 'warning');
      fetchData();
    }
  };

  const handleTestVerifyPublic = async (serialNumber) => {
    const res = await apiClient.get(`/public/certificates/verify/${serialNumber}`);
    if (res.success) setVerifyResult(res.data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Document Management & Certificates Hub</Badge>
            <span className="text-xs text-slate-400 font-mono">QR Verification & Authorization</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white">
            Document Repository & Certificate System
          </h1>
          <p className="text-slate-300 text-xs">
            Manage student & staff confidential documents, issue institutional certificates with auto serial numbers, and verify authenticity via QR code.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'certificate_system', name: 'Institutional Certificate System', icon: Award },
          { id: 'student_docs', name: 'Student Document Repository', icon: FileText },
          { id: 'staff_docs', name: 'Staff Document Repository', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CERTIFICATE SYSTEM */}
      {activeTab === 'certificate_system' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">Issued Institutional Certificates Registry</h3>
              <span className="text-slate-500 font-mono">Total Certificates: {certificates.length}</span>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.serialNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600 text-sm">{cert.serialNumber}</span>
                      <Badge variant={cert.status === 'ISSUED' ? 'success' : 'error'}>{cert.status}</Badge>
                      <Badge variant="secondary">{cert.recipientRole}</Badge>
                    </div>
                    <span className="font-bold text-slate-900 text-sm block">{cert.title}</span>
                    <span className="text-slate-500 font-mono text-[11px] block">Recipient: {cert.recipientName} ({cert.recipientId}) | Issued: {cert.issuedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPrintCert(cert)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                    <button
                      onClick={() => handleTestVerifyPublic(cert.serialNumber)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify QR</span>
                    </button>
                    {cert.status === 'ISSUED' && (
                      <button
                        onClick={() => handleRevokeCertificate(cert.serialNumber)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Verification Preview Panel */}
          {verifyResult && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Public QR Code Scanner Result</span>
                </div>
                <Badge variant={verifyResult.isValid ? 'success' : 'error'}>{verifyResult.verificationStatus}</Badge>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl overflow-x-auto text-[11px]">
                {JSON.stringify(verifyResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT DOCUMENTS */}
      {activeTab === 'student_docs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-lg text-slate-900">Student Confidential Documents</h3>
            <Badge variant="warning"><Lock className="w-3.5 h-3.5 inline mr-1" /> Authorization Guarded</Badge>
          </div>
          <div className="space-y-3">
            {studentDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{doc.title}</span>
                  <span className="text-slate-500 font-mono text-[11px] block">Category: {doc.category} | Security: {doc.securityLevel}</span>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Private File</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Issue New Institutional Certificate</h3>
            <div className="space-y-3 text-xs">
              <FormSelect
                label="Certificate Template"
                value={newCert.templateId}
                onChange={(e) => setNewCert({ ...newCert, templateId: e.target.value })}
                options={templates.map(t => ({ value: t.id, label: t.title }))}
              />
              <FormInput
                label="Recipient Full Name"
                value={newCert.recipientName}
                onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
              />
              <FormInput
                label="Certificate Title / Citation"
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setShowIssueModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100">Cancel</button>
              <button onClick={handleIssueCertificate} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft">Issue & Generate Serial</button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE CERTIFICATE MODAL */}
      {selectedPrintCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 border-8 border-amber-600/30 text-center relative">
            <div className="border-4 border-amber-700/20 p-6 space-y-4">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
                <span>The Education Space Academy</span>
                <span>Serial: {selectedPrintCert.serialNumber}</span>
              </div>
              <h2 className="font-display font-black text-2xl text-amber-900 tracking-wide uppercase border-b border-amber-200 pb-2">
                {selectedPrintCert.templateTitle}
              </h2>
              <p className="text-slate-600 italic text-xs">This certificate is proudly presented to</p>
              <h1 className="font-display font-bold text-3xl text-slate-900 border-b-2 border-amber-500 inline-block px-8 py-1">
                {selectedPrintCert.recipientName}
              </h1>
              <p className="text-slate-700 font-medium text-xs leading-relaxed max-w-lg mx-auto">
                {selectedPrintCert.title}
              </p>

              <div className="flex items-center justify-between pt-6 text-xs border-t border-slate-200">
                <div className="text-left font-mono">
                  <span className="text-slate-400 block text-[10px]">Issued Date</span>
                  <span className="font-bold text-slate-800">{selectedPrintCert.issuedDate}</span>
                </div>
                <div className="p-2 bg-slate-100 rounded-xl border border-slate-300 flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <div className="text-left font-mono text-[9px] text-slate-600">
                    <span className="font-bold block text-slate-900">QR Verified</span>
                    <span>{selectedPrintCert.serialNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedPrintCert(null)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-xs">Close</button>
              <button onClick={() => window.print()} className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-soft">Print Official PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

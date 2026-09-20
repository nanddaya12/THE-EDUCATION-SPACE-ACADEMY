import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Building2, 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Printer, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  XCircle, 
  FileCheck,
  Calculator,
  Download,
  Sliders,
  CheckSquare
} from 'lucide-react';

export const HRManagement = () => {
  const { addNotification, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('staff'); // 'staff', 'leaves', 'salaries', 'payroll'
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');

  // Staff Roster State
  const [staffList, setStaffList] = useState([
    {
      id: 'staff-101',
      staffCode: 'EMP-1001',
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@educationspace.edu',
      phone: '+92 300 9876543',
      departmentName: 'Mathematics & Computer Science',
      designationName: 'Senior Lecturer',
      joiningDate: '2022-09-01',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      cnic: '42101-1234567-1'
    },
    {
      id: 'staff-102',
      staffCode: 'EMP-1002',
      firstName: 'Marcus',
      lastName: 'Brody',
      email: 'marcus.brody@educationspace.edu',
      phone: '+92 301 5554433',
      departmentName: 'Administration & Finance',
      designationName: 'Campus Accountant',
      joiningDate: '2023-01-15',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      cnic: '42101-7654321-2'
    }
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'leave-1',
      staffId: 'staff-101',
      staffName: 'Eleanor Vance',
      leaveType: 'CASUAL',
      startDate: '2026-09-10',
      endDate: '2026-09-12',
      days: 3,
      reason: 'Family event attendance',
      status: 'PENDING'
    }
  ]);

  // Payroll State & 5-Stage Stepper
  const [payrollRun, setPayrollRun] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [payslipData, setPayslipData] = useState(null);

  // Modals & Drawers
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: 'dept-1',
    designationId: 'desig-1',
    joiningDate: '2026-09-01',
    employmentType: 'FULL_TIME',
    cnic: ''
  });

  const [leaveForm, setLeaveForm] = useState({
    staffId: 'staff-101',
    leaveType: 'CASUAL',
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    days: 3,
    reason: 'Medical checkup'
  });

  const [salaryForm, setSalaryForm] = useState({
    staffId: 'staff-101',
    basicPay: 90000,
    housingAllowance: 30000,
    medicalAllowance: 10000,
    transportAllowance: 10000,
    specialAllowance: 5000,
    bonuses: 5000,
    penalties: 0,
    unpaidLeaveDeduction: 0,
    incomeTax: 5000,
    providentFund: 4000
  });

  const fetchHRData = async () => {
    const sRes = await apiClient.get('/hr/staff');
    if (sRes.success && sRes.data) setStaffList(sRes.data);

    const lRes = await apiClient.get('/hr/leaves');
    if (lRes.success && lRes.data) setLeaveRequests(lRes.data);

    const hRes = await apiClient.get('/hr/payroll/history');
    if (hRes.success && hRes.data) setPayrollHistory(hRes.data);
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/hr/staff', staffForm);
    if (res.success) {
      addNotification(`Staff profile for ${staffForm.firstName} ${staffForm.lastName} created!`, 'success');
      setIsAddStaffOpen(false);
      setStaffForm({ firstName: '', lastName: '', email: '', phone: '', departmentId: 'dept-1', designationId: 'desig-1', joiningDate: '2026-09-01', employmentType: 'FULL_TIME', cnic: '' });
      fetchHRData();
    } else {
      addNotification(res.error?.message || 'Failed to add staff', 'error');
    }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/hr/leaves', leaveForm);
    if (res.success) {
      addNotification('Leave request submitted successfully!', 'success');
      setIsLeaveModalOpen(false);
      fetchHRData();
    } else {
      addNotification(res.error?.message || 'Failed to submit leave', 'error');
    }
  };

  const handleReviewLeave = async (leaveId, status) => {
    const res = await apiClient.patch(`/hr/leaves/${leaveId}/review`, { status });
    if (res.success) {
      addNotification(`Leave request ${status.toLowerCase()} successfully!`, 'success');
      fetchHRData();
    } else {
      addNotification(res.error?.message || 'Failed to review leave', 'error');
    }
  };

  const handleSetSalaryStructureSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/hr/salary-structures', salaryForm);
    if (res.success) {
      addNotification('Salary structure, allowances, bonuses & penalties saved!', 'success');
      setIsSalaryModalOpen(false);
    } else {
      addNotification(res.error?.message || 'Failed to save salary structure', 'error');
    }
  };

  const handleRunPayroll = async () => {
    const res = await apiClient.post('/hr/payroll/process', { month: 'October', year: 2026 });
    if (res.success) {
      addNotification('Monthly Payroll cycle initiated in DRAFT stage!', 'success');
      setPayrollRun(res.data);
      fetchHRData();
    } else {
      addNotification(res.error?.message || 'Payroll processing failed', 'error');
    }
  };

  const handleAdvanceWorkflow = async (targetStage) => {
    if (!payrollRun) return;
    const res = await apiClient.patch(`/hr/payroll/runs/${payrollRun.id}/workflow`, { stage: targetStage });
    if (res.success) {
      addNotification(`Payroll stage advanced to ${targetStage}!`, 'success');
      setPayrollRun(res.data);
      fetchHRData();
    } else {
      addNotification(res.error?.message || 'Workflow transition failed', 'error');
    }
  };

  const handleOpenPayslip = async (payslipId) => {
    const res = await apiClient.get(`/hr/payroll/payslips/${payslipId}`);
    if (res.success) {
      setPayslipData(res.data);
      setIsPayslipModalOpen(true);
    } else {
      addNotification(res.error?.message || 'Failed to fetch payslip', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const STAGES = ['DRAFT', 'CALCULATED', 'REVIEW', 'APPROVED', 'PAID'];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Enterprise HR & 5-Stage Payroll Engine
            </h1>
            <Badge variant="primary">Restricted HR Access</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            5-Stage Lifecycle (DRAFT → CALCULATED → REVIEW → APPROVED → PAID), allowances, bonuses, penalties, and payslips.
          </p>
        </div>

        {(userRole === 'SUPER_ADMIN' || userRole === 'Admin') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSalaryModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>Configure Salaries</span>
            </button>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Staff</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'staff' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Profiles & Employment</span>
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'leaves' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Staff Attendance & Leave Approvals</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'payroll' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>5-Stage Payroll Engine & History</span>
        </button>
      </div>

      {/* TAB 1: STAFF PROFILES */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">Institutional Staff Roster</h3>
              <span className="text-xs text-slate-400 font-mono">Total Active Staff: {staffList.length}</span>
            </div>

            <div className="space-y-3">
              {staffList.map((st) => (
                <div key={st.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{st.firstName} {st.lastName}</span>
                      <Badge variant="primary">{st.designationName}</Badge>
                      <Badge variant="neutral">{st.employmentType}</Badge>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      {st.staffCode} • {st.departmentName} • {st.email} • {st.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      CNIC: {st.cnic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5-STAGE PAYROLL ENGINE */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Active Payroll Run Stepper */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">5-Stage Payroll Workflow Lifecycle</h3>
                <p className="text-slate-500 text-xs mt-0.5">Sequential lifecycle: DRAFT → CALCULATED → REVIEW → APPROVED → PAID</p>
              </div>

              {!payrollRun && (
                <button
                  onClick={handleRunPayroll}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Initiate New Payroll Run</span>
                </button>
              )}
            </div>

            {payrollRun && (
              <div className="space-y-6 border-t border-slate-100 pt-4">
                {/* 5-Stage Stepper Widget */}
                <div className="grid grid-cols-5 gap-2">
                  {STAGES.map((stg, idx) => {
                    const activeIdx = STAGES.indexOf(payrollRun.stage);
                    const isCompleted = idx <= activeIdx;
                    return (
                      <div key={stg} className={`p-3 rounded-2xl border text-center transition-all ${
                        isCompleted ? 'bg-primary text-white border-primary shadow-soft' : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        <span className="text-[10px] font-bold block opacity-70">Stage {idx + 1}</span>
                        <span className="font-bold text-xs uppercase block">{stg}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Workflow Transition Buttons */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-mono text-xs">
                    <span className="text-slate-400 block">Current Workflow Stage:</span>
                    <span className="font-bold text-slate-900 text-sm">{payrollRun.stage}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {payrollRun.stage === 'DRAFT' && (
                      <button onClick={() => handleAdvanceWorkflow('CALCULATED')} className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Advance to CALCULATED →
                      </button>
                    )}
                    {payrollRun.stage === 'CALCULATED' && (
                      <button onClick={() => handleAdvanceWorkflow('REVIEW')} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Advance to REVIEW →
                      </button>
                    )}
                    {payrollRun.stage === 'REVIEW' && (
                      <button onClick={() => handleAdvanceWorkflow('APPROVED')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Approve Payroll →
                      </button>
                    )}
                    {payrollRun.stage === 'APPROVED' && (
                      <button onClick={() => handleAdvanceWorkflow('PAID')} className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Disburse Net Salaries (PAID) ✓
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {payrollRun.payslips.map((ps) => (
                    <div key={ps.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{ps.staffName} ({ps.staffCode})</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          Basic: Rs. {ps.basicPay.toLocaleString()} • Bonus: Rs. {ps.bonuses.toLocaleString()} • Penalty: Rs. {ps.penalties.toLocaleString()} • Deductions: Rs. {ps.totalDeductions.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-emerald-700 font-mono text-base">Net: Rs. {ps.netSalary.toLocaleString()}</span>
                        <button
                          onClick={() => handleOpenPayslip(ps.id)}
                          className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Payslip</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Salary Structure Modal (Bonuses & Penalties) */}
      <Modal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        title="Configure Salary Structure, Bonuses & Penalties"
      >
        <form onSubmit={handleSetSalaryStructureSubmit} className="space-y-4 text-xs">
          <FormSelect
            label="Staff Member"
            value={salaryForm.staffId}
            onChange={(e) => setSalaryForm({ ...salaryForm, staffId: e.target.value })}
            options={staffList.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName} (${s.staffCode})` }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="number"
              label="Basic Salary (Rs.)"
              required
              value={salaryForm.basicPay}
              onChange={(e) => setSalaryForm({ ...salaryForm, basicPay: Number(e.target.value) })}
            />
            <FormInput
              type="number"
              label="Housing Allowance (Rs.)"
              value={salaryForm.housingAllowance}
              onChange={(e) => setSalaryForm({ ...salaryForm, housingAllowance: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="number"
              label="Medical Allowance (Rs.)"
              value={salaryForm.medicalAllowance}
              onChange={(e) => setSalaryForm({ ...salaryForm, medicalAllowance: Number(e.target.value) })}
            />
            <FormInput
              type="number"
              label="Performance Bonus (Rs.)"
              value={salaryForm.bonuses}
              onChange={(e) => setSalaryForm({ ...salaryForm, bonuses: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="number"
              label="Disciplinary Penalties (Rs.)"
              value={salaryForm.penalties}
              onChange={(e) => setSalaryForm({ ...salaryForm, penalties: Number(e.target.value) })}
            />
            <FormInput
              type="number"
              label="Income Tax Deduction (Rs.)"
              value={salaryForm.incomeTax}
              onChange={(e) => setSalaryForm({ ...salaryForm, incomeTax: Number(e.target.value) })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft"
          >
            Save Financial Structure
          </button>
        </form>
      </Modal>

      {/* Printable Payslip Modal */}
      <Modal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        title="Official Staff Payslip"
      >
        {payslipData && (
          <div className="space-y-6 p-4 bg-white text-slate-900 print:p-0">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">{payslipData.institutionName}</h2>
                <p className="text-xs font-bold text-slate-500">{payslipData.campusName} • Confidential Salary Payslip</p>
              </div>
              <Badge variant="success">PAID</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-mono border border-slate-200">
              <div>
                <span className="text-slate-400 block">Staff Name:</span>
                <span className="font-bold text-slate-900">{payslipData.staffName} ({payslipData.staffCode})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department & Title:</span>
                <span className="font-bold text-slate-900">{payslipData.departmentName} - {payslipData.designationName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="font-bold text-emerald-700 block uppercase border-b pb-1">Earnings & Allowances</span>
                <div className="flex justify-between"><span>Basic Salary:</span><span className="font-bold">Rs. {payslipData.basicPay.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Housing Allowance:</span><span>Rs. {payslipData.allowances.housing.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Performance Bonus:</span><span className="text-emerald-700 font-bold">Rs. {(payslipData.bonuses || 0).toLocaleString()}</span></div>
                <div className="flex justify-between border-t pt-1 font-bold"><span>Gross Earnings:</span><span className="text-emerald-700">Rs. {payslipData.grossSalary.toLocaleString()}</span></div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="font-bold text-rose-700 block uppercase border-b pb-1">Deductions</span>
                <div className="flex justify-between"><span>Income Tax:</span><span>Rs. {payslipData.deductions.tax.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Provident Fund:</span><span>Rs. {payslipData.deductions.providentFund.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Penalties:</span><span className="text-rose-700 font-bold">Rs. {(payslipData.penalties || 0).toLocaleString()}</span></div>
                <div className="flex justify-between border-t pt-1 font-bold"><span>Total Deductions:</span><span className="text-rose-700">Rs. {payslipData.totalDeductions.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between font-mono">
              <span className="text-xs uppercase">Net Salary Disbursed</span>
              <span className="text-xl font-bold text-emerald-400">Rs. {payslipData.netSalary.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePrint}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Salary Payslip PDF</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

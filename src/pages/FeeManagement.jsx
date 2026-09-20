import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { FormInput, FormSelect } from '../components/ui/FormControls';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Printer, 
  Zap, 
  Calendar, 
  Award, 
  Percent, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  Receipt,
  ArrowRight,
  PieChart,
  RefreshCw,
  Landmark,
  Smartphone,
  CheckSquare
} from 'lucide-react';

export const FeeManagement = () => {
  const { addNotification, userRole } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'generator', 'invoices', 'collection', 'reconciliation'
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('sec-a');

  // Summary Metrics State
  const [metrics, setMetrics] = useState({
    totalAmount: 30000,
    paidAmount: 12000,
    remainingAmount: 12500,
    overdueAmount: 14500,
    discountAmount: 3000,
    scholarshipAmount: 3000
  });

  // Invoices State
  const [invoices, setInvoices] = useState([
    {
      id: 'inv-1001',
      invoiceNumber: 'INV-2026-09-001',
      studentId: 'st-1',
      studentName: 'Julian Vance',
      rollNo: 'R-101',
      classGrade: 'Grade 10',
      section: 'Section A',
      billingPeriod: 'October 2026',
      frequency: 'MONTHLY',
      dueDate: '2026-10-10',
      totalAmount: 15000,
      discountAmount: 3000,
      scholarshipAmount: 0,
      arrearsAmount: 0,
      lateFeeAmount: 0,
      netPayable: 12000,
      paidAmount: 12000,
      status: 'PAID',
      challanNo: 'CHAL-2026-001'
    },
    {
      id: 'inv-1002',
      invoiceNumber: 'INV-2026-09-002',
      studentId: 'st-2',
      studentName: 'Clara Sterling',
      rollNo: 'R-102',
      classGrade: 'Grade 10',
      section: 'Section A',
      billingPeriod: 'October 2026',
      frequency: 'MONTHLY',
      dueDate: '2026-10-10',
      totalAmount: 15000,
      discountAmount: 0,
      scholarshipAmount: 3000,
      arrearsAmount: 2000,
      lateFeeAmount: 500,
      netPayable: 14500,
      paidAmount: 0,
      status: 'OVERDUE',
      challanNo: 'CHAL-2026-002'
    }
  ]);

  // Daily Collection Report
  const [dailyCollection, setDailyCollection] = useState({
    totalCollected: 17000,
    transactionCount: 2,
    methodBreakdown: {
      CASH: 5000,
      JAZZCASH: 7000,
      RAAST: 5000,
      EASYPAISA: 0,
      BANK_TRANSFER: 0,
      CHEQUE: 0,
      CARD: 0,
      ONLINE_GATEWAY: 0
    }
  });

  // Modals & Drawers
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isCollectPaymentOpen, setIsCollectPaymentOpen] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    amountPaid: 0,
    paymentMethod: 'CASH',
    referenceNo: '',
    idempotencyKey: ''
  });

  const [generatorForm, setGeneratorForm] = useState({
    billingPeriod: 'November 2026',
    frequency: 'MONTHLY',
    dueDate: '2026-11-10',
    includeArrears: true,
    applyScholarships: true
  });

  const fetchMetricsAndInvoices = async () => {
    const mRes = await apiClient.get('/fees/metrics');
    if (mRes.success && mRes.data) setMetrics(mRes.data);

    const iRes = await apiClient.get('/fees/invoices');
    if (iRes.success && iRes.data) setInvoices(iRes.data);

    const dRes = await apiClient.get('/fees/reports/daily-collection');
    if (dRes.success && dRes.data) setDailyCollection(dRes.data);
  };

  useEffect(() => {
    fetchMetricsAndInvoices();
  }, []);

  const handleGenerateInvoicesSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post('/fees/generate-invoices', {
      classId: selectedClass,
      sectionId: selectedSection,
      billingPeriod: generatorForm.billingPeriod,
      frequency: generatorForm.frequency,
      dueDate: generatorForm.dueDate,
      includeArrears: generatorForm.includeArrears,
      applyScholarships: generatorForm.applyScholarships
    });

    if (res.success) {
      addNotification(`Successfully generated ${res.data.count} student invoices for ${generatorForm.billingPeriod}!`, 'success');
      fetchMetricsAndInvoices();
      setActiveTab('invoices');
    } else {
      addNotification(res.error?.message || 'Failed to generate invoices', 'error');
    }
  };

  const handleCollectPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const key = paymentForm.idempotencyKey || `idem-${Date.now()}-${Math.random()}`;

    const res = await apiClient.post(
      '/fees/collect',
      {
        invoiceId: selectedInvoice.id,
        amountPaid: Number(paymentForm.amountPaid),
        paymentMethod: paymentForm.paymentMethod,
        referenceNo: paymentForm.referenceNo,
        idempotencyKey: key
      },
      {
        headers: { 'Idempotency-Key': key }
      }
    );

    if (res.success) {
      if (res.data.idempotencyReplay) {
        addNotification('Idempotent Replay: Payment request was previously processed.', 'warning');
      } else {
        addNotification(`Payment of Rs. ${paymentForm.amountPaid} collected via ${paymentForm.paymentMethod}!`, 'success');
      }

      setIsCollectPaymentOpen(false);
      setSelectedInvoice(null);
      fetchMetricsAndInvoices();

      // Show receipt modal
      if (res.data.transaction?.id) {
        handleOpenReceipt(res.data.transaction.id);
      }
    } else {
      addNotification(res.error?.message || 'Payment collection failed', 'error');
    }
  };

  const handleOpenChallan = async (invoiceId) => {
    const res = await apiClient.get(`/fees/invoices/${invoiceId}/challan`);
    if (res.success) {
      setChallanData(res.data);
      setIsChallanModalOpen(true);
    } else {
      addNotification(res.error?.message || 'Failed to load challan', 'error');
    }
  };

  const handleOpenReceipt = async (transactionId) => {
    const res = await apiClient.get(`/fees/payments/${transactionId}/receipt`);
    if (res.success) {
      setReceiptData(res.data);
      setIsReceiptModalOpen(true);
    } else {
      addNotification(res.error?.message || 'Failed to load receipt', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">
              Omnichannel Payment & Reconciliation Engine
            </h1>
            <Badge variant="primary">Idempotent Engine</Badge>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            8 Payment Methods (Cash, Bank Wire, Cheque, Card, JazzCash, Easypaisa, RAAST, Gateway), Idempotency guards, and Bank Reconciliation.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('generator')}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>Fee Generation Workflow</span>
        </button>
      </div>

      {/* Financial Metrics Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Generated</span>
          <span className="font-display font-bold text-lg text-slate-900 mt-1">Rs. {metrics.totalAmount.toLocaleString()}</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Total Paid</span>
          <span className="font-display font-bold text-lg text-emerald-800 mt-1">Rs. {metrics.paidAmount.toLocaleString()}</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Remaining Payable</span>
          <span className="font-display font-bold text-lg text-amber-800 mt-1">Rs. {metrics.remainingAmount.toLocaleString()}</span>
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-700 uppercase">Overdue Amount</span>
          <span className="font-display font-bold text-lg text-rose-800 mt-1">Rs. {metrics.overdueAmount.toLocaleString()}</span>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Discounts</span>
          <span className="font-display font-bold text-lg text-blue-800 mt-1">Rs. {metrics.discountAmount.toLocaleString()}</span>
        </div>

        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Scholarships</span>
          <span className="font-display font-bold text-lg text-purple-800 mt-1">Rs. {metrics.scholarshipAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Financial Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'generator' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Fee Generation</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'invoices' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices & Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 ${
            activeTab === 'reconciliation' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Daily Collection & Reconciliation</span>
        </button>
      </div>

      {/* TAB 1: FINANCIAL OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">Recent Financial Transactions Log</h3>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{inv.studentName}</span>
                      <Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'OVERDUE' ? 'error' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{inv.invoiceNumber} • {inv.billingPeriod}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <span className="block font-bold text-slate-900 text-sm">Rs. {inv.netPayable.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-400">Paid: Rs. {inv.paidAmount.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleOpenChallan(inv.id)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Bank Challan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DAILY COLLECTION & RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Daily Cashier Collection & Method Summary</h3>
              <p className="text-slate-500 text-xs mt-0.5">Real-time breakdown of payment collections across Cash, Mobile Wallets, and Banking channels.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 font-mono">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">JazzCash Wallet</span>
                <span className="font-bold text-emerald-900 text-base">Rs. {dailyCollection.methodBreakdown.JAZZCASH.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 font-mono">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">RAAST Instant</span>
                <span className="font-bold text-emerald-900 text-base">Rs. {dailyCollection.methodBreakdown.RAAST.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Cash Counter</span>
                <span className="font-bold text-slate-900 text-base">Rs. {dailyCollection.methodBreakdown.CASH.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 font-mono">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">Online Gateway</span>
                <span className="font-bold text-blue-900 text-base">Rs. {dailyCollection.methodBreakdown.ONLINE_GATEWAY.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Fee Drawer (Supports 8 Payment Methods & Idempotency) */}
      <Drawer
        isOpen={isCollectPaymentOpen}
        onClose={() => setIsCollectPaymentOpen(false)}
        title="Collect Fee Payment (Omnichannel)"
      >
        {selectedInvoice && (
          <form onSubmit={handleCollectPaymentSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl space-y-1 font-mono border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Invoice Number:</span>
              <span className="font-bold text-slate-900">{selectedInvoice.invoiceNumber}</span>
              <span className="text-slate-400 block text-[11px] pt-2">Student Name:</span>
              <span className="font-bold text-slate-900">{selectedInvoice.studentName} ({selectedInvoice.rollNo})</span>
              <span className="text-slate-400 block text-[11px] pt-2">Net Balance Payable:</span>
              <span className="font-bold text-primary text-base">Rs. {(selectedInvoice.netPayable - selectedInvoice.paidAmount).toLocaleString()}</span>
            </div>

            <FormInput
              type="number"
              label="Amount to Collect (Rs.)"
              required
              value={paymentForm.amountPaid}
              onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
            />

            <FormSelect
              label="Payment Method Provider (8 Supported)"
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              options={[
                { value: 'CASH', label: 'Cash Counter' },
                { value: 'JAZZCASH', label: 'JazzCash Mobile Wallet' },
                { value: 'EASYPAISA', label: 'Easypaisa Mobile Wallet' },
                { value: 'RAAST', label: 'RAAST Instant Payment' },
                { value: 'ONLINE_GATEWAY', label: 'Online Gateway (3DS Card)' },
                { value: 'CARD', label: 'POS Card Terminal' },
                { value: 'BANK_TRANSFER', label: 'Bank Direct Wire' },
                { value: 'CHEQUE', label: 'Bank Cheque Clearance' }
              ]}
            />

            <FormInput
              label="Transaction Reference / Wallet Txn ID"
              placeholder="e.g. JC-99881122 or RAAST-771122"
              value={paymentForm.referenceNo}
              onChange={(e) => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
            />

            <FormInput
              label="Idempotency Key (Prevents Duplicate Payments)"
              placeholder="Auto-generated if left blank"
              value={paymentForm.idempotencyKey}
              onChange={(e) => setPaymentForm({ ...paymentForm, idempotencyKey: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Confirm Idempotent Payment Collection</span>
            </button>
          </form>
        )}
      </Drawer>

      {/* Printable Official Payment Receipt Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Official Financial Payment Receipt"
      >
        {receiptData && (
          <div className="space-y-6 p-4 bg-white text-slate-900 print:p-0">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">{receiptData.institutionName}</h2>
                <p className="text-xs font-bold text-slate-500">{receiptData.campusName} • Financial Payment Receipt</p>
              </div>
              <Badge variant="success">PAID RECEIPT</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-mono border border-slate-200">
              <div>
                <span className="text-slate-400 block">Receipt Number:</span>
                <span className="font-bold text-slate-900">{receiptData.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Student:</span>
                <span className="font-bold text-slate-900">{receiptData.student.name} ({receiptData.student.rollNo})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Method:</span>
                <span className="font-bold text-primary">{receiptData.payment.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gateway Reference:</span>
                <span className="font-bold text-slate-900">{receiptData.payment.referenceNo}</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between font-mono">
              <span className="text-xs uppercase">Amount Collected</span>
              <span className="text-xl font-bold text-emerald-400">Rs. {receiptData.payment.amountPaid.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePrint}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt PDF</span>
            </button>
          </div>
        )}
      </Modal>

      {/* Printable Bank Challan Modal */}
      <Modal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        title="Printable Bank Fee Challan"
      >
        {challanData && (
          <div className="space-y-6 p-4 bg-white text-slate-900 print:p-0">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900 uppercase tracking-wide">{challanData.institutionName}</h2>
                <p className="text-xs font-bold text-slate-500">{challanData.bankName} • Account: {challanData.accountNumber}</p>
              </div>
              <Badge variant="primary">{challanData.challanNo}</Badge>
            </div>

            <button
              onClick={handlePrint}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print 3-Copy Bank Challan</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

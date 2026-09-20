import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export type ReportDomain =
  | 'students'
  | 'admissions'
  | 'attendance'
  | 'fees'
  | 'payments'
  | 'defaulters'
  | 'expenses'
  | 'exams'
  | 'results'
  | 'staff'
  | 'payroll'
  | 'website_content';

export interface ReportFilterParams {
  startDate?: string;
  endDate?: string;
  campusId?: string;
  sessionId?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class MasterReportsRepository {
  public async getReportData(domain: ReportDomain, filters: ReportFilterParams) {
    switch (domain) {
      case 'students':
        return this.getStudentsReport(filters);
      case 'admissions':
        return this.getAdmissionsReport(filters);
      case 'attendance':
        return this.getAttendanceReport(filters);
      case 'fees':
        return this.getFeesReport(filters);
      case 'payments':
        return this.getPaymentsReport(filters);
      case 'defaulters':
        return this.getDefaultersReport(filters);
      case 'expenses':
        return this.getExpensesReport(filters);
      case 'exams':
        return this.getExamsReport(filters);
      case 'results':
        return this.getResultsReport(filters);
      case 'staff':
        return this.getStaffReport(filters);
      case 'payroll':
        return this.getPayrollReport(filters);
      case 'website_content':
        return this.getWebsiteContentReport(filters);
      default:
        throw new BadRequestError(`Unsupported report domain '${domain}'`);
    }
  }

  // 1. Students Report
  private async getStudentsReport(filters: ReportFilterParams) {
    const rows = [
      { studentCode: 'STD-1001', name: 'Zainab Ahmed', gender: 'Female', class: 'Grade 10', section: 'Sec-A', campus: 'Main Campus', status: 'ACTIVE', admissionDate: '2025-08-01' },
      { studentCode: 'STD-1002', name: 'Hamza Malik', gender: 'Male', class: 'Grade 10', section: 'Sec-A', campus: 'Main Campus', status: 'ACTIVE', admissionDate: '2025-08-05' },
      { studentCode: 'STD-1003', name: 'Ayesha Khan', gender: 'Female', class: 'Grade 11', section: 'Sec-B', campus: 'South Campus', status: 'ACTIVE', admissionDate: '2025-08-10' }
    ];

    let filtered = rows;
    if (filters.campusId && filters.campusId !== 'ALL') filtered = filtered.filter(r => r.campus.toLowerCase().includes(filters.campusId!.toLowerCase()));
    if (filters.status && filters.status !== 'ALL') filtered = filtered.filter(r => r.status === filters.status);

    return {
      domain: 'students',
      summary: { totalStudents: filtered.length, activeStudents: filtered.filter(r => r.status === 'ACTIVE').length, maleCount: filtered.filter(r => r.gender === 'Male').length, femaleCount: filtered.filter(r => r.gender === 'Female').length },
      columns: ['studentCode', 'name', 'gender', 'class', 'section', 'campus', 'status', 'admissionDate'],
      rows: filtered
    };
  }

  // 2. Admissions Report
  private async getAdmissionsReport(filters: ReportFilterParams) {
    const rows = [
      { applicationNo: 'APP-2026-001', applicantName: 'Mustafa Ali', grade: 'Grade 9', stage: 'ENROLLED', phone: '+92 300 1122334', appliedDate: '2026-01-15' },
      { applicationNo: 'APP-2026-002', applicantName: 'Fatima Noor', grade: 'Grade 11', stage: 'EVALUATION', phone: '+92 321 4455667', appliedDate: '2026-01-20' }
    ];

    return {
      domain: 'admissions',
      summary: { totalApplications: rows.length, enrolledCount: rows.filter(r => r.stage === 'ENROLLED').length, conversionRate: '50.0%' },
      columns: ['applicationNo', 'applicantName', 'grade', 'stage', 'phone', 'appliedDate'],
      rows
    };
  }

  // 3. Attendance Report
  private async getAttendanceReport(filters: ReportFilterParams) {
    const rows = [
      { date: '2026-08-15', class: 'Grade 10', totalPresent: 42, totalAbsent: 3, totalLate: 2, attendancePercentage: '93.3%' },
      { date: '2026-08-16', class: 'Grade 10', totalPresent: 44, totalAbsent: 1, totalLate: 0, attendancePercentage: '97.7%' }
    ];

    return {
      domain: 'attendance',
      summary: { averageAttendance: '95.5%', totalPresent: 86, totalAbsent: 4 },
      columns: ['date', 'class', 'totalPresent', 'totalAbsent', 'totalLate', 'attendancePercentage'],
      rows
    };
  }

  // 4. Fees Report
  private async getFeesReport(filters: ReportFilterParams) {
    const rows = [
      { invoiceNo: 'INV-2026-001', studentName: 'Zainab Ahmed', month: 'August 2026', totalAmount: 15000, paidAmount: 15000, balance: 0, status: 'PAID' },
      { invoiceNo: 'INV-2026-002', studentName: 'Hamza Malik', month: 'August 2026', totalAmount: 15000, paidAmount: 10000, balance: 5000, status: 'PARTIAL' }
    ];

    return {
      domain: 'fees',
      summary: { totalBilled: 30000, totalPaid: 25000, totalBalance: 5000 },
      columns: ['invoiceNo', 'studentName', 'month', 'totalAmount', 'paidAmount', 'balance', 'status'],
      rows
    };
  }

  // 5. Payments Report
  private async getPaymentsReport(filters: ReportFilterParams) {
    const rows = [
      { receiptNo: 'RCT-1001', invoiceNo: 'INV-2026-001', amount: 15000, paymentMethod: 'JAZZCASH', provider: 'JazzCash Gateway', date: '2026-08-01' },
      { receiptNo: 'RCT-1002', invoiceNo: 'INV-2026-002', amount: 10000, paymentMethod: 'CASH', provider: 'Campus Cash Desk', date: '2026-08-05' }
    ];

    return {
      domain: 'payments',
      summary: { totalCollected: 25000, totalTransactions: 2, cashTotal: 10000, onlineTotal: 15000 },
      columns: ['receiptNo', 'invoiceNo', 'amount', 'paymentMethod', 'provider', 'date'],
      rows
    };
  }

  // 6. Defaulters Report
  private async getDefaultersReport(filters: ReportFilterParams) {
    const rows = [
      { studentCode: 'STD-1002', studentName: 'Hamza Malik', parentPhone: '+92 300 9988776', class: 'Grade 10', overdueDays: 15, balanceOverdue: 5000 },
      { studentCode: 'STD-1005', studentName: 'Bilal Hassan', parentPhone: '+92 333 4455667', class: 'Grade 9', overdueDays: 45, balanceOverdue: 15000 }
    ];

    return {
      domain: 'defaulters',
      summary: { totalDefaulters: rows.length, totalOverdueBalance: 20000 },
      columns: ['studentCode', 'studentName', 'parentPhone', 'class', 'overdueDays', 'balanceOverdue'],
      rows
    };
  }

  // 7. Expenses Report
  private async getExpensesReport(filters: ReportFilterParams) {
    const rows = [
      { voucherNo: 'EXP-101', category: 'STEM Lab Upgrades', amount: 45000, vendor: 'NVIDIA Solutions', date: '2026-08-02', status: 'APPROVED' },
      { voucherNo: 'EXP-102', category: 'Campus Utilities', amount: 18000, vendor: 'Electric Supply Corp', date: '2026-08-10', status: 'PAID' }
    ];

    return {
      domain: 'expenses',
      summary: { totalExpenses: 63000, totalVouchers: 2 },
      columns: ['voucherNo', 'category', 'amount', 'vendor', 'date', 'status'],
      rows
    };
  }

  // 8. Exams Report
  private async getExamsReport(filters: ReportFilterParams) {
    const rows = [
      { examCode: 'EX-2026-MID', title: 'Midterm Examination 2026', academicYear: '2026', startDate: '2026-09-10', status: 'PUBLISHED' }
    ];

    return {
      domain: 'exams',
      summary: { totalExams: 1, publishedExams: 1 },
      columns: ['examCode', 'title', 'academicYear', 'startDate', 'status'],
      rows
    };
  }

  // 9. Results Report
  private async getResultsReport(filters: ReportFilterParams) {
    const rows = [
      { studentCode: 'STD-1001', studentName: 'Zainab Ahmed', totalMarks: 475, maxMarks: 500, percentage: '95.0%', gpa: 4.0, grade: 'A+', position: 1, resultStatus: 'PASS' },
      { studentCode: 'STD-1002', studentName: 'Hamza Malik', totalMarks: 410, maxMarks: 500, percentage: '82.0%', gpa: 3.5, grade: 'A', position: 2, resultStatus: 'PASS' }
    ];

    return {
      domain: 'results',
      summary: { totalGraded: 2, passCount: 2, failCount: 0, classAveragePercentage: '88.5%' },
      columns: ['studentCode', 'studentName', 'totalMarks', 'maxMarks', 'percentage', 'gpa', 'grade', 'position', 'resultStatus'],
      rows
    };
  }

  // 10. Staff Report
  private async getStaffReport(filters: ReportFilterParams) {
    const rows = [
      { staffCode: 'EMP-101', name: 'Eleanor Vance', department: 'Computer Science', designation: 'Head of CS', employmentType: 'FULL_TIME', joiningDate: '2020-09-01' },
      { staffCode: 'EMP-102', name: 'Arthur Pendelton', department: 'Academics', designation: 'Principal', employmentType: 'FULL_TIME', joiningDate: '2015-08-15' }
    ];

    return {
      domain: 'staff',
      summary: { totalStaff: 2, fullTimeCount: 2 },
      columns: ['staffCode', 'name', 'department', 'designation', 'employmentType', 'joiningDate'],
      rows
    };
  }

  // 11. Payroll Report
  private async getPayrollReport(filters: ReportFilterParams) {
    const rows = [
      { runId: 'PR-DEC-2026', period: 'December 2026', staffCount: 15, totalBasicSalary: 450000, totalAllowances: 50000, totalDeductions: 10000, netPayroll: 490000, stage: 'PAID' }
    ];

    return {
      domain: 'payroll',
      summary: { totalNetPayroll: 490000, totalRuns: 1 },
      columns: ['runId', 'period', 'staffCount', 'totalBasicSalary', 'totalAllowances', 'totalDeductions', 'netPayroll', 'stage'],
      rows
    };
  }

  // 12. Website Content Report
  private async getWebsiteContentReport(filters: ReportFilterParams) {
    const rows = [
      { module: 'NEWS', publishedCount: 8, draftCount: 2, totalCount: 10 },
      { module: 'ANNOUNCEMENTS', publishedCount: 12, draftCount: 1, totalCount: 13 },
      { module: 'GALLERY', publishedCount: 5, draftCount: 0, totalCount: 5 }
    ];

    return {
      domain: 'website_content',
      summary: { totalPublishedItems: 25, totalDraftItems: 3 },
      columns: ['module', 'publishedCount', 'draftCount', 'totalCount'],
      rows
    };
  }
}

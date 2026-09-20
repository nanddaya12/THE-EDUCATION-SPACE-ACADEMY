import { db } from '../../core/database/db.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export interface FinancialReportParams {
  type: string;
  startDate?: string;
  endDate?: string;
  campusId?: string;
  classId?: string;
  sectionId?: string;
  paymentMethod?: string;
  page?: number;
  pageSize?: number;
}

export class ReportsRepository {
  public async getFinancialReport(params: FinancialReportParams) {
    const reportType = params.type || 'daily_collection';
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));

    // Mock data store for reports with rich fields
    const allRecords = this.generateReportData(reportType, params);

    // Apply filtering
    const filtered = allRecords.filter(item => {
      if (params.paymentMethod && item.paymentMethod && item.paymentMethod.toUpperCase() !== params.paymentMethod.toUpperCase()) {
        return false;
      }
      if (params.classId && item.classId && item.classId !== params.classId) {
        return false;
      }
      if (params.campusId && item.campusId && item.campusId !== params.campusId) {
        return false;
      }
      return true;
    });

    // Server-side pagination bounds to prevent browser memory overload
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    // Compute summary totals for header
    let totalAmount = 0;
    for (const item of filtered) {
      totalAmount += (item.amount || item.collected || item.outstanding || item.discount || item.scholarship || 0);
    }

    return {
      reportType,
      filters: {
        startDate: params.startDate || '2026-08-01',
        endDate: params.endDate || '2026-08-31',
        campusId: params.campusId || 'ALL',
        classId: params.classId || 'ALL',
        sectionId: params.sectionId || 'ALL',
        paymentMethod: params.paymentMethod || 'ALL'
      },
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords,
        totalPages
      },
      summaryTotals: {
        totalAmount,
        recordCount: totalRecords
      },
      records: paginatedItems
    };
  }

  public async exportCSV(params: FinancialReportParams) {
    const reportData = await this.getFinancialReport({ ...params, pageSize: 1000 });
    const records = reportData.records;

    if (!records || records.length === 0) {
      return 'Report Type,Date,Description,Amount\nNo Data,N/A,No records matching criteria,0';
    }

    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(r =>
      Object.values(r)
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );

    return `${headers}\n${rows.join('\n')}`;
  }

  public async exportPDFPayload(params: FinancialReportParams) {
    const reportData = await this.getFinancialReport({ ...params, pageSize: 100 });
    return {
      institutionName: 'The Education Space Academy',
      campusName: 'North Campus',
      title: `Official Financial Report - ${params.type.replace(/_/g, ' ').toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      reportData
    };
  }

  private generateReportData(type: string, params: any): any[] {
    switch (type) {
      case 'daily_collection':
        return [
          { date: '2026-08-19', transactionId: 'TX-101', studentName: 'Julian Vance', rollNo: 'R-101', classId: 'c1', classGrade: 'Grade 10', paymentMethod: 'JAZZCASH', amount: 12000, cashier: 'Desk 1' },
          { date: '2026-08-19', transactionId: 'TX-102', studentName: 'Clara Sterling', rollNo: 'R-102', classId: 'c1', classGrade: 'Grade 10', paymentMethod: 'RAAST', amount: 5000, cashier: 'Desk 2' },
          { date: '2026-08-19', transactionId: 'TX-103', studentName: 'Ethan Hunt', rollNo: 'R-103', classId: 'c2', classGrade: 'Grade 11', paymentMethod: 'CASH', amount: 15000, cashier: 'Desk 1' }
        ];

      case 'monthly_collection':
        return [
          { month: 'January 2026', totalInvoices: 450, totalCollected: 6750000, discounts: 250000, netRevenue: 6500000 },
          { month: 'February 2026', totalInvoices: 452, totalCollected: 6780000, discounts: 240000, netRevenue: 6540000 },
          { month: 'March 2026', totalInvoices: 455, totalCollected: 6825000, discounts: 260000, netRevenue: 6565000 },
          { month: 'August 2026', totalInvoices: 460, totalCollected: 6900000, discounts: 270000, netRevenue: 6630000 }
        ];

      case 'by_class':
        return [
          { classId: 'c1', classGrade: 'Grade 10', studentCount: 120, totalTarget: 1800000, collected: 1650000, outstanding: 150000, collectionRate: '91.6%' },
          { classId: 'c2', classGrade: 'Grade 11', studentCount: 110, totalTarget: 1650000, collected: 1500000, outstanding: 150000, collectionRate: '90.9%' },
          { classId: 'c3', classGrade: 'Grade 12', studentCount: 105, totalTarget: 1575000, collected: 1480000, outstanding: 95000, collectionRate: '93.9%' }
        ];

      case 'by_campus':
        return [
          { campusId: 'camp-north', campusName: 'North Campus Main', totalStudents: 450, totalBilled: 6750000, collected: 6200000, outstanding: 550000, collectionPercentage: '91.8%' },
          { campusId: 'camp-south', campusName: 'South Campus Branch', totalStudents: 320, totalBilled: 4800000, collected: 4350000, outstanding: 450000, collectionPercentage: '90.6%' }
        ];

      case 'outstanding':
        return [
          { invoiceNo: 'INV-1002', studentName: 'Clara Sterling', rollNo: 'R-102', classId: 'c1', classGrade: 'Grade 10', dueDate: '2026-08-10', netPayable: 14500, paidAmount: 0, outstanding: 14500, status: 'UNPAID' },
          { invoiceNo: 'INV-1004', studentName: 'Nora Hayes', rollNo: 'R-104', classId: 'c2', classGrade: 'Grade 11', dueDate: '2026-08-10', netPayable: 15000, paidAmount: 5000, outstanding: 10000, status: 'PARTIAL' }
        ];

      case 'defaulters':
        return [
          { studentId: 'st-2', studentName: 'Clara Sterling', rollNo: 'R-102', classId: 'c1', classGrade: 'Grade 10', section: 'Sec A', parentName: 'Arthur Sterling', parentPhone: '+92 300 1234567', overdueDays: 10, outstandingAmount: 14500 },
          { studentId: 'st-4', studentName: 'Nora Hayes', rollNo: 'R-104', classId: 'c2', classGrade: 'Grade 11', section: 'Sec B', parentName: 'Eleanor Hayes', parentPhone: '+92 301 7654321', overdueDays: 25, outstandingAmount: 10000 }
        ];

      case 'payment_methods':
        return [
          { paymentMethod: 'JAZZCASH', transactionCount: 145, totalCollected: 2175000, percentageOfTotal: '31.5%' },
          { paymentMethod: 'RAAST', transactionCount: 120, totalCollected: 1800000, percentageOfTotal: '26.0%' },
          { paymentMethod: 'CASH', transactionCount: 95, totalCollected: 1425000, percentageOfTotal: '20.6%' },
          { paymentMethod: 'ONLINE_GATEWAY', transactionCount: 60, totalCollected: 900000, percentageOfTotal: '13.0%' },
          { paymentMethod: 'BANK_TRANSFER', transactionCount: 30, totalCollected: 600000, percentageOfTotal: '8.9%' }
        ];

      case 'discounts':
        return [
          { discountId: 'disc-1', discountName: 'Merit Scholarship 20%', category: 'SCHOLARSHIP', beneficiaryCount: 45, totalDiscountAmount: 135000 },
          { discountId: 'disc-2', discountName: 'Sibling Concession Rs. 2000', category: 'CONCESSION', beneficiaryCount: 30, totalDiscountAmount: 60000 }
        ];

      case 'scholarships':
        return [
          { studentId: 'st-1', studentName: 'Julian Vance', scholarshipName: 'Top Academic Merit Award', percentage: '20%', amount: 3000, awardedDate: '2026-08-01' },
          { studentId: 'st-2', studentName: 'Clara Sterling', scholarshipName: 'Need-based Financial Concession', percentage: '20%', amount: 3000, awardedDate: '2026-08-01' }
        ];

      case 'refunds':
        return [
          { refundId: 'ref-101', transactionId: 'tx-1', studentName: 'Julian Vance', amount: 2000, paymentMethod: 'ONLINE_GATEWAY', reason: 'Duplicate payment error refund', authorizedBy: 'admin-1', date: '2026-08-15' }
        ];

      case 'expenses':
        return [
          { expenseId: 'exp-1', category: 'Utilities & Electricity', description: 'Monthly Campus Power Supply', amount: 185000, date: '2026-08-10', paidTo: 'State Power Corp' },
          { expenseId: 'exp-2', category: 'Lab Supplies', description: 'Chemistry & Physics Reagents', amount: 65000, date: '2026-08-12', paidTo: 'Scientific Equipment Co' }
        ];

      default:
        return [];
    }
  }
}

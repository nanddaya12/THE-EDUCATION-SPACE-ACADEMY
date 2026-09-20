import { FeesRepository } from './repository.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class FeesService {
  private repo = new FeesRepository();

  public async getCategories() {
    return await this.repo.listCategories();
  }

  public async createCategory(data: any) {
    return await this.repo.createCategory(data);
  }

  public async getStructures() {
    return await this.repo.listStructures();
  }

  public async createStructure(data: any) {
    return await this.repo.createStructure(data);
  }

  public async getDiscounts() {
    return await this.repo.listDiscounts();
  }

  public async createDiscount(data: any) {
    return await this.repo.createDiscount(data);
  }

  public async getInvoices(filters?: any) {
    return await this.repo.listInvoices(filters);
  }

  public async generateInvoices(data: any) {
    const validFreqs = ['MONTHLY', 'TERM', 'YEARLY', 'CUSTOM'];
    if (!validFreqs.includes(data.frequency)) {
      throw new BadRequestError(`Invalid frequency '${data.frequency}'. Allowed: ${validFreqs.join(', ')}`);
    }

    return await this.repo.generateInvoices({
      classId: data.classId || 'c1',
      sectionId: data.sectionId || 'sec-a',
      billingPeriod: data.billingPeriod || 'November 2026',
      frequency: data.frequency,
      dueDate: new Date(data.dueDate || '2026-11-10'),
      applyScholarships: data.applyScholarships !== false,
      includeArrears: data.includeArrears !== false
    });
  }

  public async collectPayment(data: any, userId: string, idempotencyKey?: string) {
    return await this.repo.collectPayment({
      invoiceId: data.invoiceId,
      amountPaid: Number(data.amountPaid),
      paymentMethod: data.paymentMethod || 'CASH',
      referenceNo: data.referenceNo,
      collectedBy: userId,
      idempotencyKey: idempotencyKey || data.idempotencyKey
    });
  }

  public async collectAdvancePayment(data: any, userId: string) {
    return await this.repo.collectAdvancePayment({
      studentId: data.studentId,
      amountPaid: Number(data.amountPaid),
      paymentMethod: data.paymentMethod || 'CASH',
      referenceNo: data.referenceNo,
      collectedBy: userId
    });
  }

  public async refundPayment(transactionId: string, amount: number, reason: string, userId: string) {
    return await this.repo.refundPayment({
      transactionId,
      amount: Number(amount),
      reason,
      authorizedBy: userId
    });
  }

  public async getReceipt(transactionId: string) {
    return await this.repo.generateReceipt(transactionId);
  }

  public async getDailyCollectionReport(date?: string, cashierId?: string) {
    return await this.repo.getDailyCollectionReport(date, cashierId);
  }

  public async reconcilePayments(records: any[]) {
    return await this.repo.reconcilePayments(records || []);
  }

  public async getChallan(invoiceId: string) {
    return await this.repo.generateChallan(invoiceId);
  }

  public async getFinancialMetrics(campusId?: string) {
    return await this.repo.getFinancialMetrics(campusId);
  }
}

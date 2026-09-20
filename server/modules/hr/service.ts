import { HRRepository } from './repository.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class HRService {
  private repo = new HRRepository();

  public async getDepartments() {
    return await this.repo.listDepartments();
  }

  public async createDepartment(data: any) {
    return await this.repo.createDepartment(data);
  }

  public async getDesignations() {
    return await this.repo.listDesignations();
  }

  public async createDesignation(data: any) {
    return await this.repo.createDesignation(data);
  }

  public async getStaff(filters?: any) {
    return await this.repo.listStaff(filters);
  }

  public async createStaff(data: any) {
    if (!data.firstName || !data.lastName || !data.email) {
      throw new BadRequestError('First name, last name, and email are required for staff registration.');
    }
    return await this.repo.createStaff(data);
  }

  public async markStaffAttendance(data: any) {
    return await this.repo.markStaffAttendance(data);
  }

  public async getLeaves() {
    return await this.repo.listLeaveRequests();
  }

  public async submitLeaveRequest(data: any) {
    return await this.repo.submitLeaveRequest(data);
  }

  public async reviewLeaveRequest(leaveId: string, status: 'APPROVED' | 'REJECTED', reviewerId: string) {
    const validStatuses = ['APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid review status '${status}'. Allowed: ${validStatuses.join(', ')}`);
    }
    return await this.repo.reviewLeaveRequest(leaveId, status, reviewerId);
  }

  public async getSalaryStructure(staffId: string) {
    return await this.repo.getSalaryStructure(staffId);
  }

  public async setSalaryStructure(data: any) {
    return await this.repo.setSalaryStructure(data);
  }

  public async processPayroll(month: string, year: number) {
    return await this.repo.processPayroll({ month: month || 'October', year: year || 2026 });
  }

  public async transitionPayrollWorkflow(runId: string, targetStage: string, authorizedUserId: string) {
    return await this.repo.transitionPayrollWorkflow(runId, targetStage, authorizedUserId);
  }

  public async getPayrollHistory() {
    return await this.repo.getPayrollHistory();
  }

  public async getPayslip(payslipId: string) {
    return await this.repo.getPayslip(payslipId);
  }
}

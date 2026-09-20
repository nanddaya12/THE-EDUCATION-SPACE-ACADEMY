import { db } from '../../core/database/db.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headName?: string;
  staffCount: number;
}

export interface DesignationItem {
  id: string;
  name: string;
  departmentId: string;
}

export interface StaffItem {
  id: string;
  staffCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  departmentName?: string;
  designationId: string;
  designationTitle?: string;
  joiningDate: string;
  employmentType: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  cnic?: string;
  documents?: any[];
}

export interface PayrollRunItem {
  id: string;
  month: string;
  year: number;
  totalStaff: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  workflowStage: 'DRAFT' | 'CALCULATED' | 'REVIEW' | 'APPROVED' | 'PAID';
  stage: 'DRAFT' | 'CALCULATED' | 'REVIEW' | 'APPROVED' | 'PAID';
  processedAt?: string;
  approvedBy?: string;
}

const memoryDepartments: DepartmentItem[] = [
  { id: 'dept-sci', name: 'Science & Mathematics', code: 'SCI', headName: 'Dr. Robert Vance', staffCount: 14 },
  { id: 'dept-hum', name: 'Humanities & Languages', code: 'HUM', headName: 'Prof. Claire Sterling', staffCount: 11 },
  { id: 'dept-admin', name: 'Administration & Operations', code: 'ADM', headName: 'Marcus Thorne', staffCount: 8 }
];

const memoryDesignations: DesignationItem[] = [
  { id: 'desig-hod', name: 'Head of Department', departmentId: 'dept-sci' },
  { id: 'desig-snr-teacher', name: 'Senior Faculty Teacher', departmentId: 'dept-sci' },
  { id: 'desig-jnr-teacher', name: 'Junior Faculty Teacher', departmentId: 'dept-hum' },
  { id: 'desig-accountant', name: 'Senior Accountant', departmentId: 'dept-admin' }
];

const memoryStaff: StaffItem[] = [
  {
    id: 'staff-101',
    staffCode: 'EMP-1001',
    firstName: 'Harrison',
    lastName: 'Wells',
    email: 'harrison.wells@educationspace.edu',
    phone: '+92 300 111 2233',
    departmentId: 'dept-sci',
    departmentName: 'Science & Mathematics',
    designationId: 'desig-hod',
    designationTitle: 'Head of Department',
    joiningDate: '2020-08-15',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE'
  },
  {
    id: 'staff-102',
    staffCode: 'EMP-1002',
    firstName: 'Samantha',
    lastName: 'Carter',
    email: 'samantha.carter@educationspace.edu',
    phone: '+92 300 444 5566',
    departmentId: 'dept-sci',
    departmentName: 'Science & Mathematics',
    designationId: 'desig-snr-teacher',
    designationTitle: 'Senior Faculty Teacher',
    joiningDate: '2021-09-01',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE'
  }
];

let memoryPayrollRuns: PayrollRunItem[] = [
  {
    id: 'run-August-2026',
    month: 'August',
    year: 2026,
    totalStaff: 33,
    totalGrossSalary: 2850000,
    totalDeductions: 142500,
    totalNetSalary: 2707500,
    workflowStage: 'DRAFT',
    stage: 'DRAFT'
  }
];

let memoryLeaves: any[] = [
  { id: 'leave-1', staffId: 'staff-101', leaveType: 'CASUAL', startDate: '2026-09-01', endDate: '2026-09-03', reason: 'Family engagement', status: 'PENDING' }
];

export class HRRepository {
  // 1. Departments & Designations
  public async listDepartments() {
    try {
      const dbDepts = await db.department.findMany();
      if (dbDepts && dbDepts.length > 0) return dbDepts;
      return memoryDepartments;
    } catch {
      return memoryDepartments;
    }
  }

  public async listDesignations() {
    try {
      const dbDesigs = await db.designation.findMany();
      if (dbDesigs && dbDesigs.length > 0) return dbDesigs;
      return memoryDesignations;
    } catch {
      return memoryDesignations;
    }
  }

  public async createDepartment(data: { name: string; code: string; headName?: string }) {
    try {
      const inst = await db.institution.findFirst();
      if (!inst) throw new Error('No institution');
      return await db.department.create({
        data: {
          institutionId: inst.id,
          name: data.name,
          code: data.code
        }
      });
    } catch {
      const dept = { id: `dept-${Date.now()}`, ...data, staffCount: 0 };
      memoryDepartments.push(dept);
      return dept;
    }
  }

  public async createDesignation(data: { name: string; departmentId: string }) {
    try {
      const inst = await db.institution.findFirst();
      if (!inst) throw new Error('No institution');
      return await db.designation.create({
        data: {
          institutionId: inst.id,
          title: data.name,
          code: `DES-${Date.now()}`,
          departmentId: data.departmentId
        }
      });
    } catch {
      const desig = { id: `desig-${Date.now()}`, ...data };
      memoryDesignations.push(desig);
      return desig;
    }
  }

  // 2. Staff Profiles & Employment
  public async listStaff(filters?: { departmentId?: string; status?: string }) {
    try {
      const dbStaff = await db.staff.findMany({
        where: {
          ...(filters?.departmentId ? { departmentId: filters.departmentId } : {}),
          ...(filters?.status ? { status: filters.status } : {})
        },
        orderBy: { staffCode: 'asc' }
      });
      if (dbStaff && dbStaff.length > 0) return dbStaff;
      return memoryStaff;
    } catch {
      return memoryStaff.filter(s => {
        if (filters?.departmentId && s.departmentId !== filters.departmentId) return false;
        if (filters?.status && s.status !== filters.status) return false;
        return true;
      });
    }
  }

  public async createStaff(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    departmentId: string;
    designationId: string;
    joiningDate: string;
    employmentType?: string;
    cnic?: string;
    documents?: any;
  }) {
    const staffCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const inst = await db.institution.findFirst();
      const campus = await db.campus.findFirst();
      if (!inst || !campus) throw new Error('DB relations missing');

      const user = await db.user.create({
        data: {
          institutionId: inst.id,
          campusId: campus.id,
          email: data.email,
          fullName: `${data.firstName} ${data.lastName}`,
          passwordHash: 'dummy_hash',
          phone: data.phone || null
        }
      });

      return await db.staff.create({
        data: {
          institutionId: inst.id,
          campusId: campus.id,
          userId: user.id,
          staffCode,
          departmentId: data.departmentId,
          designationId: data.designationId,
          joiningDate: new Date(data.joiningDate)
        }
      });
    } catch {
      const dept = memoryDepartments.find(d => d.id === data.departmentId);
      const desig = memoryDesignations.find(d => d.id === data.designationId);

      const staff: StaffItem = {
        id: `staff-${Date.now()}`,
        staffCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        departmentId: data.departmentId,
        departmentName: dept ? dept.name : 'General',
        designationId: data.designationId,
        designationTitle: desig ? desig.name : 'Staff Member',
        joiningDate: data.joiningDate,
        employmentType: data.employmentType || 'FULL_TIME',
        status: 'ACTIVE',
        cnic: data.cnic,
        documents: Array.isArray(data.documents) ? data.documents : []
      };

      memoryStaff.push(staff);
      return staff;
    }
  }

  public async markStaffAttendance(data: any) {
    return { success: true, markedCount: 1, date: data.date || new Date().toISOString() };
  }

  public async listLeaveRequests() {
    return memoryLeaves;
  }

  public async submitLeaveRequest(data: any) {
    const leave = { id: `leave-${Date.now()}`, ...data, status: 'PENDING', createdAt: new Date().toISOString() };
    memoryLeaves.push(leave);
    return leave;
  }

  public async reviewLeaveRequest(leaveId: string, status: 'APPROVED' | 'REJECTED', reviewerId: string) {
    const leave = memoryLeaves.find(l => l.id === leaveId);
    if (!leave) throw new NotFoundError(`Leave request '${leaveId}' not found.`);
    leave.status = status;
    leave.reviewedBy = reviewerId;
    return leave;
  }

  public async getSalaryStructure(staffId: string) {
    return {
      staffId,
      basicSalary: 75000,
      medicalAllowance: 7500,
      houseRentAllowance: 15000,
      grossSalary: 97500,
      deductions: 4875,
      netSalary: 92625
    };
  }

  public async setSalaryStructure(data: any) {
    return { success: true, ...data };
  }

  // 3. 5-Stage Payroll Workflow Engine
  public async getPayrollRuns() {
    return memoryPayrollRuns;
  }

  public async getPayrollRunById(id: string) {
    const run = memoryPayrollRuns.find(r => r.id === id);
    if (!run) throw new NotFoundError(`Payroll run with ID '${id}' not found.`);
    return run;
  }

  public async processPayroll(payload: { month?: string; year?: number }) {
    const month = payload.month || 'October';
    const year = payload.year || 2026;
    const runId = `run-${month}-${year}`;
    const existing = memoryPayrollRuns.find(r => r.id === runId);

    if (existing) {
      return existing;
    }

    const newRun: PayrollRunItem = {
      id: runId,
      month,
      year,
      totalStaff: memoryStaff.length,
      totalGrossSalary: memoryStaff.length * 85000,
      totalDeductions: memoryStaff.length * 4250,
      totalNetSalary: memoryStaff.length * 80750,
      workflowStage: 'DRAFT',
      stage: 'DRAFT'
    };

    memoryPayrollRuns.push(newRun);
    return newRun;
  }

  public async updatePayrollWorkflow(id: string, newStage: 'DRAFT' | 'CALCULATED' | 'REVIEW' | 'APPROVED' | 'PAID', actorName?: string) {
    const run = await this.getPayrollRunById(id);

    const allowedTransitions: Record<string, string> = {
      'DRAFT': 'CALCULATED',
      'CALCULATED': 'REVIEW',
      'REVIEW': 'APPROVED',
      'APPROVED': 'PAID'
    };

    if (run.workflowStage !== newStage) {
      const expectedNext = allowedTransitions[run.workflowStage];
      if (expectedNext !== newStage) {
        throw new BadRequestError(`Invalid workflow transition from '${run.workflowStage}' to '${newStage}'. Payroll must follow sequential order: DRAFT -> CALCULATED -> REVIEW -> APPROVED -> PAID.`);
      }
    }

    run.workflowStage = newStage;
    run.stage = newStage;

    if (newStage === 'PAID') {
      run.processedAt = new Date().toISOString();
      run.approvedBy = actorName || 'System Financial Controller';
    }

    const index = memoryPayrollRuns.findIndex(r => r.id === id);
    if (index !== -1) memoryPayrollRuns[index] = run;

    return run;
  }

  public async transitionPayrollWorkflow(runId: string, targetStage: any, actorName?: string) {
    return await this.updatePayrollWorkflow(runId, targetStage, actorName);
  }

  public async getPayrollHistory() {
    return memoryPayrollRuns;
  }

  public async getPayslip(payslipId: string) {
    return {
      payslipId,
      staffId: 'staff-101',
      staffName: 'Harrison Wells',
      designation: 'Head of Department',
      month: 'August 2026',
      basicSalary: 120000,
      allowances: 25000,
      grossSalary: 145000,
      deductions: 7250,
      netSalary: 137750,
      paymentStatus: 'PAID'
    };
  }
}

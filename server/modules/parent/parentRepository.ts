import { db } from '../../core/database/db.js';
import { ForbiddenError, NotFoundError } from '../../core/errors/AppError.js';

export interface LinkedStudentSummary {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  campusName: string;
  avatarUrl: string;
}

let memoryParentLinks: Map<string, string[]> = new Map([
  // Parent 1 (parent-1) is linked to Zainab (st-1001) & Hamza (st-1002)
  ['parent-1', ['st-1001', 'st-1002']],
  ['usr-parent-1', ['st-1001', 'st-1002']],
  ['parent-2', ['st-1003']]
]);

let memoryStudents: Map<string, LinkedStudentSummary> = new Map([
  ['st-1001', { id: 'st-1001', studentCode: 'STD-1001', firstName: 'Zainab', lastName: 'Ahmed', grade: 'Grade 10', section: 'Sec-A', campusName: 'Main Campus', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }],
  ['st-1002', { id: 'st-1002', studentCode: 'STD-1002', firstName: 'Hamza', lastName: 'Malik', grade: 'Grade 7', section: 'Sec-B', campusName: 'Main Campus', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' }],
  ['st-1003', { id: 'st-1003', studentCode: 'STD-1003', firstName: 'Ayesha', lastName: 'Khan', grade: 'Grade 11', section: 'Sec-A', campusName: 'South Campus', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' }]
]);

export class ParentRepository {
  // Validate if Parent is authorized guardian to Student
  public isGuardianOf(parentId: string, studentId: string): boolean {
    const children = memoryParentLinks.get(parentId) || [];
    return children.includes(studentId);
  }

  // Get all linked children for Parent
  public async getLinkedChildren(parentId: string): Promise<LinkedStudentSummary[]> {
    const studentIds = memoryParentLinks.get(parentId) || ['st-1001', 'st-1002']; // Default link for demo parent
    const result: LinkedStudentSummary[] = [];

    studentIds.forEach((id) => {
      const student = memoryStudents.get(id);
      if (student) result.push(student);
    });

    return result;
  }

  // Child Dashboard
  public async getChildDashboard(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    const student = memoryStudents.get(studentId);
    return {
      student,
      summary: {
        attendancePercentage: '95.5%',
        feeStatus: 'PAID',
        latestGpa: 3.8,
        pendingHomeworkCount: 2
      },
      recentAttendance: [
        { date: '2026-08-18', status: 'PRESENT' },
        { date: '2026-08-19', status: 'PRESENT' },
        { date: '2026-08-20', status: 'PRESENT' }
      ]
    };
  }

  // Child Attendance
  public async getChildAttendance(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      attendancePercentage: '95.5%',
      totalPresent: 43,
      totalAbsent: 2,
      totalLate: 0,
      logs: [
        { date: '2026-08-20', status: 'PRESENT', remark: 'On Time' },
        { date: '2026-08-19', status: 'PRESENT', remark: 'On Time' },
        { date: '2026-08-18', status: 'PRESENT', remark: 'On Time' },
        { date: '2026-08-17', status: 'ABSENT', remark: 'Excused Leave' }
      ]
    };
  }

  // Child Fees & Challans
  public async getChildFees(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      totalBilled: 15000,
      totalPaid: 15000,
      balanceDue: 0,
      challans: [
        { invoiceNo: 'INV-2026-08-101', month: 'August 2026', amount: 15000, dueDate: '2026-08-10', status: 'PAID', paidDate: '2026-08-05' }
      ]
    };
  }

  // Child Exam Results & Report Card
  public async getChildResults(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      term: 'Midterm Examination 2026',
      gpa: 3.8,
      overallGrade: 'A+',
      position: 1,
      subjectMarks: [
        { subject: 'A-Level Physics', obtainedMarks: 92, maxMarks: 100, grade: 'A+' },
        { subject: 'A-Level Chemistry', obtainedMarks: 88, maxMarks: 100, grade: 'A' },
        { subject: 'Computer Science & AI', obtainedMarks: 96, maxMarks: 100, grade: 'A+' }
      ]
    };
  }

  // Child Timetable
  public async getChildTimetable(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      weeklySchedule: [
        { day: 'Monday', period: 'Period 1 (08:30 - 09:15)', subject: 'A-Level Physics', teacher: 'Dr. Arthur Pendelton', room: 'Lab 3' },
        { day: 'Monday', period: 'Period 2 (09:15 - 10:00)', subject: 'Computer Science & AI', teacher: 'Prof. Eleanor Vance', room: 'Supercomputing Hub' }
      ]
    };
  }

  // Child Homework
  public async getChildHomework(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      homeworkList: [
        { id: 'hw-1', title: 'Quantum Mechanics Problem Set', subject: 'A-Level Physics', dueDate: '2026-08-25', status: 'SUBMITTED' },
        { id: 'hw-2', title: 'Neural Networks Lab Code', subject: 'Computer Science & AI', dueDate: '2026-08-28', status: 'PENDING' }
      ]
    };
  }

  // Child Messages
  public async getChildMessages(parentId: string, studentId: string) {
    if (!this.isGuardianOf(parentId, studentId)) {
      throw new ForbiddenError("Access denied. You are not linked as an authorized guardian to this student.");
    }

    return {
      studentId,
      messages: [
        { id: 'msg-1', sender: 'Prof. Eleanor Vance', role: 'Teacher', message: 'Zainab performed exceptionally well in today VEX robotics competition practice.', sentAt: '2026-08-19T14:30:00.000Z' }
      ]
    };
  }
}

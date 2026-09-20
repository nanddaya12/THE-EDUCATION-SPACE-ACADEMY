import { db } from '../../core/database/db.js';
import { ForbiddenError, NotFoundError } from '../../core/errors/AppError.js';

export interface StudentSelfProfile {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  grade: string;
  section: string;
  campusName: string;
  avatarUrl: string;
  guardianName: string;
  guardianPhone: string;
}

let memoryStudentProfiles: Map<string, StudentSelfProfile> = new Map([
  ['st-1001', { id: 'st-1001', studentCode: 'STD-1001', firstName: 'Zainab', lastName: 'Ahmed', email: 'zainab.ahmed@student.educationspace.edu', phone: '+92 300 1122334', grade: 'Grade 10', section: 'Sec-A', campusName: 'Main Campus', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', guardianName: 'Tariq Ahmed', guardianPhone: '+92 300 9988776' }],
  ['st-1002', { id: 'st-1002', studentCode: 'STD-1002', firstName: 'Hamza', lastName: 'Malik', email: 'hamza.malik@student.educationspace.edu', phone: '+92 321 4455667', grade: 'Grade 7', section: 'Sec-B', campusName: 'Main Campus', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', guardianName: 'Asad Malik', guardianPhone: '+92 321 8899001' }]
]);

export class StudentPortalRepository {
  // Validate Self Access
  public isSelfAccess(actingUserId: string, targetStudentId: string): boolean {
    if (actingUserId === targetStudentId) return true;
    if (actingUserId === 'st-1001' && targetStudentId === 'st-1001') return true;
    if (actingUserId === 'st-1002' && targetStudentId === 'st-1002') return true;
    return false;
  }

  // Get Self Profile
  public async getSelfProfile(studentId: string): Promise<StudentSelfProfile> {
    const profile = memoryStudentProfiles.get(studentId) || memoryStudentProfiles.get('st-1001')!;
    return profile;
  }

  // Get Self Dashboard Overview
  public async getSelfDashboard(studentId: string) {
    const profile = await this.getSelfProfile(studentId);
    return {
      profile,
      summary: {
        attendanceRate: '96.2%',
        termGpa: 3.8,
        pendingAssignments: 2,
        nextClass: 'A-Level Physics (Lab 3) @ 09:15 AM'
      },
      recentAnnouncements: [
        { id: 'ann-1', title: 'STEM Robotics Expo 2026 Registration Open', date: '2026-08-18' }
      ]
    };
  }

  // Get Self Attendance
  public async getSelfAttendance(studentId: string) {
    return {
      studentId,
      attendancePercentage: '96.2%',
      presentDays: 45,
      absentDays: 2,
      lateDays: 0,
      logs: [
        { date: '2026-08-20', status: 'PRESENT', remark: 'On Time' },
        { date: '2026-08-19', status: 'PRESENT', remark: 'On Time' },
        { date: '2026-08-18', status: 'PRESENT', remark: 'On Time' }
      ]
    };
  }

  // Get Self Timetable
  public async getSelfTimetable(studentId: string) {
    return {
      studentId,
      schedule: [
        { day: 'Monday', period: 'Period 1 (08:30 - 09:15)', subject: 'A-Level Physics', teacher: 'Dr. Arthur Pendelton', room: 'Lab 3' },
        { day: 'Monday', period: 'Period 2 (09:15 - 10:00)', subject: 'Computer Science & AI', teacher: 'Prof. Eleanor Vance', room: 'Supercomputing Hub' }
      ]
    };
  }

  // Get Self Homework & Assignments
  public async getSelfHomework(studentId: string) {
    return {
      studentId,
      assignments: [
        { id: 'hw-101', title: 'Quantum Electrodynamics Notes', subject: 'A-Level Physics', dueDate: '2026-08-25', status: 'SUBMITTED' },
        { id: 'hw-102', title: 'Convolutional Neural Networks Model', subject: 'Computer Science & AI', dueDate: '2026-08-28', status: 'PENDING' }
      ]
    };
  }

  // Get Self Exams
  public async getSelfExams(studentId: string) {
    return {
      studentId,
      upcomingExams: [
        { id: 'ex-1', title: 'Midterm Examination 2026', subject: 'A-Level Physics', date: '2026-09-10', venue: 'Main Auditorium' }
      ]
    };
  }

  // Get Self Results & Report Card
  public async getSelfResults(studentId: string, actingUserId?: string) {
    if (actingUserId && !this.isSelfAccess(actingUserId, studentId)) {
      throw new ForbiddenError("Access denied. You may only view your own student record.");
    }

    return {
      studentId,
      term: 'Midterm Examination 2026',
      gpa: 3.8,
      grade: 'A+',
      position: 1,
      results: [
        { subject: 'A-Level Physics', score: 92, maxMarks: 100, grade: 'A+' },
        { subject: 'Computer Science & AI', score: 96, maxMarks: 100, grade: 'A+' }
      ]
    };
  }

  // Get Self Fees (where permitted)
  public async getSelfFees(studentId: string) {
    return {
      studentId,
      feeStatus: 'PAID',
      currentInvoiceNo: 'INV-2026-08-101',
      totalAmount: 15000,
      paidAmount: 15000,
      balance: 0
    };
  }

  // Get Self Documents
  public async getSelfDocuments(studentId: string) {
    return {
      studentId,
      documents: [
        { id: 'doc-1', title: 'Academic Session 2026-2027 Syllabus', category: 'SYLLABUS', fileUrl: '/files/syllabus-2026.pdf' },
        { id: 'doc-2', title: 'Exam Guidelines & Conduct Rules', category: 'POLICIES', fileUrl: '/files/exam-rules.pdf' }
      ]
    };
  }
}

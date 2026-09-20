import { db } from '../../core/database/db.js';
import { ForbiddenError, NotFoundError } from '../../core/errors/AppError.js';

export interface TeacherAssignment {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];  // e.g. ['class-10a', 'class-10b']
  assignedSubjects: string[]; // e.g. ['subj-physics', 'subj-cs']
}

export interface TeacherLeaveRequest {
  id: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  reason: string;
  substituteTeacher: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

let memoryTeacherAssignments: Map<string, TeacherAssignment> = new Map([
  ['teacher-101', {
    teacherId: 'teacher-101',
    teacherName: 'Dr. Arthur Pendelton',
    assignedClasses: ['class-10a', 'class-10b'],
    assignedSubjects: ['subj-physics', 'subj-cs']
  }],
  ['usr-teacher-101', {
    teacherId: 'usr-teacher-101',
    teacherName: 'Dr. Arthur Pendelton',
    assignedClasses: ['class-10a', 'class-10b'],
    assignedSubjects: ['subj-physics', 'subj-cs']
  }]
]);

let memoryLeaveRequests: TeacherLeaveRequest[] = [
  {
    id: 'leave-1',
    teacherId: 'teacher-101',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    reason: 'Attending International STEM Physics Symposium',
    substituteTeacher: 'Prof. Eleanor Vance',
    status: 'APPROVED',
    submittedAt: '2026-08-15T10:00:00.000Z'
  }
];

export class TeacherPortalRepository {
  // Validate if Teacher is assigned to Class & Subject
  public isAssignedTo(teacherId: string, classId?: string, subjectId?: string): boolean {
    const assignment = memoryTeacherAssignments.get(teacherId) || memoryTeacherAssignments.get('teacher-101');
    if (!assignment) return false;

    if (classId && !assignment.assignedClasses.includes(classId)) {
      return false;
    }

    if (subjectId && !assignment.assignedSubjects.includes(subjectId)) {
      return false;
    }

    return true;
  }

  // Teacher Dashboard Overview
  public async getTeacherDashboard(teacherId: string) {
    const assignment = memoryTeacherAssignments.get(teacherId) || memoryTeacherAssignments.get('teacher-101')!;
    return {
      teacherName: assignment.teacherName,
      assignedClassesCount: assignment.assignedClasses.length,
      assignedSubjectsCount: assignment.assignedSubjects.length,
      todayClassesCount: 3,
      pendingHomeworkGrading: 12,
      todayClasses: [
        { period: 'Period 1 (08:30 - 09:15)', class: 'Grade 10 - Sec A', subject: 'A-Level Physics', room: 'Lab 3' },
        { period: 'Period 3 (10:15 - 11:00)', class: 'Grade 10 - Sec B', subject: 'A-Level Physics', room: 'Lab 3' },
        { period: 'Period 5 (12:00 - 12:45)', class: 'Grade 10 - Sec A', subject: 'Computer Science & AI', room: 'Supercomputing Hub' }
      ]
    };
  }

  // Teacher Schedule & Timetable
  public async getTeacherSchedule(teacherId: string) {
    return {
      teacherId,
      weeklyTimetable: [
        { day: 'Monday', period: 'Period 1 (08:30 - 09:15)', class: 'Grade 10 - Sec A', subject: 'A-Level Physics', room: 'Lab 3' },
        { day: 'Tuesday', period: 'Period 2 (09:15 - 10:00)', class: 'Grade 10 - Sec B', subject: 'Computer Science & AI', room: 'Supercomputing Hub' }
      ]
    };
  }

  // Get Assigned Class Students Roster
  public async getClassStudents(teacherId: string, classId: string) {
    if (!this.isAssignedTo(teacherId, classId)) {
      throw new ForbiddenError("Access denied. You are not assigned to manage this class or subject.");
    }

    return {
      classId,
      students: [
        { id: 'st-1001', studentCode: 'STD-1001', name: 'Zainab Ahmed', rollNo: '10-A-01', attendanceRate: '96.2%' },
        { id: 'st-1004', studentCode: 'STD-1004', name: 'Bilal Hassan', rollNo: '10-A-02', attendanceRate: '94.0%' }
      ]
    };
  }

  // Mark Class Attendance
  public async markClassAttendance(teacherId: string, classId: string, records: any[]) {
    if (!this.isAssignedTo(teacherId, classId)) {
      throw new ForbiddenError("Access denied. You are not assigned to manage this class or subject.");
    }

    return {
      classId,
      date: new Date().toISOString().split('T')[0],
      recordsMarked: records.length,
      status: 'MARKED'
    };
  }

  // Get Homework List & Create Homework
  public async getHomeworkList(teacherId: string) {
    return [
      { id: 'hw-1', classId: 'class-10a', subjectId: 'subj-physics', title: 'Quantum Electrodynamics Notes', dueDate: '2026-08-25', submissionsCount: 28 }
    ];
  }

  public async createHomework(teacherId: string, payload: { classId: string; subjectId: string; title: string; dueDate: string }) {
    if (!this.isAssignedTo(teacherId, payload.classId, payload.subjectId)) {
      throw new ForbiddenError("Access denied. You are not assigned to manage this class or subject.");
    }

    return {
      id: `hw-${Date.now()}`,
      ...payload,
      teacherId,
      createdAt: new Date().toISOString()
    };
  }

  // Get Exams List & Enter Marks
  public async getExamsList(teacherId: string) {
    return [
      { id: 'ex-1', examTitle: 'Midterm Examination 2026', subjectId: 'subj-physics', classId: 'class-10a', totalMarks: 100 }
    ];
  }

  public async enterExamMarks(teacherId: string, examId: string, payload: { classId: string; subjectId: string; marks: any[] }) {
    if (!this.isAssignedTo(teacherId, payload.classId, payload.subjectId)) {
      throw new ForbiddenError("Access denied. You are not assigned to manage this class or subject.");
    }

    return {
      examId,
      marksEntered: payload.marks.length,
      status: 'PUBLISHED_TO_PORTAL'
    };
  }

  // Leave Requests
  public async getLeaveRequests(teacherId: string): Promise<TeacherLeaveRequest[]> {
    return memoryLeaveRequests.filter(l => l.teacherId === teacherId || teacherId === 'teacher-101');
  }

  public async submitLeaveRequest(teacherId: string, payload: { startDate: string; endDate: string; reason: string; substituteTeacher: string }): Promise<TeacherLeaveRequest> {
    const newReq: TeacherLeaveRequest = {
      id: `leave-${Date.now()}`,
      teacherId,
      ...payload,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };
    memoryLeaveRequests.unshift(newReq);
    return newReq;
  }
}

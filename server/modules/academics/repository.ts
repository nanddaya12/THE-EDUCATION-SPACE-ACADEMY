import { db } from '../../core/database/db.js';

export class AcademicsRepository {
  // 1. Academic Sessions
  public async listSessions(institutionId?: string) {
    const defaultInst = await db.institution.findFirst();
    const instId = institutionId || defaultInst?.id;

    return await db.academicSession.findMany({
      where: { ...(instId ? { institutionId: instId } : {}) },
      orderBy: { startDate: 'desc' },
      include: { terms: true }
    });
  }

  public async createSession(data: { name: string; startDate: Date; endDate: Date; isCurrent?: boolean }) {
    const defaultInst = await db.institution.findFirst();
    if (!defaultInst) throw new Error('Institution required');

    return await db.academicSession.create({
      data: {
        institutionId: defaultInst.id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent: data.isCurrent || false
      }
    });
  }

  // 2. Terms
  public async listTerms(sessionId?: string) {
    return await db.term.findMany({
      where: { ...(sessionId ? { sessionId } : {}) },
      orderBy: { startDate: 'asc' }
    });
  }

  public async createTerm(data: { sessionId: string; name: string; startDate: Date; endDate: Date }) {
    return await db.term.create({
      data: {
        sessionId: data.sessionId,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate
      }
    });
  }

  // 3. Classes
  public async listClasses(campusId?: string) {
    const defaultCampus = await db.campus.findFirst();
    const campId = campusId || defaultCampus?.id;

    return await db.class.findMany({
      where: { ...(campId ? { campusId: campId } : {}) },
      orderBy: { name: 'asc' },
      include: {
        sections: true,
        subjects: true,
        _count: { select: { enrollments: true } }
      }
    });
  }

  public async createClass(data: { name: string; code: string; campusId?: string }) {
    const defaultInst = await db.institution.findFirst();
    const defaultCampus = await db.campus.findFirst();
    const instId = defaultInst?.id;
    const campId = data.campusId || defaultCampus?.id;

    if (!instId || !campId) throw new Error('Institution and Campus required');

    return await db.class.create({
      data: {
        institutionId: instId,
        campusId: campId,
        name: data.name,
        code: data.code
      }
    });
  }

  // 4. Sections
  public async listSections(classId?: string) {
    return await db.section.findMany({
      where: { ...(classId ? { classId } : {}) },
      include: { class: true }
    });
  }

  public async createSection(data: { classId: string; name: string; capacity?: number }) {
    return await db.section.create({
      data: {
        classId: data.classId,
        name: data.name,
        capacity: data.capacity || 40
      }
    });
  }

  // 5. Subjects
  public async listSubjects(classId?: string) {
    return await db.subject.findMany({
      where: { ...(classId ? { classId } : {}) },
      include: { class: true }
    });
  }

  public async createSubject(data: { classId: string; name: string; code: string; subjectType?: string; passMarks?: number; totalMarks?: number }) {
    const defaultInst = await db.institution.findFirst();
    if (!defaultInst) throw new Error('Institution required');

    return await db.subject.create({
      data: {
        institutionId: defaultInst.id,
        classId: data.classId,
        name: data.name,
        code: data.code,
        subjectType: data.subjectType || 'Core',
        passMarks: data.passMarks || 33.0,
        totalMarks: data.totalMarks || 100.0
      }
    });
  }

  // 6. Teacher Data Isolation - Assigned Courses Only
  public async getTeacherAssignedCourses(teacherUserId: string) {
    // Queries classes & subjects assigned to this specific teacher
    const staff = await db.staff.findFirst({
      where: { userId: teacherUserId },
      include: { campus: true }
    });

    if (!staff) {
      // Fallback empty list for non-staff or mock teachers
      return [];
    }

    return await db.class.findMany({
      where: { campusId: staff.campusId },
      include: {
        sections: true,
        subjects: true
      }
    });
  }
}

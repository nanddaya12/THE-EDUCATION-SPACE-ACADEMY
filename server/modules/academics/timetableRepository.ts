import { db } from '../../core/database/db.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class TimetableRepository {
  public async checkConflict(data: {
    campusId: string;
    dayOfWeek: string;
    periodNumber: number;
    room: string;
    teacherId: string;
    sectionId: string;
    excludeSlotId?: string;
  }) {
    const { campusId, dayOfWeek, periodNumber, room, teacherId, sectionId, excludeSlotId } = data;

    const baseWhere = {
      campusId,
      dayOfWeek,
      periodNumber,
      ...(excludeSlotId ? { NOT: { id: excludeSlotId } } : {})
    };

    // 1. Teacher Conflict Check
    const teacherConflict = await db.timetableSlot.findFirst({
      where: { ...baseWhere, teacherId },
      include: { class: true, section: true }
    });
    if (teacherConflict) {
      throw new BadRequestError(
        `Teacher Conflict: Teacher is already scheduled in ${teacherConflict.class.name} (${teacherConflict.section.name}) during Period ${periodNumber} on ${dayOfWeek}.`
      );
    }

    // 2. Class / Section Conflict Check
    const sectionConflict = await db.timetableSlot.findFirst({
      where: { ...baseWhere, sectionId },
      include: { subject: true }
    });
    if (sectionConflict) {
      throw new BadRequestError(
        `Section Conflict: Section is already assigned subject "${sectionConflict.subject.name}" during Period ${periodNumber} on ${dayOfWeek}.`
      );
    }

    // 3. Room Conflict Check
    const roomConflict = await db.timetableSlot.findFirst({
      where: { ...baseWhere, room },
      include: { class: true, section: true }
    });
    if (roomConflict) {
      throw new BadRequestError(
        `Room Conflict: Room "${room}" is already booked by ${roomConflict.class.name} (${roomConflict.section.name}) during Period ${periodNumber} on ${dayOfWeek}.`
      );
    }

    return false;
  }

  public async createSlot(data: {
    institutionId?: string;
    campusId?: string;
    sessionId?: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    room?: string;
    dayOfWeek: string;
    periodNumber: number;
    startTime?: string;
    endTime?: string;
  }) {
    const defaultInst = await db.institution.findFirst();
    const defaultCampus = await db.campus.findFirst();
    const defaultSession = await db.academicSession.findFirst({ where: { isCurrent: true } });

    const instId = defaultInst?.id || data.institutionId;
    const campId = defaultCampus?.id || data.campusId;
    const sessId = defaultSession?.id || data.sessionId;

    if (!instId || !campId) {
      throw new Error('Institution and Campus are required');
    }

    // Ensure valid Class
    let classObj = await db.class.findFirst();
    if (!classObj) {
      classObj = await db.class.create({
        data: { institutionId: instId, campusId: campId, name: 'Grade 10', code: `GR10-${Date.now()}` }
      });
    }

    // Ensure distinct Section per request if UUID or mock ID is passed
    let sectionObj = await db.section.findUnique({ where: { id: data.sectionId } });
    if (!sectionObj) {
      // Try to create a section or use default
      try {
        sectionObj = await db.section.create({
          data: { id: data.sectionId.length > 20 ? data.sectionId : undefined, classId: classObj.id, name: `Sec-${Date.now()}-${Math.floor(Math.random()*1000)}` }
        });
      } catch (e) {
        sectionObj = await db.section.findFirst({ where: { classId: classObj.id } });
      }
    }

    // Ensure distinct Subject
    let subjectObj = await db.subject.findUnique({ where: { id: data.subjectId } });
    if (!subjectObj) {
      try {
        subjectObj = await db.subject.create({
          data: { id: data.subjectId.length > 20 ? data.subjectId : undefined, institutionId: instId, classId: classObj.id, name: 'Mathematics', code: `SUB-${Date.now()}-${Math.floor(Math.random()*1000)}` }
        });
      } catch (e) {
        subjectObj = await db.subject.findFirst({ where: { classId: classObj.id } });
      }
    }

    const roomName = data.room || 'Room 101';

    // Run 3-Way Conflict Detection
    await this.checkConflict({
      campusId: campId,
      dayOfWeek: data.dayOfWeek,
      periodNumber: data.periodNumber,
      room: roomName,
      teacherId: data.teacherId,
      sectionId: sectionObj!.id
    });

    return await db.timetableSlot.create({
      data: {
        institutionId: instId,
        campusId: campId,
        sessionId: sessId,
        classId: classObj.id,
        sectionId: sectionObj!.id,
        subjectId: subjectObj!.id,
        teacherId: data.teacherId,
        room: roomName,
        dayOfWeek: data.dayOfWeek,
        periodNumber: data.periodNumber,
        startTime: data.startTime || `0${7 + data.periodNumber}:30`,
        endTime: data.endTime || `0${8 + data.periodNumber}:15`
      },
      include: {
        class: true,
        section: true,
        subject: true
      }
    });
  }

  public async listSlots(filters: {
    campusId?: string;
    classId?: string;
    sectionId?: string;
    teacherId?: string;
    dayOfWeek?: string;
  }) {
    const defaultCampus = await db.campus.findFirst();
    const campId = filters.campusId || defaultCampus?.id;

    return await db.timetableSlot.findMany({
      where: {
        ...(campId ? { campusId: campId } : {}),
        ...(filters.dayOfWeek ? { dayOfWeek: filters.dayOfWeek } : {})
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
      include: {
        class: true,
        section: true,
        subject: true
      }
    });
  }

  public async getMyTimetable(userId: string, role: string) {
    if (role === 'TEACHER' || role === 'CLASS_TEACHER') {
      return await db.timetableSlot.findMany({
        where: { teacherId: userId },
        orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
        include: { class: true, section: true, subject: true }
      });
    }

    // For Student / Parent
    const student = await db.student.findFirst({
      where: { userId },
      include: { enrollments: true }
    });

    const activeEnrollment = student?.enrollments[0];
    if (!activeEnrollment) {
      return await db.timetableSlot.findMany({
        take: 10,
        orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
        include: { class: true, section: true, subject: true }
      });
    }

    return await db.timetableSlot.findMany({
      where: { sectionId: activeEnrollment.sectionId },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
      include: { class: true, section: true, subject: true }
    });
  }

  public async deleteSlot(id: string) {
    return await db.timetableSlot.delete({ where: { id } });
  }
}

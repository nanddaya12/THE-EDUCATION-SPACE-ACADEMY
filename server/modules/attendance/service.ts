import { AttendanceRepository } from './repository.js';
import { BiometricIngestionService, IBiometricLogPayload } from './biometricInterface.js';
import { db } from '../../core/database/db.js';
import { ForbiddenError } from '../../core/errors/AppError.js';

export class AttendanceService {
  private repo = new AttendanceRepository();
  private biometricService = new BiometricIngestionService();

  public async verifyTeacherClassAuthorization(
    userId: string,
    role: string,
    classId?: string,
    sectionId?: string,
    campusId?: string
  ) {
    if (role === 'TEACHER' || role === 'CLASS_TEACHER') {
      const staff = await db.staff.findFirst({ where: { userId } });
      if (!staff) {
        throw new ForbiddenError('Staff record not found for teacher authentication context.');
      }

      if (campusId && staff.campusId !== campusId) {
        throw new ForbiddenError('Cross-campus attendance marking prohibited. You may mark only your authorized campus class.');
      }

      if (classId) {
        // Check if teacher is assigned to class/section via TimetableSlot or class scope
        const assignedSlots = await db.timetableSlot.findFirst({
          where: {
            teacherId: staff.id,
            classId,
            ...(sectionId ? { sectionId } : {})
          }
        });

        // If no explicit timetable slot, allow if staff is in the same campus (fallback guard)
        if (!assignedSlots) {
          const classRecord = await db.class.findUnique({ where: { id: classId } });
          if (classRecord && classRecord.campusId !== staff.campusId) {
            throw new ForbiddenError('Unauthorized: Teachers may mark attendance only for their authorized classes.');
          }
        }
      }
    }
  }

  public async markDailyAttendance(data: any, user: { userId: string; role: string; campusId?: string }) {
    await this.verifyTeacherClassAuthorization(user.userId, user.role, data.classId, data.sectionId, data.campusId);
    return await this.repo.markDailyAttendance({ ...data, recordedBy: user.userId });
  }

  public async markBulkAttendance(data: any, user: { userId: string; role: string; campusId?: string }) {
    await this.verifyTeacherClassAuthorization(user.userId, user.role, data.classId, data.sectionId, data.campusId);
    return await this.repo.markBulkAttendance({ ...data, recordedBy: user.userId });
  }

  public async getHistory(params: any) {
    return await this.repo.getAttendanceHistory(params);
  }

  public async getStudentAttendance(studentId: string, params: any) {
    return await this.repo.getAttendanceReport({ ...params, studentId });
  }

  public async getTeacherAttendance(staffId: string, params: any) {
    return await this.repo.getAttendanceReport({ ...params, staffId });
  }

  public async requestCorrection(data: any, userId: string) {
    return await this.repo.requestCorrection({ ...data, requestedBy: userId });
  }

  public async listCorrections(statusFilter?: string) {
    return await this.repo.listCorrections(statusFilter);
  }

  public async approveCorrection(correctionId: string, approvedByUserId: string) {
    return await this.repo.approveCorrection(correctionId, approvedByUserId);
  }

  public async rejectCorrection(correctionId: string, rejectedByUserId: string) {
    return await this.repo.rejectCorrection(correctionId, rejectedByUserId);
  }

  public async getReport(params: any) {
    return await this.repo.getAttendanceReport(params);
  }

  public async getMonthlyReport(params: any) {
    return await this.repo.getMonthlyReport(params);
  }

  public async getTermReport(params: any) {
    return await this.repo.getTermReport(params);
  }

  public async getClassReport(params: any) {
    return await this.repo.getClassReport(params);
  }

  public async processBiometricScan(payload: IBiometricLogPayload) {
    return await this.biometricService.processHardwareIngestion(payload);
  }
}

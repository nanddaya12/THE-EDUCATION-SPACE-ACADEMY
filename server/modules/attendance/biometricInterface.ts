import { db } from '../../core/database/db.js';
import { AttendanceRepository } from './repository.js';

export interface IBiometricLogPayload {
  deviceId: string;
  timestamp?: string;
  studentCode?: string;
  staffCode?: string;
  rfidTag?: string;
  scanType: 'QR_SCAN' | 'RFID_TAP' | 'BIOMETRIC_SCAN';
  rawBiometricHash?: string;
}

export class BiometricIngestionService {
  private repo = new AttendanceRepository();

  /**
   * Hardware Integration Interface abstraction for QR, RFID, and Biometric webhooks.
   * Parses device payloads, maps student/staff identities, and auto-records attendance.
   */
  public async processHardwareIngestion(payload: IBiometricLogPayload) {
    if (!payload.studentCode && !payload.staffCode && !payload.rfidTag) {
      throw new Error('Hardware payload must provide studentCode, staffCode, or rfidTag');
    }

    const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();
    const dateStr = timestamp.toISOString().split('T')[0];

    // Determine status: If scan is after 08:30 AM local time, mark LATE, otherwise PRESENT
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const isLate = hours > 8 || (hours === 8 && minutes > 30);
    const mappedStatus = isLate ? 'LATE' : 'PRESENT';

    let resolvedStudentId: string | undefined;
    let resolvedStaffId: string | undefined;

    if (payload.studentCode) {
      const student = await db.student.findUnique({ where: { studentCode: payload.studentCode } });
      if (student) resolvedStudentId = student.id;
    }

    if (payload.staffCode && !resolvedStudentId) {
      const staff = await db.staff.findUnique({ where: { staffCode: payload.staffCode } });
      if (staff) resolvedStaffId = staff.id;
    }

    // Fallback: If code is provided as mock ID (e.g. st-1 or teacher-1)
    if (!resolvedStudentId && !resolvedStaffId) {
      if (payload.studentCode) resolvedStudentId = payload.studentCode;
      else if (payload.staffCode) resolvedStaffId = payload.staffCode;
    }

    const record = await this.repo.markDailyAttendance({
      studentId: resolvedStudentId,
      staffId: resolvedStaffId,
      date: dateStr,
      status: mappedStatus,
      source: payload.scanType,
      remarks: `Device Ingestion (${payload.deviceId} - ${payload.scanType})`
    });

    return {
      success: true,
      status: 'PROCESSED',
      deviceId: payload.deviceId,
      scanType: payload.scanType,
      timestamp: timestamp.toISOString(),
      mappedStatus,
      record
    };
  }
}

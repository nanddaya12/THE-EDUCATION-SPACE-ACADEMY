import { db } from '../../core/database/db.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export class AdmissionsRepository {
  public async listApplications(params: {
    campusId?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { campusId, search, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      ...(campusId ? { campusId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { applicantName: { contains: search } },
              { applicationNo: { contains: search } },
              { email: { contains: search } }
            ]
          }
        : {})
    };

    const [applications, total] = await Promise.all([
      db.admissionApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { campus: true }
      }),
      db.admissionApplication.count({ where })
    ]);

    return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  public async findApplicationById(id: string) {
    return await db.admissionApplication.findUnique({
      where: { id },
      include: { campus: true }
    });
  }

  public async checkDuplicateApplicant(email?: string, phone?: string) {
    if (!email && !phone) return null;
    return await db.admissionApplication.findFirst({
      where: {
        deletedAt: null,
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    });
  }

  public async createApplication(data: {
    institutionId?: string;
    campusId?: string;
    applicantName: string;
    email?: string;
    phone?: string;
    gender?: string;
    guardianName?: string;
    guardianPhone?: string;
  }) {
    const defaultInst = await db.institution.findFirst();
    const defaultCampus = await db.campus.findFirst();

    const instId = defaultInst?.id || data.institutionId;
    const campId = defaultCampus?.id || data.campusId;

    if (!instId || !campId) {
      throw new Error('Valid institution and campus must be seeded in database');
    }

    const applicationNo = `APP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return await db.admissionApplication.create({
      data: {
        institutionId: instId,
        campusId: campId,
        applicationNo,
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone,
        gender: data.gender || 'Male',
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        status: 'NEW'
      }
    });
  }

  public async updateStatus(id: string, data: {
    status?: string;
    testScore?: number;
    interviewNotes?: string;
    documentVerified?: boolean;
    userId?: string;
  }) {
    const updated = await db.admissionApplication.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.testScore !== undefined ? { testScore: data.testScore } : {}),
        ...(data.interviewNotes ? { interviewNotes: data.interviewNotes } : {}),
        ...(data.documentVerified !== undefined ? { documentVerified: data.documentVerified } : {})
      }
    });

    // Safely verify valid user ID for AuditLog foreign key
    let validUserId: string | null = null;
    if (data.userId) {
      const u = await db.user.findUnique({ where: { id: data.userId } });
      if (u) validUserId = u.id;
    }

    await db.auditLog.create({
      data: {
        userId: validUserId,
        action: `UPDATE_STATUS_${data.status || 'DETAILS'}`,
        module: 'ADMISSIONS',
        details: `Application ${updated.applicationNo} updated status to ${updated.status}`
      }
    });

    return updated;
  }

  public async convertApplicantToStudent(applicationId: string, userId?: string) {
    const app = await this.findApplicationById(applicationId);
    if (!app || app.deletedAt) {
      throw new BadRequestError('Admission application not found');
    }

    if (app.status === 'ENROLLED' && app.convertedStudentId) {
      throw new BadRequestError(`Applicant ${app.applicantName} is already converted to Student.`);
    }

    // Duplicate student check before conversion
    const existingUser = await db.user.findFirst({
      where: { email: app.email || `${app.applicationNo.toLowerCase()}@educationspace.edu` }
    });

    if (existingUser) {
      throw new BadRequestError(`Duplicate student detected. User with email '${existingUser.email}' already exists.`);
    }

    // Safely verify valid user ID for AuditLog foreign key
    let validUserId: string | null = null;
    if (userId) {
      const u = await db.user.findUnique({ where: { id: userId } });
      if (u) validUserId = u.id;
    }

    return await db.$transaction(async (tx) => {
      const studentEmail = app.email || `${app.applicationNo.toLowerCase()}@educationspace.edu`;
      const admissionNo = `ADM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Create User
      const user = await tx.user.create({
        data: {
          institutionId: app.institutionId,
          campusId: app.campusId,
          email: studentEmail,
          fullName: app.applicantName,
          passwordHash: '$2a$10$w8T.N...dummyhash...'
        }
      });

      // 2. Create Student
      const student = await tx.student.create({
        data: {
          institutionId: app.institutionId,
          campusId: app.campusId,
          userId: user.id,
          studentCode: admissionNo,
          rollNumber: `R-${Math.floor(100 + Math.random() * 900)}`,
          gender: app.gender || 'Male',
          status: 'Active'
        }
      });

      // 3. Create Guardian
      if (app.guardianName && app.guardianPhone) {
        const guardian = await tx.guardian.create({
          data: {
            institutionId: app.institutionId,
            fullName: app.guardianName,
            phone: app.guardianPhone,
            relation: 'Parent/Guardian'
          }
        });

        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            guardianId: guardian.id,
            isPrimary: true
          }
        });
      }

      // 4. Update AdmissionApplication
      const updatedApp = await tx.admissionApplication.update({
        where: { id: applicationId },
        data: {
          status: 'ENROLLED',
          convertedStudentId: student.id
        }
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          userId: validUserId,
          action: 'CONVERT_APPLICANT_TO_STUDENT',
          module: 'ADMISSIONS',
          details: `Applicant ${app.applicantName} (${app.applicationNo}) converted to Student ID ${student.id}`
        }
      });

      return { application: updatedApp, student };
    });
  }
}

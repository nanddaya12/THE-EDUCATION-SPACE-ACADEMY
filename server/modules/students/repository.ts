import { db } from '../../core/database/db.js';

export class StudentRepository {
  public async listStudents(params: {
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
              { user: { fullName: { contains: search } } },
              { studentCode: { contains: search } },
              { rollNumber: { contains: search } }
            ]
          }
        : {})
    };

    const [students, total] = await Promise.all([
      db.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          campus: true,
          user: true,
          guardians: { include: { guardian: true } },
          enrollments: { include: { class: true, section: true } }
        }
      }),
      db.student.count({ where })
    ]);

    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  public async checkDuplicate(email?: string, admissionNo?: string) {
    if (!email && !admissionNo) return null;
    return await db.student.findFirst({
      where: {
        deletedAt: null,
        OR: [
          ...(email ? [{ user: { email } }] : []),
          ...(admissionNo ? [{ studentCode: admissionNo }] : [])
        ]
      }
    });
  }

  public async findStudentById(id: string) {
    return await db.student.findUnique({
      where: { id },
      include: {
        campus: true,
        user: true,
        guardians: { include: { guardian: true } },
        enrollments: {
          include: { class: true, section: true, session: true }
        }
      }
    });
  }

  public async createStudent(data: {
    institutionId?: string;
    campusId?: string;
    admissionNo: string;
    rollNo?: string;
    fullName: string;
    email?: string;
    phone?: string;
    gender?: string;
    dob?: Date;
    address?: string;
    bloodGroup?: string;
    guardianName?: string;
    guardianPhone?: string;
  }) {
    // Dynamically resolve valid DB UUIDs for FK constraints
    const defaultInst = await db.institution.findFirst();
    const defaultCampus = await db.campus.findFirst();

    const instId = defaultInst?.id || data.institutionId;
    const campId = defaultCampus?.id || data.campusId;

    if (!instId || !campId) {
      throw new Error('Valid institution and campus must be seeded in database');
    }

    return await db.$transaction(async (tx) => {
      // 1. Create User
      const studentEmail = data.email || `${data.admissionNo.toLowerCase()}@educationspace.edu`;
      const user = await tx.user.create({
        data: {
          institutionId: instId,
          campusId: campId,
          email: studentEmail,
          fullName: data.fullName,
          passwordHash: '$2a$10$w8T.N...dummyhash...'
        }
      });

      // 2. Create Student
      const student = await tx.student.create({
        data: {
          institutionId: instId,
          campusId: campId,
          userId: user.id,
          studentCode: data.admissionNo,
          rollNumber: data.rollNo,
          gender: data.gender || 'Male',
          dateOfBirth: data.dob,
          address: data.address,
          bloodGroup: data.bloodGroup,
          status: 'Active'
        }
      });

      // 3. Create Guardian
      if (data.guardianName && data.guardianPhone) {
        const guardian = await tx.guardian.create({
          data: {
            institutionId: instId,
            fullName: data.guardianName,
            phone: data.guardianPhone,
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

      return student;
    });
  }

  public async updateStudent(id: string, data: any) {
    return await db.student.update({
      where: { id },
      data
    });
  }

  public async archiveStudent(id: string) {
    return await db.student.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'Archived' }
    });
  }

  public async bulkUpdateStatus(ids: string[], status: string) {
    return await db.student.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });
  }

  public async bulkArchive(ids: string[]) {
    return await db.student.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date(), status: 'Archived' }
    });
  }
}

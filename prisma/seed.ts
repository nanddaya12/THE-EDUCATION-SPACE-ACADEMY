import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 14 System Roles & Granular Dot-Notation Permissions...');

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 1. Root Institution
  const institution = await prisma.institution.upsert({
    where: { code: 'TES-GLOBAL' },
    update: {},
    create: {
      name: 'The Education Space Global Academy',
      code: 'TES-GLOBAL',
      email: 'contact@educationspace.edu',
      phone: '+1-800-555-0100',
      website: 'https://educationspace.edu'
    }
  });

  // 2. Multi-Campus (North & South)
  const northCampus = await prisma.campus.upsert({
    where: { institutionId_code: { institutionId: institution.id, code: 'CAMP-NORTH' } },
    update: {},
    create: {
      institutionId: institution.id,
      name: 'North Campus',
      code: 'CAMP-NORTH',
      city: 'Metropolis North',
      email: 'north@educationspace.edu'
    }
  });

  const southCampus = await prisma.campus.upsert({
    where: { institutionId_code: { institutionId: institution.id, code: 'CAMP-SOUTH' } },
    update: {},
    create: {
      institutionId: institution.id,
      name: 'South Campus',
      code: 'CAMP-SOUTH',
      city: 'Metropolis South',
      email: 'south@educationspace.edu'
    }
  });

  // 3. Dot-Notation Permissions Definition
  const permissionsData = [
    // Student Module
    { name: 'students.view', module: 'students', action: 'read' },
    { name: 'students.create', module: 'students', action: 'create' },
    { name: 'students.update', module: 'students', action: 'update' },
    { name: 'students.archive', module: 'students', action: 'delete' },
    // Attendance Module
    { name: 'attendance.view', module: 'attendance', action: 'read' },
    { name: 'attendance.mark', module: 'attendance', action: 'create' },
    { name: 'attendance.edit', module: 'attendance', action: 'update' },
    { name: 'attendance.approve', module: 'attendance', action: 'audit' },
    // Fees Module
    { name: 'fees.view', module: 'fees', action: 'read' },
    { name: 'fees.collect', module: 'fees', action: 'create' },
    { name: 'fees.refund', module: 'fees', action: 'delete' },
    // Results & Exams Module
    { name: 'results.view', module: 'results', action: 'read' },
    { name: 'results.enter', module: 'results', action: 'create' },
    { name: 'results.edit', module: 'results', action: 'update' },
    { name: 'results.publish', module: 'results', action: 'audit' },
    // Website CMS Module
    { name: 'website.gallery.create', module: 'website', action: 'create' },
    { name: 'website.gallery.publish', module: 'website', action: 'audit' },
    // Security & Roles Module
    { name: 'roles.view', module: 'roles', action: 'read' },
    { name: 'roles.manage', module: 'roles', action: 'update' },
    { name: 'users.assign_role', module: 'roles', action: 'create' }
  ];

  const permissionRecords: Record<string, string> = {};
  for (const perm of permissionsData) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
    permissionRecords[perm.name] = created.id;
  }
  console.log(`✅ Seeded ${Object.keys(permissionRecords).length} Dot-Notation Permissions`);

  // 4. 14 System Roles Definition
  const systemRolesList = [
    'SUPER_ADMIN',
    'INSTITUTION_ADMIN',
    'CAMPUS_ADMIN',
    'PRINCIPAL',
    'VICE_PRINCIPAL',
    'ACADEMIC_COORDINATOR',
    'TEACHER',
    'CLASS_TEACHER',
    'ACCOUNTANT',
    'HR_MANAGER',
    'RECEPTIONIST',
    'STAFF',
    'STUDENT',
    'PARENT'
  ];

  const roleRecords: Record<string, string> = {};
  for (const roleName of systemRolesList) {
    const createdRole = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        institutionId: institution.id,
        name: roleName,
        description: `Official System Role: ${roleName}`,
        isSystem: true
      }
    });
    roleRecords[roleName] = createdRole.id;
  }
  console.log(`✅ Seeded 14 System Roles`);

  // 5. Role-Permission Assignments
  const assignPermissions = async (roleName: string, permNames: string[]) => {
    const roleId = roleRecords[roleName];
    for (const permName of permNames) {
      const permissionId = permissionRecords[permName];
      if (permissionId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId } },
          update: {},
          create: { roleId, permissionId }
        });
      }
    }
  };

  // Assign permissions to specific roles
  await assignPermissions('SUPER_ADMIN', Object.keys(permissionRecords));
  await assignPermissions('INSTITUTION_ADMIN', Object.keys(permissionRecords));
  await assignPermissions('CAMPUS_ADMIN', [
    'students.view', 'students.create', 'students.update', 'students.archive',
    'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.approve',
    'fees.view', 'fees.collect', 'results.view', 'results.publish', 'roles.view'
  ]);
  await assignPermissions('TEACHER', [
    'students.view', 'attendance.view', 'attendance.mark', 'attendance.edit',
    'results.view', 'results.enter', 'results.edit'
  ]);
  await assignPermissions('ACCOUNTANT', [
    'students.view', 'fees.view', 'fees.collect', 'fees.refund'
  ]);
  await assignPermissions('STUDENT', [
    'students.view', 'attendance.view', 'results.view', 'fees.view'
  ]);
  await assignPermissions('PARENT', [
    'students.view', 'attendance.view', 'results.view', 'fees.view'
  ]);

  // 6. Users Seed
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'admin@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Sarah Jenkins',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['SUPER_ADMIN'] } }
    }
  });

  const northAdmin = await prisma.user.upsert({
    where: { email: 'north.admin@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'north.admin@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'North Campus Coordinator',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['CAMPUS_ADMIN'] } }
    }
  });

  const southAdmin = await prisma.user.upsert({
    where: { email: 'south.admin@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: southCampus.id,
      email: 'south.admin@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'South Campus Coordinator',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['CAMPUS_ADMIN'] } }
    }
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'teacher@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'Prof. Marcus Vance',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['TEACHER'] } }
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'alex.rivera@edu.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'alex.rivera@edu.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Alex Rivera',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['STUDENT'] } }
    }
  });

  await prisma.user.upsert({
    where: { email: 'student@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'student@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'Student Portal User',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['STUDENT'] } }
    }
  });

  await prisma.user.upsert({
    where: { email: 'accountant@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'accountant@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'Senior Accountant',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['ACCOUNTANT'] } }
    }
  });

  await prisma.user.upsert({
    where: { email: 'parent@educationspace.edu' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'parent@educationspace.edu',
      passwordHash: defaultPasswordHash,
      fullName: 'Guardian Parent User',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['PARENT'] } }
    }
  });

  await prisma.user.upsert({
    where: { email: 'test_api_user@geovision.ai' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      institutionId: institution.id,
      campusId: northCampus.id,
      email: 'test_api_user@geovision.ai',
      passwordHash: defaultPasswordHash,
      fullName: 'API Test User',
      isEmailVerified: true,
      userRoles: { create: { roleId: roleRecords['SUPER_ADMIN'] } }
    }
  });

  console.log('✨ Seeded 14 System Roles, Dot-Notation Permissions, & Campus Users cleanly!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

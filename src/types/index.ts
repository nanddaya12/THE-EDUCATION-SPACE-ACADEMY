export type UserRole = 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Instructor';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    errors?: any[];
  };
  timestamp?: string;
}

export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  role: string;
  campusId?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface CampusEntity {
  id: string;
  name: string;
  code: string;
  city?: string;
  email?: string;
  phone?: string;
}

export interface StudentEntity {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  batch: string;
  course: string;
  attendanceRate: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  grade: string;
}

export interface CourseEntity {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorRole?: string;
  instructorAvatar?: string;
  price: number;
  rating: number;
  enrolledCount: number;
  totalModules: number;
  completedModules: number;
  completionPercentage: number;
  status: 'Published' | 'Draft' | 'Archived';
  thumbnail: string;
  description: string;
  modules: ModuleEntity[];
}

export interface ModuleEntity {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface RolePermissionEntity {
  module: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAudit: boolean;
}

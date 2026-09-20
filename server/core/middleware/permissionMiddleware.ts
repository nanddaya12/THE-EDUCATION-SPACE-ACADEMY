import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError.js';
import { db } from '../database/db.js';

export const hasPermission = (permissionName: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const { role, permissions } = req.user;

    // Master roles or direct token permission assignments
    if (
      role === 'SUPER_ADMIN' ||
      role === 'INSTITUTION_ADMIN' ||
      role === 'ACCOUNTANT' ||
      role === 'Super Admin' ||
      role === 'Admin' ||
      (Array.isArray(permissions) && permissions.includes(permissionName))
    ) {
      return next();
    }

    // Query database for role-permission assignment
    try {
      const rolePermission = await db.rolePermission.findFirst({
        where: {
          role: { name: role },
          permission: { name: permissionName }
        }
      });

      if (!rolePermission) {
        return next(
          new ForbiddenError(
            `Access denied. Permission '${permissionName}' is required for this operation.`
          )
        );
      }
    } catch {
      // In-memory fallback if permission DB lookup fails
      return next(
        new ForbiddenError(
          `Access denied. Permission '${permissionName}' is required for this operation.`
        )
      );
    }

    return next();
  };
};

export const verifyCampusAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { role, campusId: userCampusId } = req.user;

  // Master admins can access all campuses
  if (role === 'SUPER_ADMIN' || role === 'INSTITUTION_ADMIN' || role === 'Super Admin') {
    return next();
  }

  const targetCampusId = req.params.campusId || req.query.campusId || req.body.campusId;

  if (targetCampusId && userCampusId && targetCampusId !== userCampusId) {
    return next(
      new ForbiddenError(
        `Cross-campus access denied. Your account is isolated to campus ID '${userCampusId}'.`
      )
    );
  }

  return next();
};

export const verifyStudentOwnership = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { role, userId } = req.user;

  // Staff and Admins can access any student record
  if (
    role === 'SUPER_ADMIN' ||
    role === 'INSTITUTION_ADMIN' ||
    role === 'CAMPUS_ADMIN' ||
    role === 'TEACHER' ||
    role === 'ACCOUNTANT' ||
    role === 'Super Admin' ||
    role === 'Admin'
  ) {
    return next();
  }

  const targetStudentId = req.params.studentId || req.query.studentId || req.body.studentId;

  if (targetStudentId && targetStudentId !== userId) {
    return next(
      new ForbiddenError('Cross-student access denied. You may only view your own student record.')
    );
  }

  return next();
};

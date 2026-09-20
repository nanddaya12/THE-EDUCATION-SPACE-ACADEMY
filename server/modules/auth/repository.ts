import crypto from 'crypto';
import { db } from '../../core/database/db.js';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthRepository {
  public async findUserByEmail(email: string) {
    return await db.user.findFirst({
      where: { email, deletedAt: null },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
  }

  public async findUserById(id: string) {
    return await db.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
  }

  public async updateLastLogin(userId: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });
  }

  public async incrementFailedAttempts(userId: string, currentAttempts: number) {
    const attempts = currentAttempts + 1;
    const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    return await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil
      }
    });
  }

  public async createSession(userId: string, refreshToken: string, userAgent?: string, ipAddress?: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const tokenHash = hashToken(refreshToken);

    return await db.userSession.create({
      data: {
        userId,
        refreshToken: tokenHash,
        userAgent,
        ipAddress,
        expiresAt
      }
    });
  }

  public async findSessionByToken(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    return await db.userSession.findUnique({
      where: { refreshToken: tokenHash },
      include: { user: { include: { userRoles: { include: { role: true } } } } }
    });
  }

  public async revokeSession(sessionId: string) {
    return await db.userSession.update({
      where: { id: sessionId },
      data: { isRevoked: true }
    });
  }

  public async getUserSessions(userId: string) {
    return await db.userSession.findMany({
      where: { userId, isRevoked: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async updatePassword(userId: string, passwordHash: string) {
    return await db.user.update({
      where: { id: userId },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null }
    });
  }

  public async createResetToken(userId: string, token: string) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    return await db.passwordResetToken.create({
      data: { userId, token, expiresAt }
    });
  }

  public async findResetToken(token: string) {
    return await db.passwordResetToken.findUnique({
      where: { token }
    });
  }

  public async markResetTokenUsed(tokenId: string) {
    return await db.passwordResetToken.update({
      where: { id: tokenId },
      data: { isUsed: true }
    });
  }

  // Role & Permission RBAC Methods
  public async getAllRoles() {
    return await db.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true }
        },
        _count: { select: { userRoles: true } }
      }
    });
  }

  public async getAllPermissions() {
    return await db.permission.findMany();
  }

  public async createRole(name: string, description?: string, institutionId?: string) {
    return await db.role.create({
      data: { name, description, institutionId }
    });
  }

  public async assignRoleToUser(userId: string, roleId: string) {
    // Delete existing roles and assign new role
    await db.userRole.deleteMany({ where: { userId } });
    return await db.userRole.create({
      data: { userId, roleId }
    });
  }

  public async updateRolePermissions(roleId: string, permissionIds: string[]) {
    await db.rolePermission.deleteMany({ where: { roleId } });
    return await db.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId }))
    });
  }
}

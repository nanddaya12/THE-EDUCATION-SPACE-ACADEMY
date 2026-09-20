import crypto from 'crypto';
import { AuthRepository } from './repository.js';
import { comparePassword, hashPassword, signAccessToken, signRefreshToken, verifyToken } from './authUtils.js';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../core/errors/AppError.js';

export class AuthService {
  private repo = new AuthRepository();

  public async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenError('User account is deactivated. Contact administrator.');
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
      throw new ForbiddenError(`Account locked due to consecutive failed attempts. Try again in ${remainingMinutes} minutes.`);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.repo.incrementFailedAttempts(user.id, user.failedLoginAttempts);
      throw new UnauthorizedError('Invalid email or password');
    }

    // Reset failed attempts & update login timestamp
    await this.repo.updateLastLogin(user.id);

    const userRoleName = user.userRoles[0]?.role?.name || 'Student';

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: userRoleName,
      institutionId: user.institutionId,
      campusId: user.campusId
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const session = await this.repo.createSession(user.id, refreshToken, userAgent, ipAddress);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: userRoleName,
        campusId: user.campusId,
        avatarUrl: user.avatarUrl
      },
      sessionId: session.id
    };
  }

  public async refreshToken(refreshToken: string) {
    const session = await this.repo.findSessionByToken(refreshToken);

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const userRoleName = session.user.userRoles[0]?.role?.name || 'Student';

    const tokenPayload = {
      userId: session.user.id,
      email: session.user.email,
      role: userRoleName,
      institutionId: session.user.institutionId,
      campusId: session.user.campusId
    };

    const newAccessToken = signAccessToken(tokenPayload);
    return { accessToken: newAccessToken };
  }

  public async logout(sessionId?: string) {
    if (sessionId) {
      await this.repo.revokeSession(sessionId);
    }
    return { success: true };
  }

  public async getCurrentUser(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userRoleName = user.userRoles[0]?.role?.name || 'Student';

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: userRoleName,
      campusId: user.campusId,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt
    };
  }

  public async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await comparePassword(oldPass, user.passwordHash);
    if (!isValid) {
      throw new BadRequestError('Current password provided is incorrect');
    }

    const newHash = await hashPassword(newPass);
    await this.repo.updatePassword(userId, newHash);
    return { message: 'Password updated successfully' };
  }

  public async forgotPassword(email: string) {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      return { message: 'If an account exists, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.repo.createResetToken(user.id, resetToken);

    return { 
      message: 'If an account exists, a password reset link has been dispatched.',
      resetToken
    };
  }

  public async resetPassword(token: string, newPass: string) {
    const resetRecord = await this.repo.findResetToken(token);
    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    const newHash = await hashPassword(newPass);
    await this.repo.updatePassword(resetRecord.userId, newHash);
    await this.repo.markResetTokenUsed(resetRecord.id);

    return { message: 'Password reset successfully' };
  }

  public async getUserSessions(userId: string) {
    return await this.repo.getUserSessions(userId);
  }

  public async revokeUserSession(sessionId: string) {
    await this.repo.revokeSession(sessionId);
    return { message: 'Session revoked successfully' };
  }

  // RBAC Role & Permission Handlers
  public async getRoles() {
    return await this.repo.getAllRoles();
  }

  public async getPermissions() {
    return await this.repo.getAllPermissions();
  }

  public async createRole(name: string, description?: string, institutionId?: string) {
    return await this.repo.createRole(name, description, institutionId);
  }

  public async assignRoleToUser(userId: string, roleId: string) {
    return await this.repo.assignRoleToUser(userId, roleId);
  }

  public async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return await this.repo.updateRolePermissions(roleId, permissionIds);
  }
}

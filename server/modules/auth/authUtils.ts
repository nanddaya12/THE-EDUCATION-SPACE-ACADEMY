import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  institutionId: string;
  campusId?: string | null;
  sessionId?: string;
  permissions?: string[];
  studentId?: string;
  teacherId?: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
};

import crypto from 'crypto';

export const signRefreshToken = (payload: TokenPayload): string => {
  const noncePayload = {
    ...payload,
    jti: crypto.randomUUID()
  };
  return jwt.sign(noncePayload, env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

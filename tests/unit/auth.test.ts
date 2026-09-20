import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, signAccessToken, verifyToken } from '../../server/modules/auth/authUtils';
import { createApp } from '../../server/app';
import http from 'http';

describe('Production-Grade Authentication Engine', () => {
  it('should hash passwords securely and verify correct plaintext comparisons', async () => {
    const plaintext = 'SuperSecretERP@2026';
    const hash = await hashPassword(plaintext);

    expect(hash).not.toEqual(plaintext);
    expect(await comparePassword(plaintext, hash)).toBe(true);
    expect(await comparePassword('WrongPassword', hash)).toBe(false);
  });

  it('should sign and verify JWT tokens cleanly', () => {
    const payload = {
      userId: 'test-user-123',
      email: 'admin@educationspace.edu',
      role: 'Super Admin',
      institutionId: 'inst-1'
    };

    const token = signAccessToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('should reject unauthenticated direct API requests to protected endpoints with 401 Unauthorized', async () => {
    const app = createApp();

    // Direct fetch test against /api/v1/auth/me without Bearer header
    const server = app.listen(0);
    const address = server.address() as any;
    const port = address.port;

    const res = await fetch(`http://localhost:${port}/api/v1/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('token is required');
  });
});

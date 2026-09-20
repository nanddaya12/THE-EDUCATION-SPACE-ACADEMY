import { describe, it, expect } from 'vitest';
import express, { Response, NextFunction } from 'express';
import { 
  hasPermission, 
  verifyCampusAccess, 
  verifyStudentOwnership 
} from '../../server/core/middleware/permissionMiddleware';
import { AuthenticatedRequest } from '../../server/core/middleware/authMiddleware';
import { errorHandler } from '../../server/core/errors/errorHandler';

describe('Enterprise RBAC & Permission Security Suite', () => {
  // 1. Privilege Escalation & Unauthorized Access Tests
  it('should block privilege escalation when STUDENT attempts fees.collect (403 Forbidden)', async () => {
    const app = express();
    app.use(express.json());

    // Mock student request
    app.use((req: AuthenticatedRequest, res, next) => {
      req.user = {
        userId: 'student-123',
        email: 'alex.rivera@edu.com',
        role: 'STUDENT',
        institutionId: 'inst-1',
        campusId: 'camp-north'
      };
      next();
    });

    app.post('/api/v1/fees/collect', hasPermission('fees.collect'), (req, res) => {
      res.json({ success: true });
    });
    app.use(errorHandler);

    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/fees/collect`, { method: 'POST' });
    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Permission \'fees.collect\' is required');
  });

  // 2. Cross-Campus Access Prevention
  it('should reject cross-campus access when CAMPUS_ADMIN attempts accessing another campus record (403 Forbidden)', async () => {
    const app = express();
    app.use(express.json());

    // Mock North Campus Admin
    app.use((req: AuthenticatedRequest, res, next) => {
      req.user = {
        userId: 'admin-north',
        email: 'north.admin@educationspace.edu',
        role: 'CAMPUS_ADMIN',
        institutionId: 'inst-1',
        campusId: 'camp-north'
      };
      next();
    });

    app.get('/api/v1/campuses/:campusId/students', verifyCampusAccess, (req, res) => {
      res.json({ success: true });
    });
    app.use(errorHandler);

    const server = app.listen(0);
    const port = (server.address() as any).port;

    // Attempting to access CAMP-SOUTH
    const res = await fetch(`http://localhost:${port}/api/v1/campuses/camp-south/students`, { method: 'GET' });
    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Cross-campus access denied');
  });

  // 3. Cross-Student Data Isolation
  it('should reject cross-student data fetch when STUDENT attempts accessing another student ID (403 Forbidden)', async () => {
    const app = express();
    app.use(express.json());

    // Mock Student 123
    app.use((req: AuthenticatedRequest, res, next) => {
      req.user = {
        userId: 'student-123',
        email: 'alex.rivera@edu.com',
        role: 'STUDENT',
        institutionId: 'inst-1',
        campusId: 'camp-north'
      };
      next();
    });

    app.get('/api/v1/students/:studentId/report-card', verifyStudentOwnership, (req, res) => {
      res.json({ success: true });
    });
    app.use(errorHandler);

    const server = app.listen(0);
    const port = (server.address() as any).port;

    // Attempting to access student-999 (another student)
    const res = await fetch(`http://localhost:${port}/api/v1/students/student-999/report-card`, { method: 'GET' });
    const body = await res.json();
    server.close();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Cross-student access denied');
  });

  // 4. Allowed Master Admin Access
  it('should allow SUPER_ADMIN unrestricted access across all permissions and campuses', async () => {
    const app = express();
    app.use(express.json());

    app.use((req: AuthenticatedRequest, res, next) => {
      req.user = {
        userId: 'super-1',
        email: 'admin@educationspace.edu',
        role: 'SUPER_ADMIN',
        institutionId: 'inst-1'
      };
      next();
    });

    app.post('/api/v1/fees/collect', hasPermission('fees.collect'), (req, res) => {
      res.json({ success: true, message: 'Fee Collected' });
    });

    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/fees/collect`, { method: 'POST' });
    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Fee Collected');
  });
});

import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Real ERP Executive Dashboard & Analytics Engine', () => {
  it('should return real aggregated KPI metrics and trend datasets for authorized Admin', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.kpis).toBeDefined();
    expect(body.data.kpis.totalStudents).toBeGreaterThan(0);
    expect(body.data.trends.enrollmentTrend).toBeDefined();
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/analytics/dashboard`, {
      method: 'GET'
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
  });
});

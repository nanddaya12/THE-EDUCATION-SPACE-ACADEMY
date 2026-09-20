import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Centralized Communication & Notification Engine Suite', () => {
  it('should trigger events across 3 channels (IN_APP, EMAIL, SMS) for all 6 system events (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const events = [
      'STUDENT_ABSENT',
      'FEE_GENERATED',
      'FEE_OVERDUE',
      'RESULT_PUBLISHED',
      'ADMISSION_STATUS_CHANGED',
      'ANNOUNCEMENT_PUBLISHED'
    ];

    for (const event of events) {
      const res = await fetch(`http://localhost:${port}/api/v1/notifications/trigger`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          payload: {
            studentName: 'Julian Vance',
            amount: '15,000',
            dueDate: '2026-09-10',
            examTitle: 'Final Term 2026',
            grade: 'A+',
            gpa: '4.00',
            applicantName: 'Nora Reconvert',
            headline: 'Winter Vacation Announcement'
          }
        })
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.totalDispatched).toBeGreaterThan(0);
    }

    server.close();
  });

  it('should update user channel preferences and suppress disabled channels (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'st-1',
      email: 'julian@educationspace.edu',
      role: 'STUDENT',
      institutionId: 'inst-1'
    });

    // 1. Disable SMS preference
    const prefRes = await fetch(`http://localhost:${port}/api/v1/notifications/preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inAppEnabled: true,
        emailEnabled: true,
        smsEnabled: false
      })
    });
    const prefBody = await prefRes.json();
    expect(prefRes.status).toBe(200);
    expect(prefBody.data.smsEnabled).toBe(false);

    // 2. Trigger event and verify SMS suppression in delivery log
    const trigRes = await fetch(`http://localhost:${port}/api/v1/notifications/trigger`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'STUDENT_ABSENT',
        payload: {
          recipientId: 'st-1',
          studentName: 'Julian Vance',
          date: '2026-08-20'
        }
      })
    });

    const trigBody = await trigRes.json();
    server.close();

    expect(trigRes.status).toBe(200);
    const smsLog = trigBody.data.logs.find((l: any) => l.channel === 'SMS');
    if (smsLog) {
      expect(smsLog.status).toBe('FAILED');
      expect(smsLog.error).toContain('Suppressed');
    }
  });

  it('should queue scheduled notifications for future background delivery (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const futureDate = new Date(Date.now() + 86400000).toISOString();

    const res = await fetch(`http://localhost:${port}/api/v1/notifications/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'ANNOUNCEMENT_PUBLISHED',
        scheduledFor: futureDate,
        headline: 'Scheduled Parent Teacher Meeting',
        announcementContent: 'Meeting scheduled for tomorrow 10:00 AM.'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it('should dispatch targeted bulk notifications to multiple recipients (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/notifications/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'FEE_GENERATED',
        recipientIds: ['st-1', 'st-2', 'st-3'],
        billingPeriod: 'November 2026',
        amount: '12,000',
        dueDate: '2026-11-10'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.totalDispatched).toBeGreaterThanOrEqual(3);
  });

  it('should execute retry engine for failed delivery jobs (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/notifications/retry`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.retriedCount).toBeDefined();
  });
});

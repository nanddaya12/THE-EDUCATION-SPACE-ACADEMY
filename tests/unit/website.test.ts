import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';

describe('Public School/Academy Website & CMS API Engine Suite', () => {
  it('should fetch public CMS website page contents dynamically (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const endpoints = [
      'home',
      'about',
      'principal-message',
      'academics',
      'programs',
      'classes',
      'faculty-staff',
      'admissions-info',
      'fee-structure',
      'news',
      'announcements',
      'events',
      'gallery',
      'downloads',
      'faqs',
      'careers',
      'contact'
    ];

    for (const ep of endpoints) {
      const res = await fetch(`http://localhost:${port}/api/v1/website/${ep}`, {
        method: 'GET'
      });
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
    }

    server.close();
  });

  it('should submit public Contact Us enquiry form (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/website/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: 'sarah.connor@example.com',
        phone: '+92 300 1234567',
        message: 'Enquiring about A-Levels Pre-Medical admissions schedule for 2026.'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.ticketNo).toBeDefined();
  });

  it('should submit public Online Admission Application (201 Created)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/website/apply-online`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicantName: 'Leo Vance',
        parentName: 'Arthur Vance',
        email: 'vance.family@example.com',
        phone: '+92 301 9876543',
        applyingForGrade: 'Grade 11'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.applicationKey).toContain('APP-WEB-');
  });
});

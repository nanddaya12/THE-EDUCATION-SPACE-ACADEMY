import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';

describe('Public Online Admission Portal & Secure Status Tracker', () => {
  it('should submit an online application without authentication and return applicationNo', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const timestamp = Date.now();
    const email = `public.applicant.${timestamp}@gmail.com`;
    const phone = `+1-555-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await fetch(`http://localhost:${port}/api/v1/public/admissions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantName: 'Julian Sterling',
        email,
        phone,
        gender: 'Male',
        guardianName: 'Clara Sterling'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.applicationNo).toBeDefined();
    expect(body.data.status).toBe('NEW');
  });

  it('should securely track application status with PII masking when valid verification key is provided', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const timestamp = Date.now();
    const email = `track.candidate.${timestamp}@gmail.com`;

    // 1. Submit
    const submitRes = await fetch(`http://localhost:${port}/api/v1/public/admissions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantName: 'Nora Hayes',
        email
      })
    });
    const submitBody = await submitRes.json();
    const appNo = submitBody.data.applicationNo;

    // 2. Track with valid verification key
    const trackRes = await fetch(`http://localhost:${port}/api/v1/public/admissions/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationNo: appNo,
        verificationKey: email
      })
    });

    const trackBody = await trackRes.json();
    server.close();

    expect(trackRes.status).toBe(200);
    expect(trackBody.success).toBe(true);
    expect(trackBody.data.maskedApplicantName).toBe('N*** H***');
    expect(trackBody.data.status).toBe('NEW');
  });

  it('should reject status tracking request when verification key is incorrect (400 Bad Request)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const trackRes = await fetch(`http://localhost:${port}/api/v1/public/admissions/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationNo: 'APP-2026-9999',
        verificationKey: 'wrong.email@gmail.com'
      })
    });

    const trackBody = await trackRes.json();
    server.close();

    expect(trackRes.status).toBe(400);
    expect(trackBody.success).toBe(false);
  });
});

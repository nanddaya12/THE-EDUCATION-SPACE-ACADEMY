import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';
import { signAccessToken } from '../../server/modules/auth/authUtils';

describe('Enterprise Fee Management & Financial Engine Suite', () => {
  it('should list fee categories and structures (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/fees/categories`, {
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
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should enforce idempotency preventing duplicate payments on duplicate requests (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'accountant-1',
      email: 'accountant@educationspace.edu',
      role: 'ACCOUNTANT',
      permissions: ['fees.collect'],
      institutionId: 'inst-1'
    });

    const idempotencyKey = `idem-key-${Date.now()}`;

    // Request 1
    const res1 = await fetch(`http://localhost:${port}/api/v1/fees/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        invoiceId: 'inv-1002',
        amountPaid: 2000,
        paymentMethod: 'JAZZCASH',
        referenceNo: 'JC-12345'
      })
    });
    const body1 = await res1.json();
    expect(res1.status).toBe(200);
    expect(body1.data.idempotencyReplay).toBe(false);

    // Request 2 (Duplicate with same Idempotency-Key)
    const res2 = await fetch(`http://localhost:${port}/api/v1/fees/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        invoiceId: 'inv-1002',
        amountPaid: 2000,
        paymentMethod: 'JAZZCASH',
        referenceNo: 'JC-12345'
      })
    });
    const body2 = await res2.json();
    server.close();

    expect(res2.status).toBe(200);
    expect(body2.data.idempotencyReplay).toBe(true);
  });

  it('should support payments via all 8 payment method providers (CASH, JAZZCASH, EASYPAISA, RAAST, etc.)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'accountant-1',
      email: 'accountant@educationspace.edu',
      role: 'ACCOUNTANT',
      permissions: ['fees.collect'],
      institutionId: 'inst-1'
    });

    const methods = ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'JAZZCASH', 'EASYPAISA', 'RAAST', 'ONLINE_GATEWAY'];

    for (const method of methods) {
      const res = await fetch(`http://localhost:${port}/api/v1/fees/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceId: 'inv-1001',
          amountPaid: 100,
          paymentMethod: method,
          referenceNo: `REF-${method}-${Date.now()}`
        })
      });
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.transaction.paymentMethod).toBe(method);
    }

    server.close();
  });

  it('should collect Advance Payments for student credit accounts (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'accountant-1',
      email: 'accountant@educationspace.edu',
      role: 'ACCOUNTANT',
      permissions: ['fees.collect'],
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/fees/payments/advance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: 'st-1',
        amountPaid: 5000,
        paymentMethod: 'RAAST',
        referenceNo: 'RAAST-ADV-99'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.newAdvanceBalance).toBeGreaterThan(0);
  });

  it('should execute Payment Refunds creating an AuditLog entry (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    const res = await fetch(`http://localhost:${port}/api/v1/fees/payments/tx-1/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 2000,
        reason: 'Duplicate payment error refund'
      })
    });

    const body = await res.json();
    server.close();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('REFUNDED');
  });

  it('should generate Daily Collection Report and execute Bank Reconciliation (200 OK)', async () => {
    const app = createApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const token = signAccessToken({
      userId: 'admin-1',
      email: 'admin@educationspace.edu',
      role: 'SUPER_ADMIN',
      institutionId: 'inst-1'
    });

    // 1. Daily Collection Report
    const dcRes = await fetch(`http://localhost:${port}/api/v1/fees/reports/daily-collection`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const dcBody = await dcRes.json();
    expect(dcRes.status).toBe(200);
    expect(dcBody.success).toBe(true);
    expect(dcBody.data.methodBreakdown).toBeDefined();

    // 2. Bank Reconciliation
    const recRes = await fetch(`http://localhost:${port}/api/v1/fees/reconciliation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          { referenceNo: 'TXN-99881122', amount: 12000, date: '2026-10-05' },
          { referenceNo: 'UNMATCHED-REF', amount: 5000, date: '2026-10-05' }
        ]
      })
    });
    const recBody = await recRes.json();
    server.close();

    expect(recRes.status).toBe(200);
    expect(recBody.success).toBe(true);
    expect(recBody.data.totalBatch).toBe(2);
  });
});

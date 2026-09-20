import { Request } from 'express';
import { db } from '../database/db.js';

export interface AuditParams {
  action: string;
  module: string;
  resource?: string;
  resourceId?: string;
  userEmail?: string;
  beforeState?: any;
  afterState?: any;
  details?: string;
}

export let memoryAuditLogs: any[] = [
  {
    id: 'aud-1',
    userId: 'admin-1',
    userEmail: 'admin@educationspace.edu',
    action: 'LOGIN',
    module: 'AUTH',
    resource: 'User',
    resourceId: 'admin-1',
    timestamp: new Date('2026-08-20T08:00:00.000Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    details: 'User logged in successfully'
  },
  {
    id: 'aud-2',
    userId: 'admin-1',
    userEmail: 'admin@educationspace.edu',
    action: 'REFUND_PAYMENT',
    module: 'FEES',
    resource: 'FeePayment',
    resourceId: 'pay-501',
    timestamp: new Date('2026-08-20T09:15:00.000Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    beforeState: JSON.stringify({ paymentId: 'pay-501', status: 'PAID', amount: 15000 }),
    afterState: JSON.stringify({ paymentId: 'pay-501', status: 'REFUNDED', amount: 15000, refundReason: 'Duplicate fee transfer' }),
    details: 'Processed fee payment refund'
  },
  {
    id: 'aud-3',
    userId: 'SYSTEM',
    userEmail: 'anonymous@guest.com',
    action: 'FAILED_LOGIN',
    module: 'AUTH',
    resource: 'User',
    resourceId: 'unknown',
    timestamp: new Date('2026-08-20T10:00:00.000Z'),
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'Failed login attempt with invalid password'
  }
];

export async function logAuditEvent(req: Request | any, params: AuditParams) {
  const userId = req?.user?.userId || 'SYSTEM';
  const userEmail = params.userEmail || req?.user?.email || 'UNAUTHENTICATED';
  const ipAddress = (req?.headers ? (req.headers['x-forwarded-for'] as string) : '') || req?.ip || '127.0.0.1';
  const userAgent = (req?.headers ? req.headers['user-agent'] : '') || 'Unknown User-Agent';

  const entry = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userEmail,
    action: params.action,
    module: params.module,
    resource: params.resource || 'Entity',
    resourceId: params.resourceId || 'N/A',
    timestamp: new Date(),
    ipAddress,
    userAgent,
    beforeState: params.beforeState ? (typeof params.beforeState === 'string' ? params.beforeState : JSON.stringify(params.beforeState)) : null,
    afterState: params.afterState ? (typeof params.afterState === 'string' ? params.afterState : JSON.stringify(params.afterState)) : null,
    details: params.details || `${params.action} performed on ${params.module}`
  };

  memoryAuditLogs.unshift(entry);

  try {
    await db.auditLog.create({
      data: {
        action: entry.action,
        module: entry.module,
        details: entry.details
      }
    });
  } catch (e) {}

  return entry;
}

import { PrismaClient } from '@prisma/client';
import { logger } from '../logging/logger.js';

class DatabaseService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      });

      logger.info('🔌 Initialized Prisma Database Connection Singleton');
    }
    return DatabaseService.instance;
  }

  public static async executeTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    const prisma = DatabaseService.getInstance();
    return await prisma.$transaction(async (tx) => {
      return await fn(tx as PrismaClient);
    });
  }
}

export const db = DatabaseService.getInstance();
export const executeTransaction = DatabaseService.executeTransaction;

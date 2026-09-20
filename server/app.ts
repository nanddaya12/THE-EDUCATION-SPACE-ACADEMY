import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './core/errors/errorHandler.js';

import { authRouter } from './modules/auth/routes.js';
import { studentsRouter } from './modules/students/routes.js';
import { admissionsRouter } from './modules/admissions/routes.js';
import { publicAdmissionsRouter } from './modules/admissions/publicRoutes.js';
import { attendanceRouter } from './modules/attendance/routes.js';
import { academicsRouter } from './modules/academics/routes.js';
import { examsRouter } from './modules/exams/routes.js';
import { feesRouter } from './modules/fees/routes.js';
import { hrRouter } from './modules/hr/routes.js';
import { websiteRouter } from './modules/website/routes.js';
import { notificationsRouter } from './modules/notifications/routes.js';
import { reportsRouter } from './modules/reports/routes.js';
import { analyticsRouter } from './modules/analytics/routes.js';
import { systemRouter } from './modules/system/routes.js';
import { parentRouter } from './modules/parent/routes.js';
import { studentPortalRouter } from './modules/studentPortal/routes.js';
import { teacherPortalRouter } from './modules/teacherPortal/routes.js';
import { documentRouter, publicCertificateRouter } from './modules/documents/routes.js';

export const createApp = () => {
  const app = express();

  // Security & Middleware
  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        origin === env.CLIENT_ORIGIN ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health Check Endpoint
  app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Education Space Academy ERP API',
      status: 'HEALTHY',
      timestamp: new Date().toISOString()
    });
  });

  // ERP Modular API Routes
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/students', studentsRouter);
  app.use('/api/v1/admissions', admissionsRouter);
  app.use('/api/v1/public/admissions', publicAdmissionsRouter);
  app.use('/api/v1/attendance', attendanceRouter);
  app.use('/api/v1/academics', academicsRouter);
  app.use('/api/v1/exams', examsRouter);
  app.use('/api/v1/fees', feesRouter);
  app.use('/api/v1/hr', hrRouter);
  app.use('/api/v1/website', websiteRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/reports', reportsRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/system', systemRouter);
  app.use('/api/v1/parent', parentRouter);
  app.use('/api/v1/student-portal', studentPortalRouter);
  app.use('/api/v1/teacher-portal', teacherPortalRouter);
  app.use('/api/v1/documents', documentRouter);
  app.use('/api/v1/public/certificates', publicCertificateRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

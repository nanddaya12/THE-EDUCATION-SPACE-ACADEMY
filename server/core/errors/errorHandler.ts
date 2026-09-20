import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError.js';
import { logger } from '../logging/logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${req.method} ${req.originalUrl} - Status ${err.statusCode}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors || null
      }
    });
  }

  logger.error(`[UnhandledError] ${req.method} ${req.originalUrl}: ${err.message}`, { stack: err.stack });

  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
      statusCode: 500
    }
  });
};

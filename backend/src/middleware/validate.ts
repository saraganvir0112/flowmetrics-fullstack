import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler.js';
import { ApiErrorDetail } from '../types/api.js';

/**
 * Reusable Express middleware to validate request body using Zod schemas.
 * Returns consistent HTTP 400 with field-specific validation errors.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorDetails: ApiErrorDetail[] = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', errorDetails));
    }
    req.body = result.data;
    next();
  };
};

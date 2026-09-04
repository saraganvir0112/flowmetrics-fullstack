import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types/api.js';

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, statusCode: number = 500, code?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';
  const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const details = err instanceof AppError ? err.details : undefined;

  const response: ApiErrorResponse = {
    success: false,
    error: {
      message,
      ...(code ? { code } : {}),
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
};

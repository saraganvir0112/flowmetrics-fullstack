import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

/**
 * Authentication middleware.
 * Verifies JWT from the Authorization header (Bearer <token>)
 * and attaches decoded user to req.user.
 * Rejects missing or invalid tokens with HTTP 401.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Authentication token required', 401, 'UNAUTHORIZED'));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(
      new AppError('Invalid authorization header format. Expected Bearer <token>', 401, 'UNAUTHORIZED')
    );
  }

  const token = authHeader.split(' ')[1]?.trim();

  if (!token) {
    return next(new AppError('Authentication token missing', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role authorization middleware.
 * Ensures the authenticated user has the 'admin' role.
 * Rejects non-admin users with HTTP 403 Forbidden.
 * Must be preceded by authenticate middleware.
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new AppError('Authentication required before checking permissions', 401, 'UNAUTHORIZED'));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Admin role required for this action', 403, 'FORBIDDEN'));
  }

  next();
};

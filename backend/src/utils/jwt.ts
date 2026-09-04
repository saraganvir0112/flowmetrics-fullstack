import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtUserPayload } from '../types/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

/**
 * Signs a JWT with minimal safe claims (userId, email, role).
 * Never includes passwords or sensitive credentials.
 */
export const signToken = (payload: JwtUserPayload): string => {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * Verifies a JWT token and returns the typed payload.
 * Throws consistent HTTP 401 AppErrors on expired or malformed signatures.
 */
export const verifyToken = (token: string): JwtUserPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    if (!decoded.userId || !decoded.role) {
      throw new AppError('Invalid token payload structure', 401, 'INVALID_TOKEN');
    }
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
    }
    throw new AppError('Authentication token verification failed', 401, 'UNAUTHORIZED');
  }
};

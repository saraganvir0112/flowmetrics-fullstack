import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiErrorResponse } from '../types/api.js';

/**
 * Rate limiter middleware specifically protecting authentication endpoints.
 * Returns consistent JSON response with HTTP 429 status code.
 */
export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: 'Too many login attempts. Please try again later.',
        code: 'TOO_MANY_REQUESTS',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(429).json(errorResponse);
  },
});

/**
 * Rate limiter middleware protecting write endpoints (plans creation, updates, deletes).
 * Returns consistent JSON response with HTTP 429 status code.
 */
export const planWriteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 writes per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: 'Too many write requests. Please try again later.',
        code: 'TOO_MANY_REQUESTS',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(429).json(errorResponse);
  },
});

/**
 * Rate limiter middleware protecting blog write endpoints (create, update, delete).
 * Returns consistent JSON response with HTTP 429 status code.
 */
export const blogWriteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 writes per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: 'Too many blog write requests. Please try again later.',
        code: 'TOO_MANY_REQUESTS',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(429).json(errorResponse);
  },
});

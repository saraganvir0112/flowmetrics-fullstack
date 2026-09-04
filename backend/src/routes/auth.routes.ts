import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Admin login with rate limiting and payload validation
router.post('/login', authRateLimiter, validateBody(loginSchema), AuthController.login);

// Protected: Get current authenticated user profile
router.get('/me', authenticate, AuthController.getCurrentUser);

// Protected & Admin-Only: Verification test route
router.get('/admin-test', authenticate, requireAdmin, AuthController.adminTest);

export default router;

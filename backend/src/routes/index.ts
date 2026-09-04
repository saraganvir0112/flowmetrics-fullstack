import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import pricingRoutes from './pricing.routes.js';
import blogRoutes from './blog.routes.js';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/plans', pricingRoutes);
router.use('/blog', blogRoutes);

export default router;

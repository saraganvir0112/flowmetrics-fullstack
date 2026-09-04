import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { planWriteRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { createPricingPlanSchema, updatePricingPlanSchema } from '../schemas/pricing.schema.js';

const router = Router();

// Public: Get all published pricing plans
router.get('/', PricingController.getPublicPlans);

// Protected Admin: Get all pricing plans including drafts (MUST BE REGISTERED BEFORE /:id)
router.get('/admin/all', authenticate, requireAdmin, PricingController.getAllPlansAdmin);

// Public: Get single published pricing plan by ID (returns 404 for draft or non-existent)
router.get('/:id', PricingController.getPublicPlanById);

// Protected Admin: Create new pricing plan
router.post(
  '/',
  authenticate,
  requireAdmin,
  planWriteRateLimiter,
  validateBody(createPricingPlanSchema),
  PricingController.createPlan
);

// Protected Admin: Update existing pricing plan
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  planWriteRateLimiter,
  validateBody(updatePricingPlanSchema),
  PricingController.updatePlan
);

// Protected Admin: Delete existing pricing plan
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  planWriteRateLimiter,
  PricingController.deletePlan
);

export default router;

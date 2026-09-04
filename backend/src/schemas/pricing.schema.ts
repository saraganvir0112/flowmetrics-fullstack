import { z } from 'zod';

export const createPricingPlanSchema = z.object({
  name: z
    .string({ required_error: 'Plan name is required' })
    .trim()
    .min(1, 'Plan name cannot be empty')
    .max(100, 'Plan name cannot exceed 100 characters'),
  price: z
    .number({ required_error: 'Price is required' })
    .min(0, 'Price must be 0 or greater'),
  billingCycle: z.enum(['month', 'year'], {
    required_error: 'Billing cycle is required and must be month or year',
  }),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  features: z
    .array(
      z
        .string({ required_error: 'Feature item is required' })
        .trim()
        .min(1, 'Feature item cannot be empty')
        .max(200, 'Feature item cannot exceed 200 characters')
    )
    .min(1, 'At least one feature is required')
    .max(30, 'Cannot exceed 30 features'),
  highlighted: z.boolean().default(false),
  status: z.enum(['published', 'draft']).default('published'),
});

export const updatePricingPlanSchema = createPricingPlanSchema.partial();

export type CreatePricingPlanDTO = z.infer<typeof createPricingPlanSchema>;
export type UpdatePricingPlanDTO = z.infer<typeof updatePricingPlanSchema>;

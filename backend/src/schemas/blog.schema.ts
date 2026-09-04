import { z } from 'zod';

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogPostSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(180, 'Title cannot exceed 180 characters'),
  slug: z
    .string({ required_error: 'Slug is required' })
    .trim()
    .toLowerCase()
    .min(1, 'Slug cannot be empty')
    .max(200, 'Slug cannot exceed 200 characters')
    .regex(
      slugRegex,
      'Slug must be a lowercase URL-safe string with alphanumeric characters and hyphens only (e.g. "team-velocity-guide")'
    ),
  excerpt: z
    .string({ required_error: 'Excerpt is required' })
    .trim()
    .min(1, 'Excerpt cannot be empty')
    .max(500, 'Excerpt cannot exceed 500 characters'),
  content: z
    .string({ required_error: 'Content is required' })
    .trim()
    .min(1, 'Content cannot be empty'),
  thumbnail: z
    .string()
    .trim()
    .url('Thumbnail must be a valid URL')
    .optional()
    .or(z.literal('')),
  category: z
    .string()
    .trim()
    .max(80, 'Category cannot exceed 80 characters')
    .optional(),
  readTime: z
    .number()
    .int('Read time must be an integer')
    .positive('Read time must be at least 1 minute')
    .optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().optional().or(z.date().optional()),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostDTO = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostDTO = z.infer<typeof updateBlogPostSchema>;

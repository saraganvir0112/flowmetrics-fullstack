import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { blogWriteRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { createBlogPostSchema, updateBlogPostSchema } from '../schemas/blog.schema.js';

const router = Router();

// Public: Get all published blog posts (featured first, newest published next)
router.get('/', BlogController.getPublicPosts);

// Protected Admin: Get all blog posts including drafts (MUST BE REGISTERED BEFORE /:slug)
router.get('/admin/all', authenticate, requireAdmin, BlogController.getAllPostsAdmin);

// Protected Admin: Get single post by ID (MUST BE REGISTERED BEFORE /:slug)
router.get('/admin/:id', authenticate, requireAdmin, BlogController.getPostByIdAdmin);

// Protected Admin: Create new blog post
router.post(
  '/',
  authenticate,
  requireAdmin,
  blogWriteRateLimiter,
  validateBody(createBlogPostSchema),
  BlogController.createPost
);

// Protected Admin: Update existing blog post
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  blogWriteRateLimiter,
  validateBody(updateBlogPostSchema),
  BlogController.updatePost
);

// Protected Admin: Delete existing blog post
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  blogWriteRateLimiter,
  BlogController.deletePost
);

// Public: Get single published blog post by slug (MUST BE REGISTERED AFTER /admin/* routes)
router.get('/:slug', BlogController.getPublicPostBySlug);

export default router;

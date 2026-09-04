import mongoose from 'mongoose';
import { BlogPost, IBlogPost } from '../models/BlogPost.js';
import { CreateBlogPostInput, UpdateBlogPostInput } from '../types/blog.js';
import { AppError } from '../middleware/errorHandler.js';
import { sanitizeBlogContent } from '../utils/sanitize.js';

export class BlogService {
  /**
   * Retrieves all published blog posts for public visitors.
   * Prioritizes featured posts first, then newest publishedAt, then createdAt.
   * Drafts are strictly excluded at the database layer.
   */
  public static async getPublicPosts(): Promise<IBlogPost[]> {
    return BlogPost.find({ status: 'published' }).sort({
      featured: -1,
      publishedAt: -1,
      createdAt: -1,
    });
  }

  /**
   * Retrieves a published blog post by slug.
   * Returns 404 if post does not exist or is in draft status.
   */
  public static async getPublicPostBySlug(slug: string): Promise<IBlogPost> {
    const post = await BlogPost.findOne({
      slug: slug.toLowerCase().trim(),
      status: 'published',
    });

    if (!post) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    return post;
  }

  /**
   * Retrieves all blog posts for administrative management.
   * Includes both published and draft posts.
   */
  public static async getAllPostsAdmin(): Promise<IBlogPost[]> {
    return BlogPost.find().sort({ createdAt: -1 });
  }

  /**
   * Retrieves a single blog post by MongoDB ID for admin management.
   */
  public static async getPostByIdAdmin(id: string): Promise<IBlogPost> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    return post;
  }

  /**
   * Creates a new blog post.
   * Sanitizes HTML content on input to prevent XSS.
   * Enforces slug uniqueness and handles publishedAt lifecycle.
   */
  public static async createPost(data: CreateBlogPostInput): Promise<IBlogPost> {
    const cleanSlug = data.slug.toLowerCase().trim();

    const existingSlug = await BlogPost.findOne({ slug: cleanSlug });
    if (existingSlug) {
      throw new AppError('A blog post with this slug already exists', 409, 'SLUG_EXISTS');
    }

    const sanitizedContent = sanitizeBlogContent(data.content);

    let publishedAt: Date | undefined = undefined;
    if (data.status === 'published') {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
    }

    const post = await BlogPost.create({
      ...data,
      slug: cleanSlug,
      content: sanitizedContent,
      publishedAt,
    });

    return post;
  }

  /**
   * Updates an existing blog post.
   * Validates slug uniqueness if changed, sanitizes HTML content, and manages publishedAt transition.
   */
  public static async updatePost(id: string, data: UpdateBlogPostInput): Promise<IBlogPost> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    const updatePayload: Record<string, unknown> = { ...data };

    if (data.slug) {
      const cleanSlug = data.slug.toLowerCase().trim();
      if (cleanSlug !== existingPost.slug) {
        const duplicateSlug = await BlogPost.findOne({
          slug: cleanSlug,
          _id: { $ne: id },
        });
        if (duplicateSlug) {
          throw new AppError('A blog post with this slug already exists', 409, 'SLUG_EXISTS');
        }
        updatePayload.slug = cleanSlug;
      }
    }

    if (data.content !== undefined) {
      updatePayload.content = sanitizeBlogContent(data.content);
    }

    // Publishing transition logic
    if (data.status === 'published' && existingPost.status !== 'published') {
      // Transitioning draft -> published: set publishedAt if not already set
      if (!existingPost.publishedAt && !data.publishedAt) {
        updatePayload.publishedAt = new Date();
      }
    } else if (data.status === 'draft' && existingPost.status === 'published') {
      // Transitioning published -> draft: preserve historical publishedAt timestamp
      if (data.publishedAt === undefined) {
        updatePayload.publishedAt = existingPost.publishedAt;
      }
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    return updatedPost;
  }

  /**
   * Deletes a blog post by ID.
   */
  public static async deletePost(id: string): Promise<IBlogPost> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      throw new AppError('Blog post not found', 404, 'NOT_FOUND');
    }

    return post;
  }
}

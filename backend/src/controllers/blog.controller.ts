import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service.js';
import { ApiSuccessResponse } from '../types/api.js';
import { IBlogPost } from '../models/BlogPost.js';

export class BlogController {
  public static async getPublicPosts(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const posts = await BlogService.getPublicPosts();

      const response: ApiSuccessResponse<IBlogPost[]> = {
        success: true,
        data: posts,
        meta: {
          count: posts.length,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getPublicPostBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await BlogService.getPublicPostBySlug(slug);

      const response: ApiSuccessResponse<IBlogPost> = {
        success: true,
        data: post,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllPostsAdmin(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const posts = await BlogService.getAllPostsAdmin();

      const response: ApiSuccessResponse<IBlogPost[]> = {
        success: true,
        data: posts,
        meta: {
          count: posts.length,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getPostByIdAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const post = await BlogService.getPostByIdAdmin(id);

      const response: ApiSuccessResponse<IBlogPost> = {
        success: true,
        data: post,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const post = await BlogService.createPost(req.body);

      const response: ApiSuccessResponse<IBlogPost> = {
        success: true,
        data: post,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const post = await BlogService.updatePost(id, req.body);

      const response: ApiSuccessResponse<IBlogPost> = {
        success: true,
        data: post,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const post = await BlogService.deletePost(id);

      const response: ApiSuccessResponse<{ message: string; deletedId: string }> = {
        success: true,
        data: {
          message: 'Blog post deleted successfully',
          deletedId: post._id.toString(),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

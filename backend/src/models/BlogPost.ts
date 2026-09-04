import mongoose, { Document, Schema, Model } from 'mongoose';
import { BlogPostStatus } from '../types/blog.js';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  category?: string;
  readTime?: number;
  featured: boolean;
  status: BlogPostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [180, 'Blog title cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxlength: [500, 'Blog excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [80, 'Category cannot exceed 80 characters'],
    },
    readTime: {
      type: Number,
      min: [1, 'Read time must be at least 1 minute'],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid post status',
      },
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        const id = ret._id ? String(ret._id) : undefined;
        const safeRecord: Record<string, unknown> = { ...ret, id };
        delete safeRecord._id;
        delete safeRecord.__v;
        return safeRecord;
      },
    },
  }
);

// Compound index for public listings: featured posts first, then newest published
blogPostSchema.index({ status: 1, featured: -1, publishedAt: -1, createdAt: -1 });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

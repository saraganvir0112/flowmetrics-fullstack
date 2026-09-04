export type BlogPostStatus = 'published' | 'draft';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  category?: string;
  readTime?: number;
  featured: boolean;
  status: BlogPostStatus;
  publishedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  category?: string;
  readTime?: number;
  featured?: boolean;
  status?: BlogPostStatus;
  publishedAt?: Date | string;
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

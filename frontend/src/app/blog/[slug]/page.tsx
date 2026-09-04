'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { apiClient } from '@/lib/api';
import { sanitizeFrontendHtml } from '@/lib/sanitize';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Star,
  FileQuestion,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicBlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await apiClient<BlogPost>(`/blog/${slug}`);
        if (data) {
          setPost(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-400" />
            <span>Loading article...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center bg-[#0D1422] border border-[#1A2438] p-8 rounded-2xl shadow-xl">
            <FileQuestion className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h1 className="text-lg font-bold text-white mb-2">Article Not Found</h1>
            <p className="text-xs text-slate-400 mb-6">
              The requested article does not exist, has been removed, or is currently in draft status.
            </p>
            <Link href="/#blog">
              <Button variant="primary" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Blog Feed</span>
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanHtml = sanitizeFrontendHtml(post.content);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          {/* Back Navigation */}
          <Link
            href="/#blog"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-8 group font-mono"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Insights</span>
          </Link>

          {/* Metadata Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {post.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/60 border border-blue-800/40 text-blue-300 font-mono">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span>{post.category}</span>
                </span>
              )}
              {post.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-800/40 text-amber-300 font-mono">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>Featured Post</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pb-6 border-b border-[#1A2438]">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{post.readTime} min read</span>
                </span>
              )}
            </div>
          </header>

          {/* Excerpt Lead */}
          {post.excerpt && (
            <p className="text-base text-slate-300 leading-relaxed font-medium mb-8 p-4 rounded-xl bg-[#0D1422] border border-[#1A2438] italic">
              &ldquo;{post.excerpt}&rdquo;
            </p>
          )}

          {/* Article Body (Double Defense Sanitization) */}
          <div
            className="prose prose-invert prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-300 space-y-4"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Star,
  Tag,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { apiClient } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await apiClient<BlogPost[]>('/blog');
      // Limit to 3-6 posts as required
      setPosts((data || []).slice(0, 6));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await apiClient<BlogPost[]>('/blog');
        if (!ignore) {
          setPosts((data || []).slice(0, 6));
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load blog posts from server');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="blog" className="py-24 md:py-32 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-4">
            Engineering Telemetry Insights
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Perspectives on remote productivity and engineering velocity.
          </h2>
          <p className="text-base text-slate-400">
            Field notes, telemetry patterns, and team management practices from the Flowmetrics engineering team.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0D1422] border border-[#1A2438] p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="pt-4 border-t border-[#1A2438] flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-amber-200 mb-1">Unable to Load Blog Posts</h3>
            <p className="text-xs text-amber-300/80 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchPosts(true)} className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connecting</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0D1422] border border-[#1A2438] text-center">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Articles Published Yet</h3>
            <p className="text-xs text-slate-400 mb-4">
              Published articles written in the admin TipTap editor will appear here automatically.
            </p>
            <Link href="/admin/blog/new">
              <Button variant="outline" size="sm">
                Write First Post
              </Button>
            </Link>
          </div>
        )}

        {/* Dynamic Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => {
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="rounded-2xl bg-[#0D1422] border border-[#1A2438] hover:border-[#26354F] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20"
                >
                  <div>
                    {/* Tags & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        {post.category && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 font-mono">
                            <Tag className="w-3 h-3" />
                            {post.category}
                          </span>
                        )}
                      </div>

                      {post.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-800/40 text-amber-300">
                          <Star className="w-2.5 h-2.5 fill-amber-300" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white tracking-tight mb-2.5 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-4 border-t border-[#1A2438] flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-blue-300 transition-colors font-medium">
                      <span>Read article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

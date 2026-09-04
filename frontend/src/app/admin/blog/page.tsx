'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { authApiClient } from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  FileText,
  Plus,
  Search,
  Star,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function AdminBlogPage() {
  const { isAuthorized, isChecking, logout } = useAdminAuth();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshAdminPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApiClient<BlogPost[]>('/blog/admin/all');
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    let ignore = false;

    authApiClient<BlogPost[]>('/blog/admin/all')
      .then((data) => {
        if (!ignore) {
          setPosts(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
          setPosts([]);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthorized]);

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await authApiClient<void>(`/blog/${id}`, {
        method: 'DELETE',
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting post');
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center p-10">
        <div className="text-center text-xs text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
          <span>Verifying administrative session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 pb-16">
      <AdminHeader onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-blue-400" />
              <span>Blog Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Create, publish, and manage engineering articles and hybrid team insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshAdminPosts()}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#0F172A] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-lg bg-amber-950/40 border border-amber-800/50 p-4 mb-6 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Blog Post Table / List */}
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-[#0F172A]/70 p-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
            <span>Loading articles...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0F172A]/70 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No blog posts found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by creating your first article with the TipTap editor.
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Article</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-[#0F172A]/70 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Title & Slug</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Featured</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate">{post.title}</div>
                        <div className="font-mono text-[11px] text-slate-500 truncate mt-0.5">
                          /{post.slug}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {post.category ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px]">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {post.category}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            post.status === 'published'
                              ? 'bg-emerald-950/70 border-emerald-800/50 text-emerald-400'
                              : 'bg-amber-950/70 border-amber-800/50 text-amber-400'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {post.featured ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {post.publishedAt ? (
                          new Date(post.publishedAt).toLocaleDateString()
                        ) : (
                          <span className="text-slate-600">Unpublished</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {post.status === 'published' && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                              title="View Public Post"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="p-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit Post"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 rounded hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

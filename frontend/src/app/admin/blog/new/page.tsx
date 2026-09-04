'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TipTapEditor } from '@/components/admin/TipTapEditor';
import { authApiClient } from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { BlogPost } from '@/types/blog';
import {
  ArrowLeft,
  Save,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Tag,
  Star,
  RefreshCw,
} from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { isAuthorized, isChecking } = useAdminAuth();

  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [content, setContent] = useState<string>('<p>Write your article here...</p>');
  const [category, setCategory] = useState<string>('Engineering');
  const [readTime, setReadTime] = useState<number>(5);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const generateSlug = () => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    const finalStatus = targetStatus || status;
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        title,
        slug: slug.trim().toLowerCase(),
        excerpt,
        content,
        category: category.trim() || undefined,
        readTime: Number(readTime) || 1,
        thumbnail: thumbnail.trim() || undefined,
        featured,
        status: finalStatus,
      };

      await authApiClient<BlogPost>('/blog', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Blog post successfully created as ${finalStatus}!`);
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating blog post');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('published')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Now</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-6">Create New Article</h1>

        {/* Alerts */}
        {error && (
          <div className="rounded-lg bg-amber-950/40 border border-amber-800/50 p-4 mb-6 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Creation Error</div>
              <div className="mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/50 p-4 mb-6 flex items-start gap-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Success</div>
              <div className="mt-0.5">{successMsg}</div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="space-y-6 bg-[#0F172A]/70 border border-slate-800 p-6 rounded-xl shadow-xl backdrop-blur-sm">
          {/* Title & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Article Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How Remote Teams Can Reduce Meeting Overload"
                className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate from Title</span>
                </button>
              </div>
              <div className="flex items-center rounded-lg bg-[#0B0F19] border border-slate-800 overflow-hidden focus-within:border-blue-500">
                <span className="px-3 text-xs text-slate-500 font-mono select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="how-remote-teams-can-reduce-meeting-overload"
                  className="w-full bg-transparent py-2.5 pr-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Excerpt / Summary <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief preview summary shown on blog cards and search results (max 500 characters)..."
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category, Read Time, Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Category</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Productivity, Analytics"
                className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Read Time (mins)</span>
              </label>
              <input
                type="number"
                min={1}
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Thumbnail URL</span>
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Controls: Featured & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B0F19] border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Star className={`w-3.5 h-3.5 ${featured ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                <span>Feature on Blog Hero</span>
              </div>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* TipTap Rich Text Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Article Content <span className="text-rose-400">*</span>
            </label>
            <TipTapEditor content={content} onChange={(html) => setContent(html)} />
          </div>
        </div>
      </div>
    </div>
  );
}

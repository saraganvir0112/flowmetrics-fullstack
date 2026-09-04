'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { setAuthSession, isAuthenticated } from '@/lib/authSession';
import { AuthResponseData } from '@/types/auth';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // If already authenticated, automatically redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin/blog');
    }
  }, [router]);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient<AuthResponseData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!data || !data.token) {
        throw new Error('Authentication response did not contain a valid session token.');
      }

      // Store token and user in sessionStorage (never stores password)
      setAuthSession(data.token, data.user);

      // Redirect to the admin blog management view
      router.push('/admin/blog');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials or login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-blue-600/30 selection:text-blue-200">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-teal-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Flowmetrics</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0D1422] border border-[#1A2438] rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/40 relative z-10 backdrop-blur-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 shadow-lg shadow-blue-500/20 mb-4">
            <Activity className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <span className="block text-xs font-mono font-semibold tracking-wider uppercase text-blue-400 mb-1.5">
            Admin Workspace
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to Flowmetrics
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Enter administrative credentials to manage pricing plans, engineering blog posts, and live telemetry.
          </p>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Authentication Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                autoComplete="email"
                placeholder="admin@flowmetrics.dev"
                disabled={loading}
                className={`w-full bg-[#0B0F19] border ${
                  fieldErrors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#1A2438] focus:border-blue-500'
                } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-400 mt-1 pl-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                autoComplete="current-password"
                placeholder="••••••••••••"
                disabled={loading}
                className={`w-full bg-[#0B0F19] border ${
                  fieldErrors.password ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#1A2438] focus:border-blue-500'
                } rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-400 mt-1 pl-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Security notice */}
      <p className="text-center text-xs text-slate-500 mt-6 font-mono z-10">
        Flowmetrics Full-Stack Hiring Challenge • Authorized Admin Portal
      </p>
    </div>
  );
}

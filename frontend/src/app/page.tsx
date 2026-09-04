'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { HealthCheckData } from '@/types/api';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Layout,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<HealthCheckData>('/health');
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      setHealth(null);
      setError(err instanceof Error ? err.message : 'Failed to reach API server');
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 border border-blue-800/40 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Milestone 1 • Foundation & Architecture
          </div>
        </div>

        {/* Brand Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Flowmetrics
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Team productivity and workload analytics SaaS platform for remote and hybrid teams.
            The repository architecture and dual-app stack are successfully initialized.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Frontend Card */}
          <div className="rounded-xl bg-[#0F172A]/70 border border-slate-800/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Frontend Workspace</h2>
                  <p className="text-xs text-slate-400">apps / frontend</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                Ready
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next.js 16 + React 19 App Router</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tailwind CSS + Dark B2B Theme Tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Type-safe API Client & Contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lucide Icons & Strict TypeScript</span>
              </li>
            </ul>
          </div>

          {/* Backend Card */}
          <div className="rounded-xl bg-[#0F172A]/70 border border-slate-800/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Backend Workspace</h2>
                  <p className="text-xs text-slate-400">apps / backend</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                Ready
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Node.js + Express + TypeScript</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standardized JSON Error & Response Middleware</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zod Environment Configuration Loader</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Health Monitoring Endpoint (<code className="text-teal-300">/api/health</code>)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Live System Integration Probe */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">Backend Connectivity Check</h3>
                <p className="text-xs text-slate-400">
                  Target: <code className="font-mono text-slate-300">http://localhost:5000/api/health</code>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastChecked && (
                <span className="text-xs text-slate-500">Checked at {lastChecked}</span>
              )}
              <button
                onClick={checkHealth}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Checking...' : 'Ping API'}
              </button>
            </div>
          </div>

          <div className="pt-4">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Connecting to backend API...
              </div>
            ) : error ? (
              <div className="rounded-lg bg-amber-950/40 border border-amber-800/40 p-3.5 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-amber-200">API Server Offline or Unreachable</div>
                  <div className="text-xs text-amber-300/80 mt-0.5">
                    {error}. Ensure the backend server is running via <code className="font-mono bg-amber-900/40 px-1 py-0.5 rounded">npm run dev:backend</code>.
                  </div>
                </div>
              </div>
            ) : health ? (
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>API Online & Healthy</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Service</span>
                    <span className="text-slate-200 font-semibold">{health.service}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Status</span>
                    <span className="text-emerald-400 font-semibold">{health.status}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Environment</span>
                    <span className="text-slate-200 font-semibold">{health.environment}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Uptime</span>
                    <span className="text-slate-200 font-semibold">{health.uptime}s</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Milestone Roadmap Indicator */}
        <div className="mt-8 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Next Milestone: Database, Authentication & Role Authorization</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <span>Milestone 1 Complete</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </main>
  );
}

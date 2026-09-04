'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const subscribe = () => () => {};

// Illustrative product-demo telemetry datasets
const sprintVelocityData = [
  { sprint: 'Sprint 24', planned: 52, delivered: 49, carryover: 3 },
  { sprint: 'Sprint 25', planned: 56, delivered: 55, carryover: 1 },
  { sprint: 'Sprint 26', planned: 60, delivered: 64, carryover: 0 },
  { sprint: 'Sprint 27', planned: 58, delivered: 61, carryover: 0 },
  { sprint: 'Sprint 28', planned: 65, delivered: 68, carryover: 2 },
  { sprint: 'Sprint 29', planned: 68, delivered: 72, carryover: 1 },
];

const categoryHoursData = [
  { week: 'Wk 1', deepWork: 480, codeReview: 140, architecture: 90, meetings: 65 },
  { week: 'Wk 2', deepWork: 510, codeReview: 160, architecture: 110, meetings: 55 },
  { week: 'Wk 3', deepWork: 540, codeReview: 130, architecture: 125, meetings: 50 },
  { week: 'Wk 4', deepWork: 580, codeReview: 175, architecture: 130, meetings: 45 },
];

export function AnalyticsShowcase() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [activeTab, setActiveTab] = useState<'velocity' | 'allocation'>('velocity');

  return (
    <section id="analytics" className="py-24 md:py-32 bg-[#05080F] border-t border-[#1A2438] relative">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="blue" size="md" className="mb-4">
            Product Showcase
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            A clearer picture of work.
          </h2>
          <p className="text-base text-slate-400">
            Eliminate subjective status meetings. View high-signal velocity charts, deep-work allocations, and capacity trends backed by automated telemetry.
          </p>
        </div>

        {/* Dashboard Showcase Container */}
        <div className="rounded-2xl bg-[#0D1422] border border-[#1A2438] p-6 sm:p-8 shadow-2xl">
          {/* Top Controls & Tab Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#1A2438]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Sprint Telemetry & Allocation Explorer
                </h3>
                <p className="text-xs text-slate-400">Cross-team aggregated velocity vs plan</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-[#1A2438]">
              <button
                type="button"
                onClick={() => setActiveTab('velocity')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'velocity'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sprint Velocity Trends
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('allocation')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'allocation'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Workload Time Breakdown
              </button>
            </div>
          </div>

          {/* Tab 1: Sprint Velocity */}
          {activeTab === 'velocity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Planned vs Delivered Ratio
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">104.2%</span>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    +6.4% consistency gain
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Sprint Carryover
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">1.2 pts avg</span>
                  <span className="text-xs text-teal-400 font-semibold block mt-1">
                    Historical low across 6 sprints
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Mean Pull Request Turnaround
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">3.8 hours</span>
                  <span className="text-xs text-cyan-400 font-semibold block mt-1">
                    Zero blocking review queues
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="p-4 rounded-xl bg-[#111A2E]/40 border border-[#1A2438]">
                <h4 className="text-xs font-semibold text-slate-300 font-mono mb-4 uppercase tracking-wider">
                  Story Points: Planned vs Actual Delivered
                </h4>
                <div className="h-64 sm:h-72 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sprintVelocityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="sprint" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0D1422',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#F8FAFC',
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                          formatter={(value) => <span className="text-slate-300 font-mono capitalize">{value}</span>}
                        />
                        <Bar dataKey="planned" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Planned Points" />
                        <Bar dataKey="delivered" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Delivered Points" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Workload Breakdown */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Monthly Deep Focus Time
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">2,110h</span>
                  <span className="text-xs text-blue-400 font-semibold block mt-1">
                    68.5% of total logged hours
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Meeting Friction Index
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">11.4%</span>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    -32% reduction vs baseline
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#111A2E]/60 border border-[#1A2438]">
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                    Code Review Allocation
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">605h</span>
                  <span className="text-xs text-teal-400 font-semibold block mt-1">
                    Evenly distributed across tiers
                  </span>
                </div>
              </div>

              {/* Multi-Line Hours Chart */}
              <div className="p-4 rounded-xl bg-[#111A2E]/40 border border-[#1A2438]">
                <h4 className="text-xs font-semibold text-slate-300 font-mono mb-4 uppercase tracking-wider">
                  Engineering Hours by Activity Type (Weekly Trend)
                </h4>
                <div className="h-64 sm:h-72 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={categoryHoursData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="week" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0D1422',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#F8FAFC',
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                          formatter={(value) => <span className="text-slate-300 font-mono capitalize">{value}</span>}
                        />
                        <Line type="monotone" dataKey="deepWork" stroke="#3B82F6" strokeWidth={2.5} name="Deep Work" />
                        <Line type="monotone" dataKey="codeReview" stroke="#14B8A6" strokeWidth={2} name="Code Review" />
                        <Line type="monotone" dataKey="architecture" stroke="#818CF8" strokeWidth={2} name="Architecture" />
                        <Line type="monotone" dataKey="meetings" stroke="#F59E0B" strokeWidth={2} name="Meetings" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#1A2438] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
            <span>* Illustrative product-demo analytics. All numbers represent sample engineering sprint telemetry.</span>
            <span className="text-blue-400 mt-2 sm:mt-0 font-semibold">Integrates with GitHub, GitLab & Jira</span>
          </div>
        </div>
      </div>
    </section>
  );
}

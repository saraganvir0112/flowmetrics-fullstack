'use client';

import { useSyncExternalStore } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Zap,
  Users,
  CheckCircle2,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

const subscribe = () => () => {};

// Illustrative product-demo data
const demoActivityData = [
  { day: 'Mon', focusHours: 38, reviewHours: 12, velocity: 84 },
  { day: 'Tue', focusHours: 44, reviewHours: 14, velocity: 92 },
  { day: 'Wed', focusHours: 49, reviewHours: 18, velocity: 96 },
  { day: 'Thu', focusHours: 42, reviewHours: 15, velocity: 89 },
  { day: 'Fri', focusHours: 46, reviewHours: 16, velocity: 94 },
  { day: 'Sat', focusHours: 14, reviewHours: 4, velocity: 76 },
  { day: 'Sun', focusHours: 8, reviewHours: 2, velocity: 70 },
];

const teamWorkload = [
  { name: 'Core Engine', members: 6, capacity: 92, status: 'Optimal' },
  { name: 'Data Pipeline', members: 4, capacity: 98, status: 'Peak' },
  { name: 'Frontend Platform', members: 5, capacity: 84, status: 'Healthy' },
  { name: 'Infrastructure', members: 3, capacity: 78, status: 'Healthy' },
];

export function HeroDashboard() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div className="w-full rounded-2xl bg-[#0D1422] border border-[#1A2438] p-4 sm:p-6 shadow-2xl shadow-blue-950/20 text-slate-100">
      {/* Top Window Chrome / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1A2438]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="font-semibold text-white">workspace / engineering-sprint-28</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300">
              Live Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Sync: 12s ago
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Productivity Score */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#111A2E]/70 border border-[#1A2438]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Productivity Score</span>
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">89.4</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Target: 85.0 / Sprint avg</p>
        </div>

        {/* Tracked Hours */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#111A2E]/70 border border-[#1A2438]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tracked Focus Time</span>
            <Clock className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">1,428h</span>
            <span className="text-[11px] font-semibold text-teal-400">94% of cap</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">232h deep work logged</p>
        </div>

        {/* Sprint Velocity */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#111A2E]/70 border border-[#1A2438]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Sprint Velocity</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">1.34x</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Ahead of roadmap schedule</p>
        </div>

        {/* Active Contributors */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#111A2E]/70 border border-[#1A2438]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Team</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">18 / 18</span>
            <span className="text-[11px] font-semibold text-cyan-400">Balanced</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">0 bottleneck alerts</p>
        </div>
      </div>

      {/* Main Chart + Workload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Activity Area Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#111A2E]/50 border border-[#1A2438] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Weekly Velocity & Deep Work Hours
              </h4>
              <p className="text-[11px] text-slate-400">Aggregated telemetry across branches & tasks</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Focus Time
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-400 inline-block" /> Review Time
              </span>
            </div>
          </div>

          <div className="h-52 w-full min-h-[200px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1E293B' }}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1422',
                      borderColor: '#1E293B',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="focusHours"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="reviewHours"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#reviewGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Initializing chart telemetry...
              </div>
            )}
          </div>
        </div>

        {/* Team Workload Distribution Column */}
        <div className="p-4 rounded-xl bg-[#111A2E]/50 border border-[#1A2438]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Team Workload
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">4 Pods</span>
          </div>

          <div className="space-y-3">
            {teamWorkload.map((team) => (
              <div key={team.name} className="p-2.5 rounded-lg bg-[#0D1422] border border-[#1A2438]/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{team.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      team.capacity > 95
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {team.capacity}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      team.capacity > 95 ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-teal-400'
                    }`}
                    style={{ width: `${team.capacity}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{team.members} engineers</span>
                  <span className="text-slate-400">{team.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Micro Status Notice */}
          <div className="mt-3.5 pt-3 border-t border-[#1A2438] flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>0 critical blockers detected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

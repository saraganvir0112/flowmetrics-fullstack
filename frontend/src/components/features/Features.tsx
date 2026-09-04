'use client';

import {
  Clock,
  Activity,
  Layers,
  FileSpreadsheet,
  Target,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const smallFeatures = [
  {
    icon: Clock,
    title: 'Automated Time Tracking',
    description:
      'Passive background time mapping across git branches, pull requests, and Jira tasks without intrusive keystroke logging.',
    accent: 'blue',
  },
  {
    icon: Activity,
    title: 'Workload Intelligence',
    description:
      'Proactive heuristics detect burnout risks, review backlogs, and unequal distribution before sprint deadlines slip.',
    accent: 'teal',
  },
  {
    icon: Layers,
    title: 'Project Velocity Insights',
    description:
      'Track real vs planned story point delivery across distributed squads with normalized commit telemetry.',
    accent: 'cyan',
  },
  {
    icon: FileSpreadsheet,
    title: 'Executive Team Reporting',
    description:
      'Generate clear, board-ready weekly digests and asynchronous standup reports automatically.',
    accent: 'indigo',
  },
  {
    icon: Target,
    title: 'Milestone & Goal Alignment',
    description:
      'Connect daily code merges and focus hours directly to quarterly engineering OKRs and release goals.',
    accent: 'emerald',
  },
  {
    icon: Bell,
    title: 'Contextual Smart Alerts',
    description:
      'Real-time alerts in Slack when pull requests wait longer than 24 hours or engineers exceed safe overtime thresholds.',
    accent: 'amber',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-4">
            Product Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Built for engineering leaders who value transparency, not surveillance.
          </h2>
          <p className="text-base text-slate-400">
            Flowmetrics aggregates developer workflow telemetry into clean, actionable intelligence that respects engineer focus and autonomy.
          </p>
        </div>

        {/* Large Feature Spotlight */}
        <div className="rounded-2xl bg-[#0D1422] border border-[#1A2438] p-6 sm:p-10 mb-12 shadow-xl shadow-blue-950/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Spotlight Text */}
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="blue" size="sm">
                Spotlight Architecture
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Turn work data into decisions.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Most productivity tools force teams into either manual timesheet guesswork or intrusive monitoring.
                Flowmetrics synthesizes data from version control, task trackers, and calendar events into objective workload balance telemetry.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-300">
                    Proactive capacity rebalancing before engineer burnout
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-300">
                    Real-time project health indicators calibrated against roadmap velocity
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-300">
                    Zero client-side agent spyware or invasive screen capture
                  </span>
                </div>
              </div>
            </div>

            {/* Spotlight Interactive Visualization */}
            <div className="lg:col-span-7 bg-[#111A2E]/70 border border-[#1A2438] rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1A2438] mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-white font-mono">
                    Engineering Capacity & Health Matrix
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40 text-emerald-300">
                  Healthy: 94.2%
                </span>
              </div>

              {/* Mini Metrics Matrix */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 rounded-lg bg-[#0D1422] border border-[#1A2438]">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Focus Ratio</span>
                  <span className="text-base font-bold text-white font-mono">72.4%</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">Optimal (&gt;65%)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D1422] border border-[#1A2438]">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">PR Cycle Time</span>
                  <span className="text-base font-bold text-white font-mono">4.1h</span>
                  <span className="text-[10px] text-teal-400 block font-mono">-18% vs last sprint</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D1422] border border-[#1A2438]">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Meeting Load</span>
                  <span className="text-base font-bold text-white font-mono">14.2%</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Low drag</span>
                </div>
              </div>

              {/* Workload Bars */}
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>API & Microservices Architecture</span>
                    <span className="font-mono text-slate-400">88% Capacity</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Web Platform & Design Systems</span>
                    <span className="font-mono text-slate-400">79% Capacity</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" style={{ width: '79%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Observability & Infrastructure</span>
                    <span className="font-mono text-slate-400">91% Capacity</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Feature Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {smallFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-xl bg-[#0D1422] border border-[#1A2438] p-6 hover:border-[#28354E] hover:bg-[#111A2E]/60 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#111A2E] border border-[#1A2438] flex items-center justify-center mb-5 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2 tracking-tight">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

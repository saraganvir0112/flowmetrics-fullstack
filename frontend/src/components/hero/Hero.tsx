'use client';

import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroDashboard } from './HeroDashboard';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-teal-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Top Pill */}
          <motion.div
            initial={false}
            animate={{ opacity: [0.7, 1], y: [-8, 0] }}
            transition={{ duration: 0.4 }}
            className="inline-block mb-5"
          >
            <Badge variant="blue" size="md" className="gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Team Productivity Intelligence for Modern Distributed Teams</span>
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={false}
            animate={{ opacity: [0.7, 1], y: [12, 0] }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 font-sans"
          >
            Know where your team&apos;s work{' '}
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              really goes.
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={false}
            animate={{ opacity: [0.7, 1], y: [12, 0] }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal"
          >
            Automated time tracking, real-time workload intelligence, and sprint velocity metrics.
            Flowmetrics gives engineering and product leaders deep distributed team visibility without invasive surveillance or manual timesheets.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: [0.7, 1], y: [12, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a href="#pricing">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Start free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#analytics">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Play className="w-4 h-4 text-blue-400 fill-blue-400/30" />
                <span>See how it works</span>
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Crisp Dashboard Visualization */}
        <motion.div
          initial={false}
          animate={{ opacity: [0.8, 1], y: [20, 0] }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-5xl mx-auto"
        >
          <HeroDashboard />
          <p className="text-center text-[11px] text-slate-500 mt-3 font-mono">
            * Illustrative product-demo visualization. Metrics and values reflect fictional team telemetry.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

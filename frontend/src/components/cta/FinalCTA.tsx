import { ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-[#05080F] border-t border-[#1A2438] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-teal-500/10 to-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Give your team a clearer way to work.
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Measure real engineering velocity, balance team workloads, and eliminate manual reporting overhead with Flowmetrics telemetry.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <span>Start free</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <a href="mailto:contact@flowmetrics.internal">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Talk to sales</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

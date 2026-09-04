import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

const testimonials = [
  {
    quote:
      'Flowmetrics replaced our subjective weekly sprint estimation arguments with objective telemetry. We immediately spotted two pods nearing burnout and rebalanced our roadmap before we hit a wall.',
    author: 'Maya Shah',
    title: 'VP Operations',
    company: 'Northstar Labs',
    metric: '32% reduction in unassigned blockers',
  },
  {
    quote:
      'The greatest win was eliminating 6 hours of weekly status meetings. Our engineering managers now rely on Flowmetrics async digests to stay ahead of PR bottlenecks without interrupting deep work.',
    author: 'Liam Vance',
    title: 'Head of Engineering',
    company: 'Vertex Cloud',
    metric: '4.1h average PR cycle turnaround',
  },
  {
    quote:
      'As an asynchronous, distributed team across 9 timezones, Flowmetrics gives us the visibility of a co-located team without requiring anyone to install invasive keystroke or webcam trackers.',
    author: 'Elena Rostova',
    title: 'Director of Product',
    company: 'Arcflow Technologies',
    metric: '94% sprint predictability score',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#05080F] border-t border-[#1A2438] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-4">
            Customer Feedback (Fictional Demo)
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Trusted by distributed engineering organizations.
          </h2>
          <p className="text-base text-slate-400">
            How leaders use Flowmetrics telemetry to protect developer focus and build sustainable engineering rhythm.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="rounded-2xl bg-[#0D1422] border border-[#1A2438] p-7 sm:p-8 flex flex-col justify-between hover:border-[#26354F] transition-all duration-200 group"
            >
              <div>
                {/* Rating & Metric Pill */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300">
                    {item.metric}
                  </span>
                </div>

                {/* Quote Body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-8">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#1A2438]">
                <Avatar name={item.author} size="md" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {item.author}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {item.title} • <span className="text-slate-300">{item.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

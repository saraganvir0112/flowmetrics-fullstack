'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, AlertCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { PricingPlan } from '@/types/pricing';
import { apiClient } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function PricingSection() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async (showLoadingState = false) => {
    if (showLoadingState) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await apiClient<PricingPlan[]>('/plans');
      setPlans(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing plans from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await apiClient<PricingPlan[]>('/plans');
        if (!ignore) {
          setPlans(data || []);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load pricing plans from server');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="blue" size="md" className="mb-4">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Predictable plans that scale with your engineering team.
          </h2>
          <p className="text-base text-slate-400">
            All plans include core workload intelligence, asynchronous reports, and native version-control integrations.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#0D1422] border border-[#1A2438] p-8 space-y-6"
              >
                <div className="space-y-2">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-3 pt-4 border-t border-[#1A2438]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-amber-200 mb-1">Unable to Load Plans</h3>
            <p className="text-xs text-amber-300/80 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchPlans(true)} className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connecting</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#0D1422] border border-[#1A2438] text-center">
            <Zap className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Pricing Plans Published</h3>
            <p className="text-xs text-slate-400 mb-4">
              Published plans configured by the administrator will automatically appear here.
            </p>
            <Button variant="outline" size="sm" onClick={() => fetchPlans(true)}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh
            </Button>
          </div>
        )}

        {/* Dynamic Plans Grid */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => {
              const isHighlighted = plan.highlighted === true;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isHighlighted
                      ? 'bg-gradient-to-b from-[#111A2E] to-[#0D1422] border-2 border-blue-500/80 shadow-2xl shadow-blue-500/15 md:-translate-y-2'
                      : 'bg-[#0D1422] border border-[#1A2438] hover:border-[#26354F]'
                  }`}
                >
                  {/* Highlighted Badge */}
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-md shadow-blue-600/40 uppercase tracking-wider font-mono">
                        <Sparkles className="w-3 h-3 fill-white" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed min-h-[40px]">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-1.5 pb-6 mb-6 border-b border-[#1A2438]">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                        ${plan.price}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        /{plan.billingCycle === 'year' ? 'year' : 'month'}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        What&apos;s included:
                      </p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <div
                            className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                              isHighlighted ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-emerald-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <div className="pt-2">
                    <Button
                      variant={isHighlighted ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full justify-center"
                    >
                      <span>Get started with {plan.name}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

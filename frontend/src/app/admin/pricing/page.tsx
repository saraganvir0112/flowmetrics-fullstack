'use client';

import { useState, useEffect } from 'react';
import { PricingPlan, BillingCycle, PricingPlanStatus } from '@/types/pricing';
import { authApiClient } from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  DollarSign,
  Plus,
  Search,
  Sparkles,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  PlusCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PlanFormData {
  name: string;
  price: number | '';
  billingCycle: BillingCycle;
  description: string;
  features: string[];
  highlighted: boolean;
  status: PricingPlanStatus;
}

const defaultFormData: PlanFormData = {
  name: '',
  price: 29,
  billingCycle: 'month',
  description: '',
  features: ['Up to 10 active team members', 'Automated Git & Jira time mapping'],
  highlighted: false,
  status: 'published',
};

export default function AdminPricingPage() {
  const { isAuthorized, isChecking, logout } = useAdminAuth();

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(defaultFormData);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApiClient<PricingPlan[]>('/plans/admin/all');
      setPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    let ignore = false;

    authApiClient<PricingPlan[]>('/plans/admin/all')
      .then((data) => {
        if (!ignore) {
          setPlans(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans');
          setPlans([]);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthorized]);

  const openCreateModal = () => {
    setEditingPlanId(null);
    setFormData(defaultFormData);
    setModalError(null);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  const openEditModal = (plan: PricingPlan) => {
    setEditingPlanId(plan.id);
    setFormData({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      description: plan.description || '',
      features: [...plan.features],
      highlighted: plan.highlighted,
      status: plan.status,
    });
    setModalError(null);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlanId(null);
    setModalError(null);
  };

  const handleAddFeature = () => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    if (trimmed.length < 2) {
      setModalError('Feature text must be at least 2 characters.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setNewFeatureText('');
    setModalError(null);
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    // Validation
    if (!formData.name.trim()) {
      setModalError('Plan name is required.');
      return;
    }
    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setModalError('Price must be a valid non-negative number.');
      return;
    }
    if (formData.features.length === 0) {
      setModalError('At least one plan feature is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        billingCycle: formData.billingCycle,
        description: formData.description.trim() || undefined,
        features: formData.features,
        highlighted: formData.highlighted,
        status: formData.status,
      };

      if (editingPlanId) {
        const updated = await authApiClient<PricingPlan>(`/plans/${editingPlanId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setPlans((prev) => prev.map((p) => (p.id === editingPlanId ? updated : p)));
      } else {
        const created = await authApiClient<PricingPlan>('/plans', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setPlans((prev) => [...prev, created]);
      }

      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save pricing plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (plan: PricingPlan) => {
    const nextStatus: PricingPlanStatus = plan.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await authApiClient<PricingPlan>(`/plans/${plan.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating plan status');
    }
  };

  const handleToggleHighlight = async (plan: PricingPlan) => {
    try {
      const updated = await authApiClient<PricingPlan>(`/plans/${plan.id}`, {
        method: 'PUT',
        body: JSON.stringify({ highlighted: !plan.highlighted }),
      });
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating highlight status');
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the "${name}" plan?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await authApiClient<void>(`/plans/${id}`, {
        method: 'DELETE',
      });
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting plan');
    } finally {
      setDeletingId(null);
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

  const filteredPlans = plans.filter((plan) => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      plan.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 pb-16">
      <AdminHeader onLogout={logout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <span>Pricing Plans Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure dynamic pricing tiers, repeatable feature checklists, billing cycles, and highlight badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPlans()}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Refresh plans list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateModal}
              className="gap-2 shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        </div>

        {/* Toolbar: Search + Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by plan name, features, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1422] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#0D1422] p-1 rounded-lg border border-slate-800">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-xs rounded-md font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchPlans()}
              className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-[11px] font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#0D1422] border border-[#1A2438] rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-800 rounded w-1/3" />
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-4/5" />
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPlans.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-[#0D1422] border border-slate-800/80 max-w-lg mx-auto">
            <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Pricing Plans Found</h3>
            <p className="text-xs text-slate-400 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'No plans match the current filter and search query.'
                : 'Get started by creating your first dynamic pricing plan tier.'}
            </p>
            <Button variant="primary" size="sm" onClick={openCreateModal} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        )}

        {/* Plans Grid */}
        {!loading && !error && filteredPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const isPublished = plan.status === 'published';
              const isDeleting = deletingId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all bg-[#0D1422] border ${
                    plan.highlighted ? 'border-blue-500/80 shadow-lg shadow-blue-500/10' : 'border-[#1A2438]'
                  }`}
                >
                  <div>
                    {/* Top Meta Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {plan.status}
                      </span>

                      {plan.highlighted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          Highlighted
                        </span>
                      )}
                    </div>

                    {/* Title and Price */}
                    <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-extrabold text-white font-mono">
                        ${plan.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{plan.billingCycle}
                      </span>
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    {/* Features Checklist */}
                    <div className="space-y-2 pt-3 border-t border-slate-800 mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                        Features ({plan.features.length})
                      </span>
                      <ul className="space-y-1.5">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-300"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title={isPublished ? 'Switch to Draft' : 'Publish Plan'}
                      >
                        {isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleToggleHighlight(plan)}
                        className={`px-2 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                          plan.highlighted
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title="Toggle Highlighted Badge"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                        disabled={isDeleting}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1422] border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>{editingPlanId ? 'Edit Pricing Plan' : 'Create Pricing Plan'}</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Price & Billing Cycle */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="79"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value === '' ? '' : Number(e.target.value),
                        }))
                      }
                      className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cycle *
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          billingCycle: e.target.value as BillingCycle,
                        }))
                      }
                      className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of target team size and primary workload intelligence benefits..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Dynamic Feature Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Features Checklist * (At least 1 required)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a new feature (e.g. Proactive workload alerts)..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 bg-[#070B14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-[#070B14] border border-slate-800">
                  {formData.features.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-2">
                      No features added yet. Type a feature above and click Add.
                    </p>
                  ) : (
                    formData.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-2.5 py-1 rounded bg-[#0D1422] border border-slate-800/80 text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                          title="Remove feature"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Status and Highlighted Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as PricingPlanStatus,
                      }))
                    }
                    className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Admin Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Highlight Tier
                  </label>
                  <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.highlighted}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, highlighted: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-slate-700 bg-[#070B14] text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300">Mark as &quot;Most Popular&quot;</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingPlanId ? 'Update Plan' : 'Create Plan'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

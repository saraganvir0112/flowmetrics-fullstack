export type BillingCycle = 'month' | 'year';
export type PricingPlanStatus = 'published' | 'draft';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  description?: string;
  features: string[];
  highlighted: boolean;
  status: PricingPlanStatus;
  createdAt: string;
  updatedAt: string;
}

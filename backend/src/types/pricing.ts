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
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePricingPlanInput {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  description?: string;
  features: string[];
  highlighted?: boolean;
  status?: PricingPlanStatus;
}

export type UpdatePricingPlanInput = Partial<CreatePricingPlanInput>;

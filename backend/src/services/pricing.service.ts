import mongoose from 'mongoose';
import { PricingPlan, IPricingPlan } from '../models/PricingPlan.js';
import { CreatePricingPlanInput, UpdatePricingPlanInput } from '../types/pricing.js';
import { AppError } from '../middleware/errorHandler.js';

export class PricingService {
  /**
   * Retrieves all published pricing plans for public consumption.
   * Never returns draft plans.
   */
  public static async getPublicPlans(): Promise<IPricingPlan[]> {
    return PricingPlan.find({ status: 'published' }).sort({ price: 1, createdAt: 1 });
  }

  /**
   * Retrieves a single published pricing plan by ID.
   * Returns 404 if the plan does not exist or is in draft status.
   */
  public static async getPublicPlanById(id: string): Promise<IPricingPlan> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    const plan = await PricingPlan.findOne({ _id: id, status: 'published' });

    if (!plan) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    return plan;
  }

  /**
   * Retrieves all pricing plans (published & draft) for administrative management.
   */
  public static async getAllPlansAdmin(): Promise<IPricingPlan[]> {
    return PricingPlan.find().sort({ createdAt: -1 });
  }

  /**
   * Retrieves any pricing plan by ID for admin management.
   */
  public static async getPlanByIdAdmin(id: string): Promise<IPricingPlan> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    const plan = await PricingPlan.findById(id);

    if (!plan) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    return plan;
  }

  /**
   * Creates a new pricing plan.
   */
  public static async createPlan(data: CreatePricingPlanInput): Promise<IPricingPlan> {
    const plan = await PricingPlan.create({
      ...data,
      features: data.features.map((f) => f.trim()),
    });
    return plan;
  }

  /**
   * Updates an existing pricing plan (published or draft).
   */
  public static async updatePlan(id: string, data: UpdatePricingPlanInput): Promise<IPricingPlan> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    const updatePayload: UpdatePricingPlanInput = { ...data };
    if (data.features) {
      updatePayload.features = data.features.map((f) => f.trim());
    }

    const plan = await PricingPlan.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    return plan;
  }

  /**
   * Deletes an existing pricing plan by ID.
   */
  public static async deletePlan(id: string): Promise<IPricingPlan> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    const plan = await PricingPlan.findByIdAndDelete(id);

    if (!plan) {
      throw new AppError('Pricing plan not found', 404, 'NOT_FOUND');
    }

    return plan;
  }
}

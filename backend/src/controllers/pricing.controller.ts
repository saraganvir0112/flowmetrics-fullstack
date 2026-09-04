import { Request, Response, NextFunction } from 'express';
import { PricingService } from '../services/pricing.service.js';
import { ApiSuccessResponse } from '../types/api.js';
import { IPricingPlan } from '../models/PricingPlan.js';

export class PricingController {
  public static async getPublicPlans(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plans = await PricingService.getPublicPlans();

      const response: ApiSuccessResponse<IPricingPlan[]> = {
        success: true,
        data: plans,
        meta: {
          count: plans.length,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getPublicPlanById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await PricingService.getPublicPlanById(id);

      const response: ApiSuccessResponse<IPricingPlan> = {
        success: true,
        data: plan,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllPlansAdmin(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plans = await PricingService.getAllPlansAdmin();

      const response: ApiSuccessResponse<IPricingPlan[]> = {
        success: true,
        data: plans,
        meta: {
          count: plans.length,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async createPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plan = await PricingService.createPlan(req.body);

      const response: ApiSuccessResponse<IPricingPlan> = {
        success: true,
        data: plan,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await PricingService.updatePlan(id, req.body);

      const response: ApiSuccessResponse<IPricingPlan> = {
        success: true,
        data: plan,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async deletePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await PricingService.deletePlan(id);

      const response: ApiSuccessResponse<{ message: string; deletedId: string }> = {
        success: true,
        data: {
          message: 'Pricing plan deleted successfully',
          deletedId: plan._id.toString(),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

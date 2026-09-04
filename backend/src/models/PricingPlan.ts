import mongoose, { Document, Schema, Model } from 'mongoose';
import { BillingCycle, PricingPlanStatus } from '../types/pricing.js';

export interface IPricingPlan extends Document {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  description?: string;
  features: string[];
  highlighted: boolean;
  status: PricingPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const pricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      maxlength: [100, 'Plan name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be 0 or greater'],
    },
    billingCycle: {
      type: String,
      enum: {
        values: ['month', 'year'],
        message: '{VALUE} is not a valid billing cycle',
      },
      required: [true, 'Billing cycle is required'],
      default: 'month',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    features: {
      type: [
        {
          type: String,
          trim: true,
          required: true,
        },
      ],
      validate: [
        {
          validator: function (val: string[]) {
            return (
              Array.isArray(val) &&
              val.length > 0 &&
              val.every((item) => typeof item === 'string' && item.trim().length > 0)
            );
          },
          message: 'At least one non-empty feature is required',
        },
      ],
      required: [true, 'Features are required'],
    },
    highlighted: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['published', 'draft'],
        message: '{VALUE} is not a valid plan status',
      },
      default: 'published',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        const id = ret._id ? String(ret._id) : undefined;
        const safeRecord: Record<string, unknown> = { ...ret, id };
        delete safeRecord._id;
        delete safeRecord.__v;
        return safeRecord;
      },
    },
  }
);

export const PricingPlan: Model<IPricingPlan> =
  mongoose.models.PricingPlan || mongoose.model<IPricingPlan>('PricingPlan', pricingPlanSchema);

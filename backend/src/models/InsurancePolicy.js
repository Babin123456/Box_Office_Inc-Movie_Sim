/**
 * @fileoverview Insurance Policy Mongoose Schema Model
 */

import mongoose from "mongoose";

const insurancePolicySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    policyType: {
      type: String,
      enum: ["COMPLETION_BOND", "PRODUCTION_DISASTER", "TALENT_LIABILITY"],
      required: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    weeklyPremium: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLAIMED", "EXPIRED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const InsurancePolicy = mongoose.models.InsurancePolicy || mongoose.model("InsurancePolicy", insurancePolicySchema);

export default InsurancePolicy;

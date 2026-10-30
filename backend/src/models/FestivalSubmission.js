/**
 * @fileoverview Festival Submission Mongoose Model
 */

import mongoose from "mongoose";

const festivalSubmissionSchema = new mongoose.Schema(
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
    festivalName: {
      type: String,
      enum: ["CANNES", "SUNDANCE", "VENICE", "TIFF"],
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    juryScore: {
      type: Number,
      default: 0,
    },
    awardWon: {
      type: String,
      enum: [
        "PALME_D_OR",
        "GRAND_PRIX",
        "AUDIENCE_AWARD",
        "GOLDEN_LION",
        "PEOPLES_CHOICE",
        "GRAND_JURY_PRIZE",
        "NONE",
      ],
      default: "NONE",
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "ACCEPTED", "AWARDED", "REJECTED", "WITHDRAWN", "ACQUIRED"],
      default: "SUBMITTED",
    },
    prestigeTier: {
      type: String,
      enum: ["TIER_1_MAJORS", "TIER_2_PREMIERE", "TIER_3_REGIONAL"],
      default: "TIER_1_MAJORS",
    },
    marketDistributionOffer: {
      type: Number,
      default: 0,
    },
    criticHypeBoost: {
      type: Number,
      default: 1.0,
    },
    juryDeliberation: {
      standingOvationMinutes: { type: Number, default: 0 },
      consensusQuote: { type: String, default: "" },
      pillarScores: {
        direction: { type: Number, default: 50 },
        screenplay: { type: Number, default: 50 },
        performances: { type: Number, default: 50 },
        thematicResonance: { type: Number, default: 50 },
      },
    },
    distributionBids: [
      {
        distributorName: { type: String, required: true },
        advancePayment: { type: Number, required: true },
        boxOfficeRoyaltyCut: { type: Number, default: 15 },
        marketingCommitment: { type: Number, default: 500000 },
        territory: { type: String, default: "Worldwide" },
      },
    ],
    acceptedDeal: {
      distributorName: { type: String },
      advancePayment: { type: Number },
      boxOfficeRoyaltyCut: { type: Number },
      signedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const FestivalSubmission = mongoose.models.FestivalSubmission || mongoose.model("FestivalSubmission", festivalSubmissionSchema);

export default FestivalSubmission;

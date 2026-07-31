import mongoose from "mongoose";

const prCrisisSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    reputationDamagePerWeek: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED", "IGNORED"],
      default: "ACTIVE",
    },
    chosenStrategy: {
      type: String,
      enum: ["PUBLIC_APOLOGY", "SETTLEMENT_PAYOUT", "PRESS_TOUR", "LEGAL_ACTION", "NONE"],
      default: "NONE",
    },
    resolutionCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PRCrisis = mongoose.model("PRCrisis", prCrisisSchema);
export default PRCrisis;

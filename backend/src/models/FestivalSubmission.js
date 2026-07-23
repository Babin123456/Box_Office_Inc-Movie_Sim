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
      enum: ["PALME_D_OR", "GRAND_PRIX", "AUDIENCE_AWARD", "GOLDEN_LION", "NONE"],
      default: "NONE",
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "ACCEPTED", "AWARDED", "REJECTED"],
      default: "SUBMITTED",
    },
  },
  {
    timestamps: true,
  }
);

const FestivalSubmission = mongoose.models.FestivalSubmission || mongoose.model("FestivalSubmission", festivalSubmissionSchema);

export default FestivalSubmission;

import mongoose from "mongoose";

const syndicationDealSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    networkName: {
      type: String,
      required: true,
      enum: [
        "Global Broadcast Network",
        "CineMax Cable Television",
        "StreamLine SVOD Network",
        "PrimeTime Syndication Network",
        "Indie Film Channel",
      ],
    },
    dealType: {
      type: String,
      enum: ["EXCLUSIVE_TV", "NON_EXCLUSIVE_CABLE", "SYNDICATION_PACKAGE"],
      default: "SYNDICATION_PACKAGE",
    },
    upfrontBonus: {
      type: Number,
      required: true,
      min: 0,
    },
    weeklyRoyalty: {
      type: Number,
      required: true,
      min: 0,
    },
    totalWeeksDuration: {
      type: Number,
      required: true,
      min: 1,
      max: 104,
    },
    weeksRemaining: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "TERMINATED"],
      default: "ACTIVE",
    },
    totalPayoutCollected: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SyndicationDeal = mongoose.model("SyndicationDeal", syndicationDealSchema);
export default SyndicationDeal;

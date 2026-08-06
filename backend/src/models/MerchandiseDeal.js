import mongoose from "mongoose";

const merchandiseDealSchema = new mongoose.Schema(
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
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["ACTION_FIGURES", "APPAREL", "COLLECTIBLES", "DIGITAL_ITEMS", "SOUNDTRACK_VINYL"],
    },
    tier: {
      type: String,
      enum: ["STANDARD", "PREMIUM", "GLOBAL_EXCLUSIVE"],
      default: "STANDARD",
    },
    advanceRoyalty: {
      type: Number,
      required: true,
      min: 0,
    },
    royaltyPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    inventoryUnits: {
      type: Number,
      required: true,
      min: 100,
    },
    unitsSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    weeklySalesRate: {
      type: Number,
      default: 0,
    },
    totalRevenueGenerated: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SOLD_OUT", "EXPIRED"],
      default: "ACTIVE",
    },
    weeksActive: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MerchandiseDeal = mongoose.model("MerchandiseDeal", merchandiseDealSchema);
export default MerchandiseDeal;

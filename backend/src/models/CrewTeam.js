import mongoose from "mongoose";

const crewTeamSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    technicalQuality: { type: Number, default: 50 },
    musicQuality: { type: Number, default: 50 },
    vfxQuality: { type: Number, default: 50 },
    creativity: { type: Number, default: 50 },
    reliability: { type: Number, default: 50 },
    reputation: { type: Number, default: 0 },
    morale: { type: Number, default: 100 },
    salary: { type: Number, default: 0 },
    rarity: { type: String, default: "COMMON" },
    age: { type: Number, default: 1 },
    discovery: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY"],
      default: "AVAILABLE",
    },
    busyUntilWeek: { type: Number, default: null },
    hiredAt: { type: Date, default: null },
    contractYears: { type: Number, default: 1 },
  },
  { _id: false }
);

export default crewTeamSchema;

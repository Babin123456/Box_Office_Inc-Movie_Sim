import mongoose from "mongoose";

const talentAgencySchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
      index: true,
    },
    agencyName: {
      type: String,
      required: true,
      enum: ["Creative Artists Agency", "William Morris Endeavor", "United Talent Agency", "Gersh Agency"],
    },
    relationshipScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    tier: {
      type: String,
      enum: ["PREFERRED", "STANDARD", "RESTRICTED"],
      default: "STANDARD",
    },
    packagedDealsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TalentAgency = mongoose.model("TalentAgency", talentAgencySchema);
export default TalentAgency;

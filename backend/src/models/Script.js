import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Romance",
        "Horror",
        "Sci-Fi",
        "Fantasy",
        "Thriller",
      ],
    },

    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    originality: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    audienceAppeal: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    franchisePotential: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    price: {
      type: Number,
      required: true,
      min: 100000,
    },

    isMarketScript: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Script", scriptSchema);

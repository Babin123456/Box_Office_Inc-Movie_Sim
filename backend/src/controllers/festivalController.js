/**
 * @fileoverview Festival & Award Campaign Controller
 */

import FestivalSubmission from "../models/FestivalSubmission.js";
import Movie from "../models/Movie.js";

/**
 * POST /api/festivals/submit
 * Submits a movie to a prestige film festival circuit.
 */
export const submitToFestival = async (req, res, next) => {
  try {
    const { movieId, festivalName } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const entryFees = { CANNES: 500000, SUNDANCE: 250000, VENICE: 400000, TIFF: 300000 };
    const fee = entryFees[festivalName] || 250000;

    // Calculate jury reaction score based on quality & criticScore
    const juryScore = Math.round((movie.quality * 0.6) + (movie.criticScore * 0.4));
    let awardWon = "NONE";
    let status = "ACCEPTED";

    if (juryScore >= 85) {
      status = "AWARDED";
      awardWon = festivalName === "CANNES" ? "PALME_D_OR" : "GRAND_PRIX";
    } else if (juryScore < 50) {
      status = "REJECTED";
    }

    const submission = await FestivalSubmission.create({
      userId: req.user._id,
      movieId,
      festivalName,
      entryFee: fee,
      juryScore,
      awardWon,
      status,
    });

    return res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/festivals/active
 * Retrieves all festival submissions for current user studio.
 */
export const getActiveSubmissions = async (req, res, next) => {
  try {
    const submissions = await FestivalSubmission.find({ userId: req.user._id }).populate("movieId", "title quality criticScore");
    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

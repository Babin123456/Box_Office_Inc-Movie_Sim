import SyndicationDeal from "../models/SyndicationDeal.js";
import Movie from "../models/Movie.js";
import Studio from "../models/Studio.js";
import { calculateSyndicationValuation } from "../services/simulation/engines/syndicationEngine.js";

export const getStudioSyndicationDeals = async (req, res, next) => {
  try {
    const deals = await SyndicationDeal.find({ studioId: req.user.studioId }).populate("movieId", "title posterUrl boxOffice");
    return res.status(200).json({ success: true, data: deals });
  } catch (error) {
    next(error);
  }
};

export const getMovieSyndicationValuation = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    const valuation = calculateSyndicationValuation(movie);
    return res.status(200).json({ success: true, data: valuation });
  } catch (error) {
    next(error);
  }
};

export const createSyndicationDeal = async (req, res, next) => {
  try {
    const { movieId, networkName, dealType, durationWeeks } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const valuation = calculateSyndicationValuation(movie);

    const deal = await SyndicationDeal.create({
      studioId: req.user.studioId,
      movieId,
      networkName,
      dealType,
      upfrontBonus: valuation.upfrontBonus,
      weeklyRoyalty: valuation.weeklyRoyalty,
      totalWeeksDuration: durationWeeks || valuation.maxDurationWeeks,
      weeksRemaining: durationWeeks || valuation.maxDurationWeeks,
      status: "ACTIVE",
    });

    // Credit upfront bonus to studio money
    await Studio.findByIdAndUpdate(req.user.studioId, {
      $inc: { money: valuation.upfrontBonus },
    });

    return res.status(201).json({
      success: true,
      message: "Syndication deal successfully negotiated and signed!",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

import FestivalSubmission from "../models/FestivalSubmission.js";
import Movie from "../models/Movie.js";
import Studio from "../models/Studio.js";
import { deliberateFestivalJury, generateDistributorOffers } from "../services/festival/festivalJuryEngine.js";

/**
 * POST /api/festivals/submit
 * Submits a movie to a prestige film festival circuit with comprehensive jury deliberation.
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

    // Deduct entry fee from studio if available
    const studio = await Studio.findOne({ owner: req.user._id });
    if (studio) {
      if (studio.money < fee) {
        return res.status(400).json({
          success: false,
          message: `Insufficient studio funds for festival entry fee (Requires ₹${fee.toLocaleString()})`,
        });
      }
      studio.money -= fee;
      await studio.save();
    }

    // Execute jury deliberation panel simulation
    const deliberation = deliberateFestivalJury(movie, festivalName);
    const distributionBids = generateDistributorOffers(deliberation.juryScore, movie.budget);
    const topOffer = distributionBids[0]?.advancePayment || 0;

    const submission = await FestivalSubmission.create({
      userId: req.user._id,
      movieId,
      festivalName,
      entryFee: fee,
      juryScore: deliberation.juryScore,
      awardWon: deliberation.awardWon,
      status: deliberation.status,
      criticHypeBoost: deliberation.criticHypeBoost,
      marketDistributionOffer: topOffer,
      juryDeliberation: {
        standingOvationMinutes: deliberation.standingOvationMinutes,
        consensusQuote: deliberation.consensusQuote,
        pillarScores: deliberation.pillarScores,
      },
      distributionBids,
    });

    if (deliberation.awardWon !== "NONE" && studio) {
      studio.prestige = (studio.prestige || 0) + 15;
      await studio.save();
    }

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
    const submissions = await FestivalSubmission.find({ userId: req.user._id })
      .populate("movieId", "title quality criticScore budget genre releaseDate")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/festivals/withdraw
 * Withdraws a festival submission prior to jury screening.
 */
export const withdrawSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.body;
    const submission = await FestivalSubmission.findOne({ _id: submissionId, userId: req.user._id });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Festival submission not found" });
    }

    submission.status = "WITHDRAWN";
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Submission withdrawn successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/festivals/accept-distribution
 * Accepts a competitive distributor acquisition contract, crediting studio funds.
 */
export const acceptDistributionDeal = async (req, res, next) => {
  try {
    const { submissionId, distributorName } = req.body;

    const submission = await FestivalSubmission.findOne({ _id: submissionId, userId: req.user._id });
    if (!submission) {
      return res.status(404).json({ success: false, message: "Festival submission not found" });
    }

    if (submission.status === "ACQUIRED") {
      return res.status(400).json({ success: false, message: "A distribution contract has already been signed for this submission" });
    }

    const selectedBid = submission.distributionBids.find((b) => b.distributorName === distributorName);
    if (!selectedBid) {
      return res.status(404).json({ success: false, message: "Selected distributor bid not found" });
    }

    submission.status = "ACQUIRED";
    submission.acceptedDeal = {
      distributorName: selectedBid.distributorName,
      advancePayment: selectedBid.advancePayment,
      boxOfficeRoyaltyCut: selectedBid.boxOfficeRoyaltyCut,
      signedAt: new Date(),
    };
    await submission.save();

    const studio = await Studio.findOne({ owner: req.user._id });
    if (studio) {
      studio.money = (studio.money || 0) + selectedBid.advancePayment;
      studio.prestige = (studio.prestige || 0) + 10;
      await studio.save();
    }

    return res.status(200).json({
      success: true,
      message: `Successfully inked distribution deal with ${selectedBid.distributorName}! Advance of ₹${selectedBid.advancePayment.toLocaleString()} credited to studio treasury.`,
      data: {
        submission,
        studioFunds: studio?.money,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/festivals/laurels
 * Returns all awarded festival laurels and accolades won by the studio's films.
 */
export const getFestivalLaurels = async (req, res, next) => {
  try {
    const awardedSubmissions = await FestivalSubmission.find({
      userId: req.user._id,
      awardWon: { $ne: "NONE" },
    })
      .populate("movieId", "title quality genre releaseDate poster")
      .sort({ createdAt: -1 });

    const laurels = awardedSubmissions.map((sub) => ({
      submissionId: sub._id,
      festivalName: sub.festivalName,
      awardTitle: sub.awardWon,
      movieTitle: sub.movieId?.title || "Feature Film",
      movieId: sub.movieId?._id,
      juryScore: sub.juryScore,
      standingOvationMinutes: sub.juryDeliberation?.standingOvationMinutes || 0,
      consensusQuote: sub.juryDeliberation?.consensusQuote || "",
      year: new Date(sub.createdAt).getFullYear(),
    }));

    return res.status(200).json({
      success: true,
      data: laurels,
    });
  } catch (error) {
    next(error);
  }
};

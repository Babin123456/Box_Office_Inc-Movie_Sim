import Movie from "../../../models/Movie.js";
import { findScriptById } from "../../movie/movieValidationService.js";
import { performMovieRelease } from "../../movie/releaseService.js";

/**
 * Pure helper — calculates clash penalty based on pre-fetched data.
 * Separated from DB calls so it can be unit-tested without a Mongoose connection.
 *
 * @param {object} gameState
 * @param {object} movie - Movie being released (must have scriptId)
 * @param {Array}  playerMovies - Other READY_FOR_RELEASE player movies with same scheduledReleaseWeek
 * @returns {{ boxOfficeMultiplier: number, marketingMultiplier: number, clashedWith: string[] }}
 */
export const computeClashPenalty = (gameState, movie, playerMovies = []) => {
  let sameGenreCompetitors = 0;
  const clashedWith = [];

  const currentScript = findScriptById(gameState, movie.scriptId);
  const currentGenres = currentScript?.genres || [];

  // 1. Check rival movies whose weeksRemaining === 0 (releasing this tick)
  if (gameState.rivalStudios) {
    for (const rival of gameState.rivalStudios) {
      for (const rMovie of rival.activeMovies || []) {
        if (rMovie.weeksRemaining === 0 && currentGenres.includes(rMovie.genre)) {
          sameGenreCompetitors++;
          clashedWith.push(`${rival.name}'s "${rMovie.title}"`);
        }
      }
    }
  }

  // 2. Check other player movies releasing the same week
  for (const pMovie of playerMovies) {
    const pScript = findScriptById(gameState, pMovie.scriptId);
    const pGenres = pScript?.genres || [];
    if (pGenres.some(g => currentGenres.includes(g))) {
      sameGenreCompetitors++;
      clashedWith.push(`your own movie "${pMovie.title}"`);
    }
  }

  let boxOfficeMultiplier = 1.0;
  let marketingMultiplier = 1.0;

  if (sameGenreCompetitors === 1) {
    boxOfficeMultiplier = 0.85;
    marketingMultiplier = 0.80;
  } else if (sameGenreCompetitors >= 2) {
    boxOfficeMultiplier = 0.70;
    marketingMultiplier = 0.65;
  }

  return { boxOfficeMultiplier, marketingMultiplier, clashedWith };
};

/**
 * Async wrapper used by the release service — fetches player clash candidates
 * from the DB then delegates to the pure computeClashPenalty helper.
 *
 * @param {object} gameState
 * @param {object} movie - Movie being released
 * @returns {Promise<{ boxOfficeMultiplier: number, marketingMultiplier: number, clashedWith: string[] }>}
 */
export const calculateClashPenalty = async (gameState, movie) => {
  const currentWeek = gameState.currentWeek;

  // Fetch other player movies scheduled for the same week
  const playerMovies = await Movie.find({
    scheduledReleaseWeek: currentWeek,
    status: "READY_FOR_RELEASE",
    _id: { $ne: movie._id }
  }).lean();

  return computeClashPenalty(gameState, movie, playerMovies);
};

/**
 * Auto-releases player movies whose scheduled release week has arrived.
 *
 * @param {number} currentWeek
 * @param {object} gameState
 * @param {object} studio
 * @returns {Promise<void>}
 */
export const processScheduledReleases = async (currentWeek, gameState, studio) => {
  const moviesReadyThisWeek = await Movie.find({
    scheduledReleaseWeek: currentWeek,
    status: "READY_FOR_RELEASE"
  });

  for (const movie of moviesReadyThisWeek) {
    try {
      await performMovieRelease(movie, studio, gameState);
    } catch (err) {
      console.error(`Failed to auto-release movie "${movie.title}":`, err.message);
    }
  }
};

/**
 * Calculates screen cannibalization and theater allocation penalty when head-to-head clashes occur.
 * 
 * @param {number} totalAvailableScreens - Total available screens in market.
 * @param {number} competitorCount - Number of competing movies in the same genre window.
 * @returns {{ allocatedScreens: number, cannibalizationRate: number }}
 */
export const calculateScreenCannibalization = (totalAvailableScreens = 4000, competitorCount = 0) => {
  if (competitorCount <= 0) {
    return { allocatedScreens: totalAvailableScreens, cannibalizationRate: 0.0 };
  }

  const shareFactor = 1 / (competitorCount + 1);
  const cannibalizationRate = Number((0.15 * competitorCount).toFixed(2));
  const allocatedScreens = Math.max(100, Math.round(totalAvailableScreens * shareFactor * (1 - cannibalizationRate * 0.2)));

  return { allocatedScreens, cannibalizationRate };
};

/**
 * Computes overall clash severity rating.
 * 
 * @param {number} sameGenreCompetitors - Competitor count.
 * @param {number} starPowerDifference - Star power difference score.
 * @returns {string} Severity rating ("NONE", "MILD", "MODERATE", "SEVERE", "EXTREME")
 */
export const computeClashSeverity = (sameGenreCompetitors, starPowerDifference = 0) => {
  if (sameGenreCompetitors <= 0) return "NONE";
  if (sameGenreCompetitors === 1 && starPowerDifference >= 20) return "MILD";
  if (sameGenreCompetitors === 1) return "MODERATE";
  if (sameGenreCompetitors === 2) return "SEVERE";
  return "EXTREME";
};


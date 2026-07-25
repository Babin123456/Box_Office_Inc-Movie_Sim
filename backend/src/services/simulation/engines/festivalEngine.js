/**
 * @fileoverview Film Festival Simulation Engine
 * 
 * Logic for calculating festival jury scores, award distribution probabilities,
 * critic hype multipliers, and film market distribution offers.
 */

/**
 * Calculates festival jury reaction score based on quality, director prestige, and film genre.
 * 
 * @param {object} movie - Movie object { quality, criticScore }.
 * @param {string} festivalName - Name of festival ("CANNES", "SUNDANCE", "VENICE", "TIFF").
 * @returns {number} Jury reaction score (0-100).
 */
export const calculateFestivalJuryScore = (movie, festivalName) => {
  const baseQuality = movie.quality || 50;
  const criticScore = movie.criticScore || 50;
  
  const festivalWeights = {
    CANNES: { quality: 0.7, critic: 0.3 },
    SUNDANCE: { quality: 0.5, critic: 0.5 },
    VENICE: { quality: 0.6, critic: 0.4 },
    TIFF: { quality: 0.4, critic: 0.6 },
  };

  const weights = festivalWeights[festivalName] || { quality: 0.5, critic: 0.5 };
  return Math.round(baseQuality * weights.quality + criticScore * weights.critic);
};

/**
 * Computes prestige critic hype boost for theatrical release after festival run.
 * 
 * @param {string} awardWon - Award title ("PALME_D_OR", "GRAND_PRIX", "AUDIENCE_AWARD", "GOLDEN_LION", "NONE").
 * @returns {number} Critic hype multiplier (1.0 to 1.35).
 */
export const calculatePrestigeHypeBoost = (awardWon) => {
  switch (awardWon) {
    case "PALME_D_OR":
      return 1.35;
    case "GOLDEN_LION":
      return 1.30;
    case "GRAND_PRIX":
      return 1.25;
    case "AUDIENCE_AWARD":
      return 1.20;
    default:
      return 1.05;
  }
};

/**
 * Generates distributor acquisition offer amount for award-winning festival movies.
 * 
 * @param {number} juryScore - Jury evaluation score.
 * @param {number} productionBudget - Production budget.
 * @returns {number} Acquisition offer in INR.
 */
export const calculateMarketDistributionOffer = (juryScore, productionBudget = 1000000) => {
  if (juryScore < 70) return 0;
  const offerMultiplier = 0.5 + (juryScore / 100);
  return Math.round(productionBudget * offerMultiplier);
};

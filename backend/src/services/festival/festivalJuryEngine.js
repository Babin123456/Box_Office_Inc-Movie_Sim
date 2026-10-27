/**
 * @fileoverview Film Festival Jury Deliberation and Distributor Bidding Engine
 *
 * Implements jury panels for Cannes, Venice, TIFF, and Sundance with distinct
 * evaluation weights, standing ovation duration calculations, critical consensus
 * quotes, and competitive distributor acquisition bidding.
 */

export const FESTIVAL_PROFILES = {
  CANNES: {
    name: "Cannes Film Festival",
    prestigeWeight: 1.35,
    topAward: "PALME_D_OR",
    runnerUpAward: "GRAND_PRIX",
    weights: {
      direction: 0.35,
      screenplay: 0.25,
      performances: 0.20,
      thematicResonance: 0.20,
    },
    critiquePraise: [
      "A transcendent visual triumph that stunned the Grand Théâtre Lumière audience.",
      "A masterclass in auteur cinema, daring, provocative, and deeply unforgettable.",
      "An unyielding poetic achievement that will define this generation of cinematic art.",
    ],
    critiqueMixed: [
      "Stunningly photographed, but bogged down by self-indulgent narrative pacing.",
      "Daring aesthetic concepts undermined by an uneven third act.",
    ],
  },
  VENICE: {
    name: "Venice International Film Festival",
    prestigeWeight: 1.30,
    topAward: "GOLDEN_LION",
    runnerUpAward: "GRAND_PRIX",
    weights: {
      direction: 0.30,
      screenplay: 0.30,
      performances: 0.25,
      thematicResonance: 0.15,
    },
    critiquePraise: [
      "An immaculate tapestry of political tension and visual grandeur on the Lido.",
      "Commanding performances that held the Sala Grande in breathless stillness.",
      "A cinematic revelation that bridges artistic rigor with profound human tragedy.",
    ],
    critiqueMixed: [
      "Stylistically gorgeous yet emotionally detached from its central characters.",
      "A cold intellectual exercise that leaves the audience yearning for warmth.",
    ],
  },
  TIFF: {
    name: "Toronto International Film Festival",
    prestigeWeight: 1.25,
    topAward: "PEOPLES_CHOICE",
    runnerUpAward: "AUDIENCE_AWARD",
    weights: {
      direction: 0.25,
      screenplay: 0.30,
      performances: 0.30,
      thematicResonance: 0.15,
    },
    critiquePraise: [
      "An explosive crowd-pleaser that received roaring ovations across King Street.",
      "Electric, universally accessible, and destined for an unstoppable awards run.",
      "A powerhouse piece of cinema that had the entire theatre cheering through tears.",
    ],
    critiqueMixed: [
      "Entertaining in moments, but resorts to predictable Hollywood tropes.",
      "A crowd-friendly spectacle that avoids confronting deeper complexities.",
    ],
  },
  SUNDANCE: {
    name: "Sundance Film Festival",
    prestigeWeight: 1.20,
    topAward: "GRAND_JURY_PRIZE",
    runnerUpAward: "AUDIENCE_AWARD",
    weights: {
      direction: 0.20,
      screenplay: 0.35,
      performances: 0.30,
      thematicResonance: 0.15,
    },
    critiquePraise: [
      "A raw, poignant independent masterpiece born of sheer cinematic grit.",
      "Heart-wrenching authenticity that electrified the Park City midnight crowd.",
      "Uncompromising storytelling that heralds the arrival of a major voice in film.",
    ],
    critiqueMixed: [
      "Intimate and well-acted, but resembles student workshop theater in scope.",
      "Admirable indie ambition compromised by unpolished technical execution.",
    ],
  },
};

const DISTRIBUTOR_ARCHETYPES = [
  { name: "Neon Prestige", multiplier: 1.4, royaltyRate: 14, minQuality: 80, marketing: 1200000 },
  { name: "A24 Premier", multiplier: 1.5, royaltyRate: 15, minQuality: 82, marketing: 1500000 },
  { name: "Searchlight Classics", multiplier: 1.3, royaltyRate: 16, minQuality: 75, marketing: 1800000 },
  { name: "Criterion Studio Select", multiplier: 1.1, royaltyRate: 20, minQuality: 70, marketing: 800000 },
  { name: "Apex Global Releasing", multiplier: 1.2, royaltyRate: 12, minQuality: 65, marketing: 2000000 },
];

/**
 * Calculates jury scores, awards, standing ovation, and critique quote.
 */
export const deliberateFestivalJury = (movie, festivalKey = "CANNES") => {
  const profile = FESTIVAL_PROFILES[festivalKey] || FESTIVAL_PROFILES.CANNES;
  const baseQuality = Number(movie?.quality || 60);
  const criticScore = Number(movie?.criticScore || 60);

  // Sub-scores derived from movie properties with variance
  const directionScore = Math.min(100, Math.max(30, Math.round(baseQuality * 0.95 + (criticScore - baseQuality) * 0.3)));
  const screenplayScore = Math.min(100, Math.max(30, Math.round(criticScore * 0.9 + baseQuality * 0.15)));
  const performancesScore = Math.min(100, Math.max(30, Math.round((baseQuality + criticScore) / 2 + 2)));
  const thematicResonanceScore = Math.min(100, Math.max(30, Math.round(baseQuality * 0.85 + 10)));

  const compositeScore = Math.round(
    directionScore * profile.weights.direction +
    screenplayScore * profile.weights.screenplay +
    performancesScore * profile.weights.performances +
    thematicResonanceScore * profile.weights.thematicResonance
  );

  let awardWon = "NONE";
  let status = "ACCEPTED";
  let consensusQuote = "";
  let standingOvationMinutes = 2;

  if (compositeScore >= 88) {
    status = "AWARDED";
    awardWon = profile.topAward;
    consensusQuote = profile.critiquePraise[0];
    standingOvationMinutes = Math.min(14, Math.max(7, Math.round((compositeScore - 80) * 1.1)));
  } else if (compositeScore >= 80) {
    status = "AWARDED";
    awardWon = profile.runnerUpAward;
    consensusQuote = profile.critiquePraise[1] || profile.critiquePraise[0];
    standingOvationMinutes = Math.min(8, Math.max(5, Math.round((compositeScore - 75) * 0.8)));
  } else if (compositeScore >= 60) {
    status = "ACCEPTED";
    awardWon = "NONE";
    consensusQuote = profile.critiqueMixed[0];
    standingOvationMinutes = Math.min(5, Math.max(2, Math.round((compositeScore - 50) * 0.3)));
  } else {
    status = "REJECTED";
    awardWon = "NONE";
    consensusQuote = profile.critiqueMixed[1] || profile.critiqueMixed[0];
    standingOvationMinutes = 0;
  }

  const hypeMultiplier = awardWon !== "NONE" ? profile.prestigeWeight : compositeScore >= 60 ? 1.08 : 1.0;

  return {
    festivalName: festivalKey,
    juryScore: compositeScore,
    status,
    awardWon,
    criticHypeBoost: Number(hypeMultiplier.toFixed(2)),
    standingOvationMinutes,
    consensusQuote,
    pillarScores: {
      direction: directionScore,
      screenplay: screenplayScore,
      performances: performancesScore,
      thematicResonance: thematicResonanceScore,
    },
  };
};

/**
 * Generates competing distributor acquisition contracts for films premiering at festivals.
 */
export const generateDistributorOffers = (juryScore, productionBudget = 1000000) => {
  if (juryScore < 65) {
    return [];
  }

  const budget = Math.max(500000, Number(productionBudget) || 1000000);
  const eligibleDistributors = DISTRIBUTOR_ARCHETYPES.filter((d) => juryScore >= d.minQuality);

  return eligibleDistributors.slice(0, 3).map((dist) => {
    const scoreFactor = (juryScore - 60) / 40; // 0 to 1
    const baseAdvance = Math.round(budget * (0.6 + scoreFactor * 0.8) * dist.multiplier);
    const roundedAdvance = Math.round(baseAdvance / 50000) * 50000;

    return {
      distributorName: dist.name,
      advancePayment: roundedAdvance,
      boxOfficeRoyaltyCut: dist.royaltyRate,
      marketingCommitment: dist.marketing,
      territory: juryScore >= 80 ? "Worldwide Theatrical & Streaming" : "North America & UK",
    };
  });
};

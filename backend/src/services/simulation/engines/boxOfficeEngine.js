import { REGIONS } from "../../../constants/regions.js";

const getVerdict = (roi) => {
  if (roi < -0.5) return "DISASTER";
  if (roi < 0) return "FLOP";
  if (roi <= 0.25) return "AVERAGE";
  if (roi <= 1.0) return "HIT";
  if (roi <= 3.0) return "BLOCKBUSTER";
  return "LEGENDARY";
};

export const generateBoxOffice = (movie, leadActor, director, marketMultiplier = 1, genres = []) => {
  const qualityFactor = movie.quality / 100;
  const criticFactor = movie.criticScore / 100;
  const audienceFactor = movie.audienceScore / 100;
  const hypeFactor = movie.hype / 100;

  // Base potential based on hype and quality
  const basePotential = (hypeFactor * 0.6) + (qualityFactor * 0.4);

  // Opening Weekend influenced heavily by Hype and Actor Popularity
  const openingBase = 1000000; // 1M base
  const starPower = (leadActor.popularity / 100) * 500000;
  const marketingBoost = (movie.marketingBudget / 2);

  // Market Trends multiplier (defaults to 1 = no active trend for this
  // movie's genre). Applied at the opening weekend so it propagates through
  // worldwide gross, profit, ROI, and verdict.
  const openingWeekend = Math.round(
    (openingBase + starPower + marketingBoost) * (hypeFactor + 0.5) * (0.8 + Math.random() * 0.4) * marketMultiplier
  );

  // Calculate Base Worldwide Gross Potential
  const legs = (audienceFactor * 4) + (criticFactor * 1);
  const potentialWorldwideGross = openingWeekend * (2 + legs) * (0.9 + Math.random() * 0.2);

  let worldwideGross = 0;
  let domesticGross = 0;
  let internationalGross = 0;
  const regionalGross = {};

  // Break down into regional grosses
  for (const [regionKey, regionData] of Object.entries(REGIONS)) {
    let regionModifier = 1.0;
    
    // Apply genre modifiers if any genres match
    if (genres && genres.length > 0) {
      let totalGenreMod = 0;
      let matchedGenres = 0;
      for (const genre of genres) {
        if (regionData.genreModifiers[genre]) {
          totalGenreMod += regionData.genreModifiers[genre];
          matchedGenres++;
        }
      }
      if (matchedGenres > 0) {
         // average modifier
         regionModifier = totalGenreMod / matchedGenres;
      }
    }

    const regionGross = Math.round(potentialWorldwideGross * regionData.marketShare * regionModifier);
    regionalGross[regionKey] = regionGross;
    worldwideGross += regionGross;

    if (regionKey === "NORTH_AMERICA") {
        domesticGross += regionGross;
    } else {
        internationalGross += regionGross;
    }
  }

  const totalBudget = (movie.budget || 0) + (movie.marketingBudget || 0);
  const profit = worldwideGross - totalBudget;
  const roi = totalBudget > 0 ? profit / totalBudget : worldwideGross / 1000000;

  return {
    openingWeekend,
    domesticGross,
    internationalGross,
    worldwideGross,
    regionalGross,
    boxOffice: worldwideGross,
    profit,
    roi,
    verdict: getVerdict(roi)
  };
};

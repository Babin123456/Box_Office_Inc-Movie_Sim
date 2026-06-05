import { addNotification } from "../helpers/notificationHelper.js";

export const processStudioGrowth = (gameState, studio, movie) => {
  const isHit = ["HIT", "BLOCKBUSTER", "LEGENDARY"].includes(movie.verdict);
  const isFlop = ["FLOP", "DISASTER"].includes(movie.verdict);

  // Money update (handled in controller but logic for record tracking)
  studio.money += movie.profit;

  // Fan Growth: Audience Score, Box Office, Verdict
  const audienceScoreFactor = movie.audienceScore / 100;
  const verdictMultiplier = isHit ? 2 : isFlop ? 0.5 : 1;
  const fanGain = Math.round((movie.worldwideGross / 1000) * audienceScoreFactor * verdictMultiplier);
  studio.fans = (studio.fans || 0) + fanGain;

  // Prestige Growth: Critic Score, Verdict, Quality
  const criticScoreFactor = movie.criticScore / 100;
  const qualityFactor = movie.quality / 100;
  const prestigeGain = Math.round((criticScoreFactor * 10) + (qualityFactor * 5) + (isHit ? 20 : isFlop ? -10 : 0));
  studio.prestige = Math.max(0, (studio.prestige || 0) + prestigeGain);

  // Update records
  if (movie.worldwideGross > (studio.highestGrossingMovie?.amount || 0)) {
    studio.highestGrossingMovie = { id: movie._id, title: movie.title, amount: movie.worldwideGross };
  }
  if (movie.profit > (studio.mostProfitableMovie?.amount || 0)) {
    studio.mostProfitableMovie = { id: movie._id, title: movie.title, amount: movie.profit };
  }
  if (movie.criticScore > (studio.bestReviewedMovie?.amount || 0)) {
    studio.bestReviewedMovie = { id: movie._id, title: movie.title, amount: movie.criticScore };
  }

  // Studio Level Progression (simple check)
  // Reusing level logic if exists, otherwise can implement simple threshold
  const nextLevelThreshold = studio.studioLevel * 100000;
  if (studio.fans >= nextLevelThreshold) {
    studio.studioLevel += 1;
    addNotification(gameState, `Congratulations! Studio leveled up to ${studio.studioLevel}!`);
  }

  return { fanGain, prestigeGain };
};

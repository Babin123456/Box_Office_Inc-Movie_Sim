import { addNotification } from "../helpers/notificationHelper.js";
import { computeMarketSharePenalty } from "./rivalStudioEngine.js";

export const processStudioGrowth = (gameState, studio, movie) => {
  const isHit = movie.verdict === "HIT";
  const isBlockbuster = movie.verdict === "BLOCKBUSTER";
  const isLegendary = movie.verdict === "LEGENDARY";
  const isFlop = movie.verdict === "FLOP";
  const isDisaster = movie.verdict === "DISASTER";

  const isSuccess = isHit || isBlockbuster || isLegendary;
  const isFailure = isFlop || isDisaster;

  // Ensure stats object exists
  studio.stats = studio.stats || {
    moviesReleased: 0,
    hits: 0,
    blockbusters: 0,
    allTimeBlockbusters: 0,
    flops: 0,
    disasters: 0,
    totalRevenue: 0,
    totalProfit: 0,
    avgCriticScore: 0,
    avgAudienceScore: 0
  };

  // Money update (handled in controller but logic for record tracking)
  studio.money += movie.profit;

  // Fan Growth: Audience Score, Box Office, Verdict
  const audienceScoreFactor = movie.audienceScore / 100;
  const verdictMultiplier = isSuccess ? 2 : isFailure ? 0.5 : 1;
  let fanGain = Math.round((movie.worldwideGross / 1000) * audienceScoreFactor * verdictMultiplier);

  // Apply market-share pressure from rival studios (reduces fanGain when rivals dominate)
  const marketPenalty = computeMarketSharePenalty(gameState, studio.fans || 0);
  fanGain = Math.round(fanGain * marketPenalty);

  studio.fans = (studio.fans || 0) + fanGain;

  // Prestige Growth: Critic Score, Verdict, Quality
  const criticScoreFactor = movie.criticScore / 100;
  const qualityFactor = movie.quality / 100;
  const prestigeGain = Math.round((criticScoreFactor * 10) + (qualityFactor * 5) + (isSuccess ? 20 : isFailure ? -10 : 0));
  studio.prestige = Math.max(0, (studio.prestige || 0) + prestigeGain);

  // Update Stats
  const s = studio.stats;
  const prevCount = s.moviesReleased;
  s.moviesReleased += 1;
  if (isHit) s.hits += 1;
  if (isBlockbuster) s.blockbusters += 1;
  if (isLegendary) s.allTimeBlockbusters += 1;
  if (isFlop) s.flops += 1;
  if (isDisaster) s.disasters += 1;

  s.totalRevenue += movie.worldwideGross;
  s.totalProfit += movie.profit;
  s.avgCriticScore = ((s.avgCriticScore * prevCount) + movie.criticScore) / s.moviesReleased;
  s.avgAudienceScore = ((s.avgAudienceScore * prevCount) + movie.audienceScore) / s.moviesReleased;

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
  const nextLevelThreshold = studio.studioLevel * 100000;
  if (studio.fans >= nextLevelThreshold) {
    studio.studioLevel += 1;
    addNotification(gameState, `Congratulations! Studio leveled up to ${studio.studioLevel}!`);
  }

  // Notify player when rivals are heavily suppressing growth
  if (marketPenalty < 0.75) {
    addNotification(
      gameState,
      `📉 Market competition is fierce! Rival studios are absorbing audience attention — your fan growth was reduced to ${Math.round(marketPenalty * 100)}% efficiency.`
    );
  }

  return { fanGain, prestigeGain, marketPenalty };
};


/**
 * Syndication Engine
 * Calculates syndication value and processes weekly payouts for TV licensing deals.
 */

export function calculateSyndicationValuation(movie) {
  if (!movie) return { upfrontBonus: 0, weeklyRoyalty: 0, maxDurationWeeks: 12 };

  const boxOffice = movie.boxOffice?.worldwideGross || movie.budget * 0.8 || 1000000;
  const rating = movie.qualityScore || 50;

  // Base valuation from box office & rating
  const upfrontBonus = Math.round(boxOffice * 0.05 + rating * 2500);
  const weeklyRoyalty = Math.round((upfrontBonus / 12) * (0.8 + rating / 100));
  const maxDurationWeeks = rating > 80 ? 52 : rating > 50 ? 26 : 12;

  return {
    upfrontBonus: Math.max(50000, upfrontBonus),
    weeklyRoyalty: Math.max(5000, weeklyRoyalty),
    maxDurationWeeks,
  };
}

export function processWeeklySyndicationDeals(activeDeals = []) {
  let totalPayout = 0;
  const updatedDeals = activeDeals.map((deal) => {
    if (deal.status !== "ACTIVE" || deal.weeksRemaining <= 0) {
      return { ...deal, status: "EXPIRED", weeksRemaining: 0 };
    }

    const payoutThisWeek = deal.weeklyRoyalty;
    totalPayout += payoutThisWeek;

    const remaining = deal.weeksRemaining - 1;
    return {
      ...deal,
      weeksRemaining: remaining,
      totalPayoutCollected: (deal.totalPayoutCollected || 0) + payoutThisWeek,
      status: remaining === 0 ? "EXPIRED" : "ACTIVE",
    };
  });

  return {
    totalPayout,
    updatedDeals,
  };
}

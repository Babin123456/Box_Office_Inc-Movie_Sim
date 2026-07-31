/**
 * Crisis Engine
 * Simulates studio scandals, calculates public relations damage, and processes resolution strategies.
 */

export function evaluateCrisisResolution(crisis, strategy) {
  if (!crisis) return { success: false, damageMitigated: 0, cost: 0 };

  const baseCosts = {
    PUBLIC_APOLOGY: 50000,
    SETTLEMENT_PAYOUT: 250000,
    PRESS_TOUR: 100000,
    LEGAL_ACTION: 500000,
  };

  const mitigationPercentages = {
    PUBLIC_APOLOGY: 0.5,
    SETTLEMENT_PAYOUT: 0.9,
    PRESS_TOUR: 0.7,
    LEGAL_ACTION: 0.95,
  };

  const cost = baseCosts[strategy] || 0;
  const mitigation = mitigationPercentages[strategy] || 0;

  return {
    success: true,
    damageMitigated: Math.round((crisis.reputationDamagePerWeek || 10) * mitigation),
    cost,
  };
}

export function calculateWeeklyReputationImpact(activeCrises = []) {
  let totalDamage = 0;
  activeCrises.forEach((crisis) => {
    if (crisis.status === "ACTIVE") {
      totalDamage += crisis.reputationDamagePerWeek || 5;
    }
  });
  return totalDamage;
}

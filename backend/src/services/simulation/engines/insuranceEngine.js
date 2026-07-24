/**
 * @fileoverview Insurance & Financial Risk Engine
 */

/**
 * Calculates insurance policy premium based on production budget and coverage type.
 * 
 * @param {number} budget - Production budget.
 * @param {string} policyType - Type of insurance.
 * @returns {object} Calculated premium and coverage figures.
 */
export const calculateInsuranceQuote = (budget, policyType) => {
  const safeBudget = Math.max(1000000, budget || 0);
  const premiumRate = policyType === "COMPLETION_BOND" ? 0.02 : policyType === "PRODUCTION_DISASTER" ? 0.015 : 0.01;

  const coverageAmount = Math.round(safeBudget * 0.8);
  const weeklyPremium = Math.round((safeBudget * premiumRate) / 12);

  return {
    policyType,
    coverageAmount,
    weeklyPremium,
  };
};

/**
 * Evaluates insurance claim payout during production delays or budget overruns.
 * 
 * @param {number} actualLoss - Monetary loss incurred.
 * @param {number} maxCoverage - Policy coverage cap.
 * @returns {number} Payout amount.
 */
export const processClaimPayout = (actualLoss, maxCoverage) => {
  const loss = Math.max(0, actualLoss || 0);
  return Math.min(loss, maxCoverage || 0);
};

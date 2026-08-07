/**
 * Facility Engine
 * Calculates maintenance costs, production quality boosts, and third-party rental yields for studio real estate.
 */

export function calculateFacilityUpgrade(facilityType, currentTier = 1) {
  const baseCosts = {
    SOUNDSTAGE_COMPLEX: 500000,
    VFX_VIRTUAL_PRODUCTION_LED: 1200000,
    POST_PRODUCTION_SUITE: 350000,
    BACKLOT_SET: 450000,
  };

  const nextTier = Math.min(5, currentTier + 1);
  const cost = (baseCosts[facilityType] || 500000) * currentTier;
  const qualityBoost = nextTier * 4;
  const maintenanceCostPerWeek = Math.round(cost * 0.01);
  const rentalIncomePerWeek = Math.round(maintenanceCostPerWeek * 1.5);

  return {
    nextTier,
    cost,
    qualityBoost,
    maintenanceCostPerWeek,
    rentalIncomePerWeek,
  };
}

export function processWeeklyFacilities(facilities = []) {
  let totalMaintenance = 0;
  let totalRentalIncome = 0;

  facilities.forEach((f) => {
    totalMaintenance += f.maintenanceCostPerWeek || 0;
    if (f.isRentedToThirdParty) {
      totalRentalIncome += f.rentalIncomePerWeek || 0;
    }
  });

  return {
    totalMaintenance,
    totalRentalIncome,
    netFinancialFlow: totalRentalIncome - totalMaintenance,
  };
}

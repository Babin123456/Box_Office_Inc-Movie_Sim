/**
 * Agency Engine
 * Evaluates talent agency relationship scores, package discount rates, and agency perks.
 */

export function calculatePackageDiscount(relationshipScore = 50, talentCount = 3) {
  const baseDiscount = 0.05; // 5% base discount for agency packages
  const relationshipBonus = (relationshipScore / 100) * 0.10; // up to 10%
  const bulkBonus = talentCount >= 3 ? 0.05 : 0; // 5% for 3+ talent bundle

  const totalDiscount = Math.min(0.25, baseDiscount + relationshipBonus + bulkBonus);

  return {
    discountPercentage: Math.round(totalDiscount * 100),
    relationshipTier: relationshipScore >= 80 ? "PREFERRED" : relationshipScore >= 40 ? "STANDARD" : "RESTRICTED",
  };
}

export function evaluatePackageCommission(packageValue, discountPct) {
  const finalPrice = Math.round(packageValue * (1 - discountPct / 100));
  const agencyCommission = Math.round(finalPrice * 0.10);

  return {
    originalValue: packageValue,
    finalPrice,
    agencyCommission,
  };
}

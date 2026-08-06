import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateFacilityUpgrade,
  processWeeklyFacilities,
} from "../src/services/simulation/engines/facilityEngine.js";

describe("Facility Engine Unit Tests", () => {
  it("calculateFacilityUpgrade returns correct cost and quality boost", () => {
    const details = calculateFacilityUpgrade("VFX_VIRTUAL_PRODUCTION_LED", 1);

    assert.strictEqual(details.nextTier, 2);
    assert.strictEqual(details.cost, 1200000);
    assert.strictEqual(details.qualityBoost, 8);
  });

  it("processWeeklyFacilities calculates maintenance costs and rental income", () => {
    const facilities = [
      { maintenanceCostPerWeek: 10000, rentalIncomePerWeek: 15000, isRentedToThirdParty: true },
      { maintenanceCostPerWeek: 5000, rentalIncomePerWeek: 7500, isRentedToThirdParty: false },
    ];

    const result = processWeeklyFacilities(facilities);

    assert.strictEqual(result.totalMaintenance, 15000);
    assert.strictEqual(result.totalRentalIncome, 15000);
    assert.strictEqual(result.netFinancialFlow, 0);
  });
});

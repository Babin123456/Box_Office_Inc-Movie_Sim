import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculatePackageDiscount, evaluatePackageCommission } from "../src/services/simulation/engines/agencyEngine.js";

describe("Agency Engine Unit Tests", () => {
  it("calculatePackageDiscount returns valid discount pct and tier", () => {
    const result = calculatePackageDiscount(85, 3);

    assert.strictEqual(result.relationshipTier, "PREFERRED");
    assert.ok(result.discountPercentage > 15);
  });

  it("evaluatePackageCommission applies discount correctly to package price", () => {
    const costInfo = evaluatePackageCommission(1000000, 20);

    assert.strictEqual(costInfo.finalPrice, 800000);
    assert.strictEqual(costInfo.agencyCommission, 80000);
  });
});

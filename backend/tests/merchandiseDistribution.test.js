import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateMerchandiseValuation } from "../src/services/merchandiseEngine.js";

describe("Merchandise Distribution Engine Unit Tests", () => {
  it("calculateMerchandiseValuation returns correct advance royalty and inventory figures", () => {
    const movie = {
      title: "Blockbuster Action Movie",
      boxOfficeTotal: 100000000,
      rating: 85,
      budget: 50000000,
    };

    const valuation = calculateMerchandiseValuation(movie, "ACTION_FIGURES", "GLOBAL_EXCLUSIVE");

    assert.ok(valuation.advanceRoyalty > 0, "Advance royalty should be positive");
    assert.strictEqual(valuation.royaltyPercentage, 25, "Global exclusive tier should have 25% royalty");
    assert.ok(valuation.inventoryUnits > 5000, "Global exclusive should have boosted inventory");
  });

  it("calculateMerchandiseValuation calculates appropriate baseline for low rating film", () => {
    const movie = {
      title: "Low Budget Film",
      boxOfficeTotal: 2000000,
      rating: 30,
      budget: 1000000,
    };

    const valuation = calculateMerchandiseValuation(movie, "APPAREL", "STANDARD");

    assert.ok(valuation.advanceRoyalty > 0, "Advance royalty should be greater than 0");
    assert.strictEqual(valuation.royaltyPercentage, 12, "Standard tier royalty should be 12%");
  });
});

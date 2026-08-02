import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateSyndicationValuation,
  processWeeklySyndicationDeals,
} from "../src/services/simulation/engines/syndicationEngine.js";

describe("Syndication Engine Unit Tests", () => {
  it("calculateSyndicationValuation returns valid upfront and weekly figures", () => {
    const movie = {
      boxOffice: { worldwideGross: 50000000 },
      qualityScore: 85,
    };
    const valuation = calculateSyndicationValuation(movie);

    assert.ok(valuation.upfrontBonus > 0, "upfront bonus should be > 0");
    assert.ok(valuation.weeklyRoyalty > 0, "weekly royalty should be > 0");
    assert.strictEqual(valuation.maxDurationWeeks, 52);
  });

  it("processWeeklySyndicationDeals deducts remaining weeks and collects royalties", () => {
    const activeDeals = [
      { id: "1", weeklyRoyalty: 10000, weeksRemaining: 5, status: "ACTIVE" },
      { id: "2", weeklyRoyalty: 5000, weeksRemaining: 1, status: "ACTIVE" },
    ];

    const result = processWeeklySyndicationDeals(activeDeals);

    assert.strictEqual(result.totalPayout, 15000);
    assert.strictEqual(result.updatedDeals[0].weeksRemaining, 4);
    assert.strictEqual(result.updatedDeals[0].status, "ACTIVE");
    assert.strictEqual(result.updatedDeals[1].weeksRemaining, 0);
    assert.strictEqual(result.updatedDeals[1].status, "EXPIRED");
  });
});

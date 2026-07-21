import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateInsuranceQuote, processClaimPayout } from "../src/services/simulation/engines/insuranceEngine.js";

describe("Insurance Engine Unit Tests", () => {
  test("calculateInsuranceQuote returns coverage and premium details", () => {
    const quote = calculateInsuranceQuote(10000000, "COMPLETION_BOND");
    assert.ok(quote.coverageAmount > 0);
    assert.ok(quote.weeklyPremium > 0);
  });

  test("processClaimPayout clamps payout to maximum policy coverage", () => {
    const payout = processClaimPayout(5000000, 3000000);
    assert.equal(payout, 3000000);
  });
});

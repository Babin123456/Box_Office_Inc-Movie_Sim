import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateCrisisResolution,
  calculateWeeklyReputationImpact,
} from "../src/services/simulation/engines/crisisEngine.js";

describe("Crisis Engine Unit Tests", () => {
  it("evaluateCrisisResolution calculates cost and damage mitigation", () => {
    const crisis = { reputationDamagePerWeek: 20 };
    const resolution = evaluateCrisisResolution(crisis, "SETTLEMENT_PAYOUT");

    assert.strictEqual(resolution.cost, 250000);
    assert.strictEqual(resolution.damageMitigated, 18);
  });

  it("calculateWeeklyReputationImpact sums damage of active crises", () => {
    const activeCrises = [
      { status: "ACTIVE", reputationDamagePerWeek: 10 },
      { status: "RESOLVED", reputationDamagePerWeek: 15 },
      { status: "ACTIVE", reputationDamagePerWeek: 5 },
    ];
    const totalDamage = calculateWeeklyReputationImpact(activeCrises);

    assert.strictEqual(totalDamage, 15);
  });
});

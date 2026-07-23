import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateFestivalPrestige } from "../src/services/simulation/engines/awardsEngine.js";

describe("Film Festival Engine Unit Tests", () => {
  test("calculateFestivalPrestige awards correct prestige points for awards", () => {
    assert.equal(calculateFestivalPrestige("PALME_D_OR"), 1000);
    assert.equal(calculateFestivalPrestige("GRAND_PRIX"), 600);
    assert.equal(calculateFestivalPrestige("NONE"), 0);
  });
});

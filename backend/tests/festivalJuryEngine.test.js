import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  deliberateFestivalJury,
  generateDistributorOffers,
  FESTIVAL_PROFILES,
} from "../src/services/festival/festivalJuryEngine.js";

describe("Film Festival Jury & Distribution Engine", () => {
  it("should deliberate Cannes panel and award Palme d'Or for masterpiece quality film", () => {
    const movie = {
      title: "The Winter Garden",
      quality: 94,
      criticScore: 92,
    };

    const deliberation = deliberateFestivalJury(movie, "CANNES");

    assert.equal(deliberation.festivalName, "CANNES");
    assert.ok(deliberation.juryScore >= 88, `Expected score >= 88, got ${deliberation.juryScore}`);
    assert.equal(deliberation.status, "AWARDED");
    assert.equal(deliberation.awardWon, "PALME_D_OR");
    assert.ok(deliberation.standingOvationMinutes >= 7, "Masterpiece should receive substantial standing ovation");
    assert.ok(deliberation.criticHypeBoost >= 1.3, "Prestige boost should match Cannes top tier");
    assert.ok(deliberation.pillarScores.direction >= 85);
    assert.ok(deliberation.pillarScores.screenplay >= 80);
  });

  it("should deliberate Venice panel and award Golden Lion with profound critique quote", () => {
    const movie = {
      title: "Lido Shadows",
      quality: 91,
      criticScore: 89,
    };

    const deliberation = deliberateFestivalJury(movie, "VENICE");

    assert.equal(deliberation.festivalName, "VENICE");
    assert.equal(deliberation.status, "AWARDED");
    assert.equal(deliberation.awardWon, "GOLDEN_LION");
    assert.ok(deliberation.standingOvationMinutes >= 6);
    assert.ok(deliberation.consensusQuote.length > 20);
  });

  it("should handle mixed-reception indie at Sundance with moderate score and Grand Jury Prize cutoff", () => {
    const indieMovie = {
      title: "Midnight Diner",
      quality: 82,
      criticScore: 81,
    };

    const deliberation = deliberateFestivalJury(indieMovie, "SUNDANCE");

    assert.equal(deliberation.festivalName, "SUNDANCE");
    assert.equal(deliberation.status, "AWARDED");
    assert.equal(deliberation.awardWon, "AUDIENCE_AWARD");
  });

  it("should reject low-quality movies with zero standing ovation", () => {
    const poorMovie = {
      title: "Rushed Sequel",
      quality: 35,
      criticScore: 40,
    };

    const deliberation = deliberateFestivalJury(poorMovie, "TIFF");

    assert.equal(deliberation.status, "REJECTED");
    assert.equal(deliberation.awardWon, "NONE");
    assert.equal(deliberation.standingOvationMinutes, 0);
  });

  it("should generate competing distributor bids with advances and marketing commitments for acclaimed films", () => {
    const juryScore = 88;
    const budget = 2000000;

    const bids = generateDistributorOffers(juryScore, budget);

    assert.ok(bids.length >= 3, "Expected at least 3 competing distributor bids");
    for (const bid of bids) {
      assert.ok(bid.distributorName, "Bid must specify distributor name");
      assert.ok(bid.advancePayment > budget * 0.5, "Advance should cover significant production cost");
      assert.ok(bid.boxOfficeRoyaltyCut >= 10 && bid.boxOfficeRoyaltyCut <= 25);
      assert.ok(bid.marketingCommitment >= 500000);
      assert.ok(bid.territory.includes("Worldwide"));
    }
  });

  it("should return empty distributor offers if jury score is below acquisition threshold", () => {
    const bids = generateDistributorOffers(50, 1500000);
    assert.equal(bids.length, 0, "No distributor should acquire a film scoring under 65");
  });
});

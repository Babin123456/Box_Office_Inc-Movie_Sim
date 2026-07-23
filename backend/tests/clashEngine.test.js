import test from "node:test";
import assert from "node:assert";
import { computeClashPenalty } from "../src/services/simulation/engines/clashEngine.js";

// Helper to build mock gameState
const makeGameState = (rivalStudios = []) => ({
  currentWeek: 5,
  marketScripts: [{ id: "script1", genres: ["Action"] }],
  ownedScripts: [],
  rivalStudios
});

test("clashEngine: computeClashPenalty returns 1.0 when no competitors", () => {
  const gameState = makeGameState([]);
  const movie = { scriptId: "script1" };

  const result = computeClashPenalty(gameState, movie, []);
  assert.strictEqual(result.boxOfficeMultiplier, 1.0);
  assert.strictEqual(result.marketingMultiplier, 1.0);
  assert.strictEqual(result.clashedWith.length, 0);
});

test("clashEngine: computeClashPenalty returns 0.85 when 1 same-genre rival competitor", () => {
  const gameState = makeGameState([
    {
      name: "Rival A",
      activeMovies: [{ title: "Rival Film", genre: "Action", weeksRemaining: 0 }]
    }
  ]);
  const movie = { scriptId: "script1" };

  const result = computeClashPenalty(gameState, movie, []);
  assert.strictEqual(result.boxOfficeMultiplier, 0.85);
  assert.strictEqual(result.marketingMultiplier, 0.80);
  assert.deepStrictEqual(result.clashedWith, ["Rival A's \"Rival Film\""]);
});

test("clashEngine: computeClashPenalty returns 0.70 when 2 same-genre rival competitors", () => {
  const gameState = makeGameState([
    {
      name: "Rival A",
      activeMovies: [{ title: "Rival Film 1", genre: "Action", weeksRemaining: 0 }]
    },
    {
      name: "Rival B",
      activeMovies: [{ title: "Rival Film 2", genre: "Action", weeksRemaining: 0 }]
    }
  ]);
  const movie = { scriptId: "script1" };

  const result = computeClashPenalty(gameState, movie, []);
  assert.strictEqual(result.boxOfficeMultiplier, 0.70);
  assert.strictEqual(result.marketingMultiplier, 0.65);
  assert.ok(result.clashedWith.includes("Rival A's \"Rival Film 1\""));
  assert.ok(result.clashedWith.includes("Rival B's \"Rival Film 2\""));
});

test("clashEngine: computeClashPenalty ignores rivals with non-matching genre", () => {
  const gameState = makeGameState([
    {
      name: "Rival A",
      activeMovies: [{ title: "Comedy Film", genre: "Comedy", weeksRemaining: 0 }]
    }
  ]);
  const movie = { scriptId: "script1" }; // genres: ["Action"]

  const result = computeClashPenalty(gameState, movie, []);
  assert.strictEqual(result.boxOfficeMultiplier, 1.0);
  assert.strictEqual(result.marketingMultiplier, 1.0);
  assert.strictEqual(result.clashedWith.length, 0);
});

test("clashEngine: computeClashPenalty ignores rivals still in production", () => {
  const gameState = makeGameState([
    {
      name: "Rival A",
      activeMovies: [{ title: "Action Film", genre: "Action", weeksRemaining: 5 }]
    }
  ]);
  const movie = { scriptId: "script1" };

  const result = computeClashPenalty(gameState, movie, []);
  assert.strictEqual(result.boxOfficeMultiplier, 1.0);
  assert.strictEqual(result.clashedWith.length, 0);
});

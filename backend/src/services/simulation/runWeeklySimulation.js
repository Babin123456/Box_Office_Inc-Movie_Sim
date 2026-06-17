import { processWeeklyTick } from "./engines/tickEngine.js";

export const runWeeklySimulation = async (gameState, studio) => {
  gameState.currentWeek += 1;

  const result = await processWeeklyTick(gameState, studio);

  // processWeeklyTick returns { gameState, rivalReleases }
  return result.rivalReleases || [];
};


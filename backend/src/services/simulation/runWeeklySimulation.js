import { processWeeklyTick } from "./engines/tickEngine.js";

export const runWeeklySimulation = async (gameState, studio) => {
  gameState.currentWeek += 1;

  await processWeeklyTick(gameState, studio);
};

import { processDirectorAwards } from "../../director/directorAwardsService.js";
import { processDirectorAging } from "./directorEngine.js";
import { processDirectingProjects } from "./directingProjectEngine.js";
import { processProduction } from "./productionEngine.js";
import { processWriterPayroll } from "./payrollEngine.js";
import { processWritingProjects } from "./writerEngine.js";
import { processMarketTrends } from "./trendEngine.js";
import { generateRivalStudios, processRivalStudios } from "./rivalStudioEngine.js";

import { addNotification } from "../helpers/notificationHelper.js";
import { processWriterAging } from "../helpers/agingHelper.js";

export const processWeeklyTick = async (gameState, studio) => {
  // Initialize rival studios on the very first tick (once per game)
  generateRivalStudios(gameState);

  // Advance the market climate first so any releases this tick reflect the
  // current week's active trends.
  const trendMessages = processMarketTrends(gameState);
  trendMessages.forEach((msg) => addNotification(gameState, msg));

  processWriterPayroll(gameState, studio);

  await processWritingProjects(gameState, studio);

  processDirectingProjects(gameState, studio);

  await processProduction(gameState, studio);

  // Tick rival studios — collect their releases for the weekly summary
  const rivalReleases = processRivalStudios(gameState);

  processWriterAging(gameState);

  processDirectorAging(gameState);

  processDirectorAwards(gameState, studio);

  return { gameState, rivalReleases };
};


export default processWeeklyTick;


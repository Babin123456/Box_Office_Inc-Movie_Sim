import GameState from "../models/GameState.js";
import Studio from "../models/Studio.js";
import { runWeeklySimulation } from "../services/simulation/runWeeklySimulation.js";

export const simulateWeek = async (req, res) => {
  try {
    const { weeks = 1 } = req.body;
    const numWeeks = Math.min(52, Math.max(1, Number(weeks)));

    const gameState = await GameState.findOne({ user: req.user._id });
    const studio = await Studio.findOne({ owner: req.user._id });

    if (!gameState || !studio) {
      return res.status(404).json({ message: "Game state or studio not found" });
    }

    const startWeek = gameState.currentWeek;
    const startFans = studio.fans || 0;
    const startPrestige = studio.prestige || 0;
    const initialNotificationCount = (gameState.notifications || []).length;

    // Run simulation multiple times
    for (let i = 0; i < numWeeks; i++) {
      await runWeeklySimulation(gameState, studio);
    }

    await studio.save();
    await gameState.save();

    const endFans = studio.fans || 0;
    const endPrestige = studio.prestige || 0;
    const newNotifications = (gameState.notifications || []).slice(initialNotificationCount);

    // Summary data
    const summary = {
      weeksSimulated: numWeeks,
      startWeek,
      endWeek: gameState.currentWeek,
      fansGained: endFans - startFans,
      prestigeGained: endPrestige - startPrestige,
      notificationCount: newNotifications.length,
      newNotifications: newNotifications.slice(-10) // Last 10
    };

    res.status(200).json({
      message: `${numWeeks} week(s) simulated successfully`,
      currentWeek: gameState.currentWeek,
      summary
    });
  } catch (error) {
    console.error("Simulation Error:", error);
    res.status(500).json({ message: "Simulation failed" });
  }
};

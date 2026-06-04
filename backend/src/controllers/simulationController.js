import GameState from "../models/GameState.js";
import { runWeeklySimulation } from "../services/simulation/runWeeklySimulation.js";

export const simulateWeek = async (req, res) => {
  try {
    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    if (!gameState) {
      return res.status(404).json({
        message: "Game state not found",
      });
    }

    await runWeeklySimulation(gameState);

    await gameState.save();

    res.status(200).json({
      message: "Week simulated successfully",

      currentWeek: gameState.currentWeek,
    });
  } catch (error) {
    res.status(500).json({
      message: "Simulation failed",
    });
  }
};

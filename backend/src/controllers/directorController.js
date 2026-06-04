import GameState from "../models/GameState.js";
import { generateDirectors } from "../services/director/directorGenerator.js";

const findGameState = async (userId) => GameState.findOne({ user: userId });

export const getMarketDirectors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    if (!gameState.marketDirectors || gameState.marketDirectors.length === 0) {
      gameState.marketDirectors = generateDirectors(100);
      await gameState.save();
    }

    res.status(200).json({
      success: true,
      directors: gameState.marketDirectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnedDirectors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    res.status(200).json({
      success: true,
      directors: gameState.ownedDirectors || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const hireDirector = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const marketDirector = gameState.marketDirectors[index];

    if (!marketDirector) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    const director = marketDirector.toObject
      ? marketDirector.toObject()
      : { ...marketDirector };

    director.status = "AVAILABLE";
    director.hiredAt = new Date();

    gameState.marketDirectors.splice(index, 1);
    gameState.ownedDirectors.push(director);

    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Director hired",
      director,
      marketDirectors: gameState.marketDirectors,
      ownedDirectors: gameState.ownedDirectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fireDirector = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const ownedDirector = gameState.ownedDirectors[index];

    if (!ownedDirector) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    const director = ownedDirector.toObject
      ? ownedDirector.toObject()
      : { ...ownedDirector };

    director.status = "AVAILABLE";
    delete director.hiredAt;

    gameState.ownedDirectors.splice(index, 1);
    gameState.marketDirectors.push(director);

    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Director released to market",
      director,
      marketDirectors: gameState.marketDirectors,
      ownedDirectors: gameState.ownedDirectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

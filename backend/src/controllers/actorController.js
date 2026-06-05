import GameState from "../models/GameState.js";
import { generateActors } from "../services/actor/actorGenerator.js";
import { presentActors } from "../services/actor/actorPresenter.js";

const ACTOR_MARKET_SIZE = 1000;

const findGameState = async (userId) => GameState.findOne({ user: userId });

export const getMarketActors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    if (!gameState.marketActors || gameState.marketActors.length === 0) {
      gameState.marketActors = generateActors(ACTOR_MARKET_SIZE);
      await gameState.save();
    }

    return res.status(200).json({
      success: true,
      actors: presentActors(gameState.marketActors),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnedActors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    return res.status(200).json({
      success: true,
      actors: presentActors(gameState.ownedActors || []),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const hireActor = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const marketActor = gameState.marketActors?.[Number(index)];

    if (!marketActor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    const actor = marketActor.toObject ? marketActor.toObject() : { ...marketActor };

    if (actor.status === "RETIRED") {
      return res.status(400).json({
        success: false,
        message: "Retired actors cannot be hired",
      });
    }

    actor.status = "AVAILABLE";
    actor.hiredAt = new Date();

    gameState.marketActors.splice(Number(index), 1);
    gameState.ownedActors = gameState.ownedActors || [];
    gameState.ownedActors.push(actor);

    gameState.notifications.push({
      message: `${actor.name} was hired as an actor.`,
      createdAt: new Date(),
    });

    await gameState.save();

    return res.status(200).json({
      success: true,
      message: "Actor hired",
      actor,
      marketActors: presentActors(gameState.marketActors || []),
      ownedActors: presentActors(gameState.ownedActors || []),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fireActor = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const ownedActor = gameState.ownedActors?.[Number(index)];

    if (!ownedActor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    if (ownedActor.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "Actor is assigned to an active project and cannot be released.",
      });
    }

    const actor = ownedActor.toObject ? ownedActor.toObject() : { ...ownedActor };
    actor.status = "AVAILABLE";
    actor.busyUntilWeek = null;
    delete actor.hiredAt;

    gameState.ownedActors.splice(Number(index), 1);
    gameState.marketActors = gameState.marketActors || [];
    gameState.marketActors.push(actor);

    gameState.notifications.push({
      message: `${actor.name} was released to the actor market.`,
      createdAt: new Date(),
    });

    await gameState.save();

    return res.status(200).json({
      success: true,
      message: "Actor released to market",
      actor,
      marketActors: presentActors(gameState.marketActors || []),
      ownedActors: presentActors(gameState.ownedActors || []),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

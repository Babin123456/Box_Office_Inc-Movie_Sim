import Movie from "../models/Movie.js";
import GameState from "../models/GameState.js";
import Studio from "../models/Studio.js";

const findGameState = async (userId) => GameState.findOne({ user: userId });

export const createMovie = async (req, res) => {
  try {
    const { title, scriptId, directorId, leadActorId, supportingActorIds, marketingBudget } = req.body;

    if (!title || !scriptId || !directorId || !leadActorId || !req.body.crewTeamId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const gameState = await findGameState(req.user._id);
    const studio = await Studio.findOne({ owner: req.user._id });

    if (!gameState || !studio) {
      return res.status(404).json({ success: false, message: "Game state or studio not found" });
    }

    // Validate Script
    const scriptIndex = gameState.ownedScripts.findIndex(s => s.id === scriptId);
    if (scriptIndex === -1) return res.status(404).json({ success: false, message: "Script not found" });
    const script = gameState.ownedScripts[scriptIndex];
    if (script.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Script is not available" });

    // Validate Director
    const director = gameState.ownedDirectors.find(d => d.id === directorId);
    if (!director) return res.status(404).json({ success: false, message: "Director not found" });
    if (director.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Director is busy" });

    // Validate Lead Actor
    const leadActor = gameState.ownedActors.find(a => a.id === leadActorId);
    if (!leadActor) return res.status(404).json({ success: false, message: "Lead actor not found" });
    if (leadActor.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Lead actor is busy" });

    // Validate Crew Team
    const crewTeam = gameState.ownedCrewTeams.find(c => c.id === req.body.crewTeamId);
    if (!crewTeam) return res.status(404).json({ success: false, message: "Crew team not found" });
    if (crewTeam.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Crew team is busy" });

    // Validate Studio Money for Marketing Budget
    if (studio.money < (marketingBudget || 0)) {
        return res.status(400).json({ success: false, message: "Insufficient funds for marketing" });
    }

    // Formula Implementation
    // quality = Script Quality → 35% + Director Creativity → 25% + Lead Actor Skill → 20% + Crew Technical Quality → 20%
    const quality = Math.round(
      (script.quality * 0.35) +
      (director.creativity * 0.25) +
      (leadActor.actingSkill * 0.20) +
      (crewTeam.technicalQuality * 0.20)
    );

    // Hype = Lead Actor Popularity + Director Reputation + Marketing Budget influence
    // For now, let's normalize marketing budget influence. e.g., 100k = +10 hype, 1M = +30 hype
    const marketingHype = Math.min(40, Math.floor(Math.log10((marketingBudget || 0) + 1) * 5));
    const hype = Math.min(100, Math.round(
      (leadActor.popularity * 0.4) +
      (director.reputation * 0.3) +
      marketingHype
    ));

    const movie = await Movie.create({
      title,
      studioId: studio._id,
      scriptId,
      directorId,
      leadActorId,
      supportingActorIds: supportingActorIds || [],
      crewTeamId: crewTeam.id,
      budget: 0, // Will accumulate or be set
      marketingBudget: marketingBudget || 0,
      quality,
      hype,
      status: "PRE_PRODUCTION",
      createdWeek: gameState.currentWeek,
      productionProgress: 0
    });

    // Update statuses
    script.status = "SOLD"; // Or a new "IN_PRODUCTION" status
    director.status = "BUSY";
    director.busyUntilWeek = gameState.currentWeek + 20; // Approx
    leadActor.status = "BUSY";
    leadActor.busyUntilWeek = gameState.currentWeek + 20;
    crewTeam.status = "BUSY";
    crewTeam.busyUntilWeek = gameState.currentWeek + 20;

    // Deduct marketing budget
    studio.money -= (marketingBudget || 0);

    gameState.activeMovies.push(movie._id);

    gameState.notifications.push({
        message: `Production started for "${title}". Quality: ${quality}, Hype: ${hype}`,
        createdAt: new Date()
    });

    await studio.save();
    await gameState.save();

    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveMovies = async (req, res) => {
    try {
        const gameState = await findGameState(req.user._id);
        if (!gameState) return res.status(404).json({ success: false, message: "Game state not found" });

        const movies = await Movie.find({ _id: { $in: gameState.activeMovies } });
        res.status(200).json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMovieDetails = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
        res.status(200).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

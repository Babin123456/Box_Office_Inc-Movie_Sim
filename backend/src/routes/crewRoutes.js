import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMarketCrewTeams,
  getOwnedCrewTeams,
  hireCrewTeam,
  fireCrewTeam,
} from "../controllers/crewController.js";

const router = express.Router();

router.get("/", protect, getMarketCrewTeams);
router.get("/owned", protect, getOwnedCrewTeams);
router.post("/hire/:index", protect, hireCrewTeam);
router.post("/fire/:index", protect, fireCrewTeam);

export default router;

import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { simulateWeek } from "../controllers/simulationController.js";

const router = express.Router();

router.post("/next-week", protect, simulateWeek);

export default router;

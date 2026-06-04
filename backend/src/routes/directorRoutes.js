import express from "express";

import {
  getMarketDirectors,
  getOwnedDirectors,
  hireDirector,
  fireDirector,
} from "../controllers/directorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMarketDirectors);

router.get("/owned", protect, getOwnedDirectors);

router.post("/hire/:index", protect, hireDirector);

router.post("/fire/:index", protect, fireDirector);

export default router;

import express from "express";

import {
  getMarketDirectors,
  getOwnedDirectors,
  getDirectorProfile,
  hireDirector,
  fireDirector,
  replaceDirector,
} from "../controllers/directorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMarketDirectors);

router.get("/owned", protect, getOwnedDirectors);

router.get("/:id", protect, getDirectorProfile);

router.post("/hire/:index", protect, hireDirector);

router.post("/fire/:index", protect, fireDirector);

router.post("/replace-director", protect, replaceDirector);

export default router;

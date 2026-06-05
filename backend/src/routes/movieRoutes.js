import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createMovie,
  getActiveMovies,
  getReleasedMovies,
  releaseMovie,
  getMovieDetails,
  generateTitle,
} from "../controllers/movieController.js";

const router = express.Router();

router.post("/", protect, createMovie);
router.get("/generate-title", protect, generateTitle);
router.get("/active", protect, getActiveMovies);
router.get("/released", protect, getReleasedMovies);
router.post("/:id/release", protect, releaseMovie);
router.get("/:id", protect, getMovieDetails);

export default router;

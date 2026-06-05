import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createMovie,
  getActiveMovies,
  getMovieDetails,
} from "../controllers/movieController.js";

const router = express.Router();

router.post("/", protect, createMovie);
router.get("/active", protect, getActiveMovies);
router.get("/:id", protect, getMovieDetails);

export default router;

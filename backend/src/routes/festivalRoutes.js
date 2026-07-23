/**
 * @fileoverview Film Festival Routes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitToFestival, getActiveSubmissions } from "../controllers/festivalController.js";

const router = express.Router();

router.use(protect);

router.post("/submit", submitToFestival);
router.get("/active", getActiveSubmissions);

export default router;

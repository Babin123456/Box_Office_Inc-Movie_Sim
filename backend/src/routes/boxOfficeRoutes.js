/**
 * @fileoverview Box Office Routes
 * 
 * Express routing definitions for Box Office Telemetry and Analytics API endpoints.
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  validateBoxOfficeAnalyticsSchema,
  validateClashAnalyticsSchema,
} from "../validators/boxOfficeValidator.js";
import {
  getBoxOfficeAnalytics,
  getRegionalSummary,
  getBoxOfficeClashAnalytics,
} from "../controllers/boxOfficeController.js";

const router = express.Router();

router.use(protect);

// Regional summary statistics across all global distribution territories
router.get("/regional-summary", getRegionalSummary);

// Granular telemetry for a specific movie release
router.get("/analytics/:movieId", validate(validateBoxOfficeAnalyticsSchema), getBoxOfficeAnalytics);

// Head-to-head opening weekend screen collision and competition clash data
router.get("/clash-analytics/:movieId", validate(validateClashAnalyticsSchema), getBoxOfficeClashAnalytics);

export default router;

/**
 * @fileoverview Film Festival Routes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  submitToFestival,
  getActiveSubmissions,
  withdrawSubmission,
  acceptDistributionDeal,
  getFestivalLaurels,
} from "../controllers/festivalController.js";
import {
  validateFestivalSubmissionSchema,
  validateFestivalWithdrawSchema,
  validateAcceptDistributionSchema,
} from "../validators/festivalValidator.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/submit", validate(validateFestivalSubmissionSchema), submitToFestival);
router.get("/active", getActiveSubmissions);
router.post("/withdraw", validate(validateFestivalWithdrawSchema), withdrawSubmission);
router.post("/accept-distribution", validate(validateAcceptDistributionSchema), acceptDistributionDeal);
router.get("/laurels", getFestivalLaurels);

export default router;

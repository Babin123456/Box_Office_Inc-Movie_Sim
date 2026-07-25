/**
 * @fileoverview Film Festival Routes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitToFestival, getActiveSubmissions, withdrawSubmission } from "../controllers/festivalController.js";
import { validateFestivalSubmissionSchema, validateFestivalWithdrawSchema } from "../validators/festivalValidator.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/submit", validate(validateFestivalSubmissionSchema), submitToFestival);
router.get("/active", getActiveSubmissions);
router.post("/withdraw", validate(validateFestivalWithdrawSchema), withdrawSubmission);

export default router;


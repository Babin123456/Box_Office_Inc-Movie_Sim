import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { getActiveCrises, resolveCrisis } from "../controllers/crisisController.js";
import { resolveCrisisSchema } from "../validators/crisisValidators.js";

const router = express.Router();

router.use(protect);

router.get("/active", getActiveCrises);
router.post("/resolve", validateRequest(resolveCrisisSchema), resolveCrisis);

export default router;

/**
 * @fileoverview Insurance Routes
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { purchasePolicy, getActivePolicies } from "../controllers/insuranceController.js";
import { purchaseInsuranceSchema } from "../validators/insuranceValidators.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/policies", validate(purchaseInsuranceSchema), purchasePolicy);
router.get("/policies", getActivePolicies);

export default router;

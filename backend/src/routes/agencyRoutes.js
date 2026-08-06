import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import { getStudioAgencies, signAgencyPackage } from "../controllers/agencyController.js";
import { signAgencyPackageSchema } from "../validators/agencyValidators.js";

const router = express.Router();

router.use(protect);

router.get("/agencies", getStudioAgencies);
router.post("/package", validateRequest(signAgencyPackageSchema), signAgencyPackage);

export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import {
  getStudioAgencies,
  getAvailablePackages,
  signAgencyPackage,
} from "../controllers/agencyController.js";
import { signAgencyPackageSchema } from "../validators/agencyValidators.js";

const router = express.Router();

router.use(protect);

// Both / and /agencies provide agency standing details
router.get("/", getStudioAgencies);
router.get("/agencies", getStudioAgencies);
router.get("/available-packages", getAvailablePackages);
router.post("/package", validateRequest(signAgencyPackageSchema), signAgencyPackage);

export default router;

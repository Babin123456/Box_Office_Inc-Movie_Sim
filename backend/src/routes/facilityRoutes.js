import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import {
  getStudioFacilities,
  buildFacility,
  toggleFacilityRental,
} from "../controllers/facilityController.js";
import { buildFacilitySchema, toggleRentalSchema } from "../validators/facilityValidators.js";

const router = express.Router();

router.use(protect);

router.get("/list", getStudioFacilities);
router.post("/build", validateRequest(buildFacilitySchema), buildFacility);
router.post("/rental", validateRequest(toggleRentalSchema), toggleFacilityRental);

export default router;

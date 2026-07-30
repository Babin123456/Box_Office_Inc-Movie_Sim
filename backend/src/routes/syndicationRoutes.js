import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validationMiddleware.js";
import {
  getStudioSyndicationDeals,
  getMovieSyndicationValuation,
  createSyndicationDeal,
} from "../controllers/syndicationController.js";
import { createSyndicationDealSchema } from "../validators/syndicationValidators.js";

const router = express.Router();

router.use(protect);

router.get("/deals", getStudioSyndicationDeals);
router.get("/valuation/:movieId", getMovieSyndicationValuation);
router.post("/deals", validateRequest(createSyndicationDealSchema), createSyndicationDeal);

export default router;

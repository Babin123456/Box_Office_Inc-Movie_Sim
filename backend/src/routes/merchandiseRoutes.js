import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createMerchandiseDeal,
  getStudioMerchandiseDeals,
  getMerchandiseValuation,
  triggerWeeklyMerchandiseProcessing,
} from "../controllers/merchandiseController.js";

const router = express.Router();

router.use(protect);

router.post("/valuation", getMerchandiseValuation);
router.post("/deals", createMerchandiseDeal);
router.get("/deals", getStudioMerchandiseDeals);
router.post("/process-weekly", triggerWeeklyMerchandiseProcessing);

export default router;

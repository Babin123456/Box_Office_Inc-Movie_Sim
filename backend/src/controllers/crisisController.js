import PRCrisis from "../models/PRCrisis.js";
import Studio from "../models/Studio.js";
import { evaluateCrisisResolution } from "../services/simulation/engines/crisisEngine.js";

export const getActiveCrises = async (req, res, next) => {
  try {
    const crises = await PRCrisis.find({ studioId: req.user.studioId, status: "ACTIVE" });
    return res.status(200).json({ success: true, data: crises });
  } catch (error) {
    next(error);
  }
};

export const resolveCrisis = async (req, res, next) => {
  try {
    const { crisisId, strategy } = req.body;

    const crisis = await PRCrisis.findOne({ _id: crisisId, studioId: req.user.studioId });
    if (!crisis) {
      return res.status(404).json({ success: false, message: "Crisis not found" });
    }

    const resolution = evaluateCrisisResolution(crisis, strategy);

    const studio = await Studio.findById(req.user.studioId);
    if (studio.money < resolution.cost) {
      return res.status(400).json({ success: false, message: "Insufficient studio funds for selected PR strategy" });
    }

    studio.money -= resolution.cost;
    await studio.save();

    crisis.status = "RESOLVED";
    crisis.chosenStrategy = strategy;
    crisis.resolutionCost = resolution.cost;
    await crisis.save();

    return res.status(200).json({
      success: true,
      message: `PR crisis successfully resolved using ${strategy}`,
      data: { crisis, resolution },
    });
  } catch (error) {
    next(error);
  }
};

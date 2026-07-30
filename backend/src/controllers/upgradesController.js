import StudioUpgrade from "../models/StudioUpgrade.js";
import Studio from "../models/Studio.js";
import GameState from "../models/GameState.js";
import { STUDIO_UPGRADES as UPGRADES } from "../constants/gameConstants.js";

export const getUpgrades = async (req, res) => {
  try {
    const studio = await Studio.findOne({ owner: req.user._id });
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }

    const purchased = await StudioUpgrade.find({ studioId: studio._id }).lean();
    
    res.status(200).json({
      success: true,
      purchased: purchased.map(p => p.upgradeId),
      available: Object.keys(UPGRADES).map(id => ({ id, ...UPGRADES[id] })),
      studioMoney: studio.money
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buyUpgrade = async (req, res) => {
  try {
    const { upgradeId } = req.body;
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) {
      return res.status(404).json({ success: false, message: "Upgrade details not found" });
    }

    const studio = await Studio.findOne({ owner: req.user._id });
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }

    const alreadyPurchased = await StudioUpgrade.findOne({ studioId: studio._id, upgradeId });
    if (alreadyPurchased) {
      return res.status(400).json({ success: false, message: "This upgrade is already active for your studio" });
    }

    const gameState = await GameState.findOne({ user: req.user._id });
    const currentWeek = gameState?.currentWeek || 1;

    // Atomically deduct cost and award prestige to prevent race conditions
    // from concurrent requests overwriting each other's balance updates.
    const updatedStudio = await Studio.findOneAndUpdate(
      { _id: studio._id, money: { $gte: upgrade.cost } },
      { $inc: { money: -upgrade.cost, prestige: 25 } },
      { returnDocument: "after" }
    );
    if (!updatedStudio) {
      return res.status(400).json({ success: false, message: "Insufficient funds for this studio upgrade" });
    }

    const purchasedUpgrade = await StudioUpgrade.create({
      studioId: studio._id,
      upgradeId,
      purchasedWeek: currentWeek
    });

    res.status(200).json({
      success: true,
      message: `Successfully purchased "${upgrade.name}"! Prestige increased by +25.`,
      purchasedUpgrade,
      studioMoney: updatedStudio.money
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

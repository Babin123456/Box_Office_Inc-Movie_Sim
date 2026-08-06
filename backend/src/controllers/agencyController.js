import TalentAgency from "../models/TalentAgency.js";
import Studio from "../models/Studio.js";
import { calculatePackageDiscount, evaluatePackageCommission } from "../services/simulation/engines/agencyEngine.js";

export const getStudioAgencies = async (req, res, next) => {
  try {
    const agencies = await TalentAgency.find({ studioId: req.user.studioId });
    return res.status(200).json({ success: true, data: agencies });
  } catch (error) {
    next(error);
  }
};

export const signAgencyPackage = async (req, res, next) => {
  try {
    const { agencyName, packageValue, talentCount } = req.body;

    let agency = await TalentAgency.findOne({ studioId: req.user.studioId, agencyName });
    if (!agency) {
      agency = await TalentAgency.create({
        studioId: req.user.studioId,
        agencyName,
        relationshipScore: 50,
      });
    }

    const discountInfo = calculatePackageDiscount(agency.relationshipScore, talentCount);
    const costInfo = evaluatePackageCommission(packageValue, discountInfo.discountPercentage);

    const studio = await Studio.findById(req.user.studioId);
    if (studio.money < costInfo.finalPrice) {
      return res.status(400).json({ success: false, message: "Insufficient studio funds for talent agency package deal" });
    }

    studio.money -= costInfo.finalPrice;
    await studio.save();

    agency.packagedDealsCount += 1;
    agency.relationshipScore = Math.min(100, agency.relationshipScore + 5);
    agency.tier = discountInfo.relationshipTier;
    await agency.save();

    return res.status(201).json({
      success: true,
      message: `Talent package successfully signed with ${agencyName}`,
      data: { agency, costInfo, discountInfo },
    });
  } catch (error) {
    next(error);
  }
};

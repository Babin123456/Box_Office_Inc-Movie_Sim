import TalentAgency from "../models/TalentAgency.js";
import Studio from "../models/Studio.js";
import { calculatePackageDiscount, evaluatePackageCommission } from "../services/simulation/engines/agencyEngine.js";
import {
  MAJOR_AGENCIES,
  AGENCY_PACKAGES_CATALOG,
  getPackagesForAgency,
} from "../services/agency/agencyPackagingEngine.js";
import { withTransaction } from "../utils/financeTransactionHelper.js";

const resolveStudioId = async (req) => {
  if (req.user.studioId) return req.user.studioId;
  const studio = await Studio.findOne({ owner: req.user._id });
  return studio?._id;
};

export const getStudioAgencies = async (req, res, next) => {
  try {
    const studioId = await resolveStudioId(req);
    if (!studioId) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }

    let agencies = await TalentAgency.find({ studioId });

    // Seed default profiles for all 4 major agencies if first time viewing
    if (!agencies || agencies.length === 0) {
      const initialDocs = MAJOR_AGENCIES.map((a) => ({
        studioId,
        agencyName: a.name,
        relationshipScore: a.baseRelationship,
        tier: "STANDARD",
        packagedDealsCount: 0,
      }));
      agencies = await TalentAgency.insertMany(initialDocs);
    }

    // Augment with agency specialty details
    const augmented = agencies.map((doc) => {
      const meta = MAJOR_AGENCIES.find((m) => m.name === doc.agencyName) || {};
      return {
        ...doc.toObject(),
        specialty: meta.specialty || "Film & Television Representation",
        perk: meta.perk || "Talent Packaging Access",
      };
    });

    return res.status(200).json({ success: true, data: augmented });
  } catch (error) {
    next(error);
  }
};

export const getAvailablePackages = async (req, res, next) => {
  try {
    const studioId = await resolveStudioId(req);
    const agencies = studioId ? await TalentAgency.find({ studioId }) : [];
    const agencyMap = new Map((agencies || []).map((a) => [a.agencyName, a.relationshipScore]));

    const packages = AGENCY_PACKAGES_CATALOG.map((pkg) => {
      const relationshipScore = agencyMap.get(pkg.agencyName) || 50;
      const agencyPackages = getPackagesForAgency(pkg.agencyName, relationshipScore);
      return agencyPackages.find((p) => p.id === pkg.id) || pkg;
    });

    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
};

export const signAgencyPackage = async (req, res, next) => {
  try {
    const { agencyName, packageValue, talentCount } = req.body;
    let agency;
    let discountInfo;
    let costInfo;
    let remainingMoney;

    const studioId = await resolveStudioId(req);
    if (!studioId) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }

    await withTransaction(async (session) => {
      agency = await TalentAgency.findOne({ studioId, agencyName }).session(session);
      if (!agency) {
        const [newAgency] = await TalentAgency.create(
          [
            {
              studioId,
              agencyName,
              relationshipScore: 50,
            },
          ],
          { session }
        );
        agency = newAgency;
      }

      discountInfo = calculatePackageDiscount(agency.relationshipScore, talentCount);
      costInfo = evaluatePackageCommission(packageValue, discountInfo.discountPercentage);

      const studio = await Studio.findById(studioId).session(session);
      if (!studio) {
        const error = new Error("Studio not found");
        error.statusCode = 404;
        throw error;
      }

      if (studio.money < costInfo.finalPrice) {
        const error = new Error("Insufficient studio funds for talent agency package deal");
        error.statusCode = 400;
        throw error;
      }

      studio.money -= costInfo.finalPrice;
      remainingMoney = studio.money;
      await studio.save({ session });

      agency.packagedDealsCount += 1;
      agency.relationshipScore = Math.min(100, agency.relationshipScore + 5);
      agency.tier = discountInfo.relationshipTier;
      await agency.save({ session });
    });

    return res.status(201).json({
      success: true,
      message: `Talent package successfully signed with ${agencyName}`,
      data: {
        agency,
        costInfo,
        discountInfo,
        remainingMoney,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

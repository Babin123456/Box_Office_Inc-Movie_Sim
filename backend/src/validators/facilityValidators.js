import { z } from "zod";

export const buildFacilitySchema = z.object({
  facilityType: z.enum(["SOUNDSTAGE_COMPLEX", "VFX_VIRTUAL_PRODUCTION_LED", "POST_PRODUCTION_SUITE", "BACKLOT_SET"]),
});

export const toggleRentalSchema = z.object({
  facilityId: z.string().min(1, "Facility ID is required"),
  isRentedToThirdParty: z.boolean(),
});

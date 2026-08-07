import { z } from "zod";

export const signAgencyPackageSchema = z.object({
  agencyName: z.enum(["Creative Artists Agency", "William Morris Endeavor", "United Talent Agency", "Gersh Agency"]),
  packageValue: z.number().min(100000, "Minimum package value $100k"),
  talentCount: z.number().min(2).max(5).default(3),
});

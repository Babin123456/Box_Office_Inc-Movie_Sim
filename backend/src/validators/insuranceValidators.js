/**
 * @fileoverview Insurance Route Validation Schemas using Zod
 */

import { z } from "zod";

export const purchaseInsuranceSchema = {
  body: z.object({
    movieId: z.string().min(1, "movieId is required"),
    policyType: z.enum(["COMPLETION_BOND", "PRODUCTION_DISASTER", "TALENT_LIABILITY"]),
  }),
};

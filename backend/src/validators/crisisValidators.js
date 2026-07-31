import { z } from "zod";

export const resolveCrisisSchema = z.object({
  crisisId: z.string().min(1, "Crisis ID is required"),
  strategy: z.enum(["PUBLIC_APOLOGY", "SETTLEMENT_PAYOUT", "PRESS_TOUR", "LEGAL_ACTION"]),
});

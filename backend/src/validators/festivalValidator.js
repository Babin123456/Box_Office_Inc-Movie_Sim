/**
 * @fileoverview Festival Validation Schemas using Zod
 */

import { z } from "zod";

export const validateFestivalSubmissionSchema = {
  body: z.object({
    movieId: z.string().min(1, "movieId is required"),
    festivalName: z.enum(["CANNES", "SUNDANCE", "VENICE", "TIFF"]),
  }),
};

export const validateFestivalWithdrawSchema = {
  body: z.object({
    submissionId: z.string().min(1, "submissionId is required"),
  }),
};

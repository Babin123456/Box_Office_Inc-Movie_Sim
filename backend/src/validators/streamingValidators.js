import { z } from "zod";

const movieIdParam = z.object({
  movieId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Movie ID format"),
});

/** Validates params for POST /streaming/movies/:movieId/accept-deal */
export const acceptStreamingDealSchema = {
  params: movieIdParam,
};

/** Validates params for GET /streaming/movies/:movieId/strategy */
export const streamingStrategyParamsSchema = {
  params: movieIdParam,
};

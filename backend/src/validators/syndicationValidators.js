import { z } from "zod";

export const createSyndicationDealSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  networkName: z.enum([
    "Global Broadcast Network",
    "CineMax Cable Television",
    "StreamLine SVOD Network",
    "PrimeTime Syndication Network",
    "Indie Film Channel",
  ]),
  dealType: z.enum(["EXCLUSIVE_TV", "NON_EXCLUSIVE_CABLE", "SYNDICATION_PACKAGE"]).default("SYNDICATION_PACKAGE"),
  durationWeeks: z.number().min(1).max(104).default(26),
});

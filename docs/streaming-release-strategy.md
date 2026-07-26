# Streaming Release Strategy

## Overview
The Streaming Release Strategy Engine allows studio players to analyse each movie's streaming revenue potential and determine the optimal hybrid theatrical/streaming release window.

## New API Endpoint
`GET /api/streaming/movies/:movieId/strategy`

Returns:
- `revenuePotential.streamingPotential`: 6-month projected streaming revenue.
- `revenuePotential.conversionRate`: Estimated viewer conversion rate.
- `hybridStrategy.recommendation`: `THEATRICAL_EXTENDED`, `HYBRID_DAY_DATE`, or `EARLY_STREAMING_PIVOT`.
- `hybridStrategy.streamingWindowWeek`: Recommended week to move to streaming.

## Strategies
| Strategy | Condition |
|---|---|
| THEATRICAL_EXTENDED | ROI ≥ 150% and 4+ weeks in theaters |
| HYBRID_DAY_DATE | ROI ≥ 80% and 2+ weeks in theaters |
| EARLY_STREAMING_PIVOT | Under-performing films pivot early to recoup costs |

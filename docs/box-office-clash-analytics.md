# Box Office Clash Analytics & Screen Allocation Architecture

## Overview
The Clash Analytics Engine calculates the impact of head-to-head competition between movies releasing in the same theatrical window. It evaluates theater screen cannibalization rates, marketing dilution factors, and clash severity.

## Key Functions
- `calculateScreenCannibalization(totalScreens, competitorCount)`: Determines screen allocation per competitor.
- `computeClashSeverity(competitorCount, starPowerDiff)`: Grades clash severity into rating tiers.
- `computeClashImpactSummary(projectedOpening, clashCount)`: Projects revenue loss due to same-genre overlap.

## Endpoints
- `GET /api/box-office/clash-analytics/:movieId` - Returns head-to-head clash analytics for a specified movie.

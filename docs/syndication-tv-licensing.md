# Movie Syndication & Television Licensing Engine

## Overview
The Movie Syndication & Television Licensing module allows movie studios to generate recurring passive revenue by licensing released titles to broadcast networks, cable channels, and streaming platforms.

## Key Concepts
1. **Valuation Calculation**: Film box office performance and critical rating determine the upfront bonus payout and weekly recurring royalty rates.
2. **Deal Types**:
   - `EXCLUSIVE_TV`: High upfront bonus, shorter duration.
   - `NON_EXCLUSIVE_CABLE`: Moderate upfront bonus, long term duration.
   - `SYNDICATION_PACKAGE`: Standard syndicated network deal for catalog titles.
3. **Weekly Simulation**: Active deals generate weekly passive income directly into the studio treasury until expiration.

## API Endpoints
- `GET /api/syndication/deals`: Fetch all syndication contracts for current studio.
- `GET /api/syndication/valuation/:movieId`: Calculate estimated licensing valuation for a movie.
- `POST /api/syndication/deals`: Execute a new syndication agreement.

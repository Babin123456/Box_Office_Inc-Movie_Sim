# Film Festival Circuit & Prestige Jury Engine Architecture

## Overview
The Film Festival Circuit Engine simulates prestige film festival entry, jury reaction scoring, festival award distributions, critic hype multipliers, and film market distribution offers.

## Supported Festivals
- CANNES (Palme d'Or)
- SUNDANCE (Grand Jury Prize)
- VENICE (Golden Lion)
- TIFF (People's Choice Award)

## Endpoints
- `POST /api/festivals/submit` - Submits a film to a festival.
- `GET /api/festivals/active` - Lists active festival submissions.
- `POST /api/festivals/withdraw` - Withdraws a festival entry before jury screening.

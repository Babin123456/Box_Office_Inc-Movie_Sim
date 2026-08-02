# Studio Crisis Management & PR Emergency Response System

## Overview
The Studio PR Crisis Management system models real-world Hollywood scandals and emergencies (actor controversies, script leaks, director walkouts, public backlash) that threaten studio reputation and box office returns.

## Key Features
1. **Scandal Impact**: Active crises degrade studio public prestige and actor fan response on a weekly basis.
2. **Emergency PR Strategies**:
   - `PUBLIC_APOLOGY`: Low-cost public statement, moderate damage control.
   - `PRESS_TOUR`: Mid-cost charm offensive with media outlets.
   - `SETTLEMENT_PAYOUT`: High-cost financial settlement to end controversy swiftly.
   - `LEGAL_ACTION`: Critical legal response for severe breaches.

## API Endpoints
- `GET /api/crisis/active`: Fetch all unresolved scandals facing the studio.
- `POST /api/crisis/resolve`: Execute a PR resolution strategy.

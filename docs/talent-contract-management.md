# Talent Contract Negotiation & Buyout Engine Architecture

## Overview
The Talent Contract Negotiation & Buyout system manages studio contract lifecycle for actors, directors, and screenwriters. It provides realistic studio operations including contractual buyout clauses, renegotiation rounds, and breach penalties.

## Endpoints
- `POST /api/contracts/negotiate` - Propose or counter contract terms.
- `POST /api/contracts/accept` - Finalize accepted talent contract.
- `POST /api/contracts/buyout` - Pay buyout fee to release talent early.
- `POST /api/contracts/renegotiate` - Revise active contract parameters.

## Data Schema
- `Contract`: Tracks talentId, talentRole, upfrontFee, backendRoyaltyPercentage, buyoutClause, breachPenalty, renegotiatedCount, and status (`PROPOSED`, `ACCEPTED`, `REJECTED`, `EXPIRED`, `TERMINATED`, `RENEGOTIATED`, `BREACHED`).

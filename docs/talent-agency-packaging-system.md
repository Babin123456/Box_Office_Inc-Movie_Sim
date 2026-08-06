# Talent Agency Relations & Executive Packaging System

## Overview
The Talent Agency Relations & Packaging system allows movie studios to partner with Hollywood's premier talent agencies (CAA, WME, UTA, Gersh) to sign bundled talent packages (Director + Star Actors + Screenwriters) at discounted commission rates.

## Key Features
1. **Agency Relationship Score**: Building strong standing unlocks package discounts up to 25%.
2. **Talent Packages**: Hiring bundled packages reduces negotiations and streamlines pre-production assembly.
3. **Agency Tiers**:
   - `PREFERRED`: High-trust relationship (80+ score). Max packaging discounts.
   - `STANDARD`: Normal industry relationship.
   - `RESTRICTED`: Strained relationship due to contract breaches or unpaid fees.

## API Endpoints
- `GET /api/talent-agencies/agencies`: Fetch studio agency relationship standings.
- `POST /api/talent-agencies/package`: Negotiate and sign a talent package deal.

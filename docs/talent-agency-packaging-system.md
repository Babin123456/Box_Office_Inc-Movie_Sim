# Talent Agency Relations & Executive Packaging System

## Overview
The Talent Agency Relations & Packaging system allows movie studios to partner with Hollywood's premier talent agencies (Creative Artists Agency, William Morris Endeavor, United Talent Agency, Gersh Agency) to sign bundled talent packages (Director + Star Actors + Screenwriters) at discounted commission rates with cross-talent production synergies.

## Key Features
1. **Agency Relationship Score**: Building strong standing unlocks package discounts up to 25%.
2. **Talent Packages**: Hiring bundled packages reduces negotiations, streamlines pre-production assembly, and grants significant box-office hype and quality bonuses.
3. **Agency Tiers**:
   - `PREFERRED`: High-trust relationship (80+ score). Max packaging discounts (up to 25%) and priority access to star packages.
   - `STANDARD`: Normal industry relationship (40-79 score). Standard packaging offerings.
   - `RESTRICTED`: Strained relationship (< 40 score) due to contract cancellations or low box-office performance.

## Major Agency Specialties & Perks
- **Creative Artists Agency (CAA)**: Blockbuster Tentpoles & Superstar Actors (+15% Opening Box Office Hype).
- **William Morris Endeavor (WME)**: Visionary Directors & Multi-Platform Talent (+12% Production Quality Multiplier).
- **United Talent Agency (UTA)**: High-Concept Screenwriters & Comedy/Genre Stars (-20% Script Acquisition & Re-write Delays).
- **Gersh Agency**: Prestige Drama Actors & Award-Winning Composers (+10% Critical Review & Festival Jury Rating).

## Packaging Catalog & Synergy Bonuses
- `Summer Blockbuster Power Package`: $8,000,000 list price (+15% Hype, +10 Quality, 15% Budget Efficiency).
- `Auteur Director & Award Winner Duo`: $5,500,000 list price (+8% Hype, +18 Quality, 10% Budget Efficiency).
- `High-Concept Worldbuilder Bundle`: $4,500,000 list price (+12% Hype, +8 Quality, 20% Budget Efficiency).
- `Festival Contender Ensemble`: $3,000,000 list price (+5% Hype, +20 Quality, 12% Budget Efficiency).

## API Endpoints
- `GET /api/talent-agencies` or `GET /api/talent-agencies/agencies`: Fetch studio agency relationship standings and specialty perks.
- `GET /api/talent-agencies/available-packages`: Fetch pre-packaged talent deals with calculated discounts and final pricing based on agency relationship score.
- `POST /api/talent-agencies/package`: Negotiate and sign a talent package deal.
  - Payload: `{ "agencyName": "Creative Artists Agency", "packageValue": 8000000, "talentCount": 3 }`
  - Validates studio balance, deducts discounted final price atomically via MongoDB session, increments `packagedDealsCount`, and upgrades agency relationship score by +5.

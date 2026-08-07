# Studio Real Estate & VFX Facility Infrastructure System

## Overview
The Studio Facility Infrastructure module allows movie studios to acquire physical real estate, construct advanced soundstages, build LED virtual production suites, and establish post-production sound facilities.

## Facility Categories & Benefits
1. **SOUNDSTAGE_COMPLEX**: Cuts production delays and improves film shooting capacity.
2. **VFX_VIRTUAL_PRODUCTION_LED**: Provides major quality boosts for sci-fi/action projects.
3. **POST_PRODUCTION_SUITE**: Enhances film editing, color grading, and audio mastering.
4. **BACKLOT_SET**: Provides reusable outdoor sets and lowers production location budgets.

## Rental Yield Monetization
Idle studio facilities can be leased to third-party independent filmmakers to generate weekly recurring rental revenue for the studio treasury.

## API Endpoints
- `GET /api/facilities/list`: Fetch all facilities owned by the studio.
- `POST /api/facilities/build`: Construct or upgrade a studio facility.
- `POST /api/facilities/rental`: Toggle third-party rental status.

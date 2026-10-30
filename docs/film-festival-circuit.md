# Film Festival Circuit & Prestige Jury Engine Architecture

## Overview
The Film Festival Circuit Engine simulates premiere film festival competitions (Cannes, Venice, TIFF, Sundance), comprehensive jury panel deliberations across four artistic pillars, standing ovation durations, critical consensus quotes, competitive distributor acquisition bidding wars, and trophy room laurel showcases.

## Supported Festivals & Prestige Weighting

1. **Cannes Film Festival (`CANNES`)**:
   - Focus: Auteur artistic vision, directorial excellence, and international cinema.
   - Top Honor: `PALME_D_OR` (+35% Critic Hype Boost, +15 Studio Prestige).
   - Runner-Up: `GRAND_PRIX`.
   - Entry Fee: ₹500,000.
2. **Venice International Film Festival (`VENICE`)**:
   - Focus: High cinematic pedigree, political weight, and visionary storytelling.
   - Top Honor: `GOLDEN_LION` (+30% Critic Hype Boost, +15 Studio Prestige).
   - Runner-Up: `GRAND_PRIX`.
   - Entry Fee: ₹400,000.
3. **Toronto International Film Festival (`TIFF`)**:
   - Focus: Audience popularity catalyst, commercial crossover, and awards-season momentum.
   - Top Honor: `PEOPLES_CHOICE` (+25% Critic Hype Boost, +15 Studio Prestige).
   - Runner-Up: `AUDIENCE_AWARD`.
   - Entry Fee: ₹300,000.
4. **Sundance Film Festival (`SUNDANCE`)**:
   - Focus: Independent storytelling, raw authenticity, and breakout discoveries.
   - Top Honor: `GRAND_JURY_PRIZE` (+20% Critic Hype Boost, +15 Studio Prestige).
   - Runner-Up: `AUDIENCE_AWARD`.
   - Entry Fee: ₹250,000.

## Simulation Mechanics

### 1. 4-Pillar Jury Deliberation (`deliberateFestivalJury`)
Evaluates four core pillars tailored to each festival's aesthetic priorities:
- **Direction Score**: Evaluates auteur vision, staging, and rhythm.
- **Screenplay Score**: Assesses dialogue, character development, and narrative arc.
- **Performances Score**: Rates lead synergy, emotional authenticity, and star presence.
- **Thematic Resonance**: Gauges cultural impact, thematic courage, and distinct voice.

Composite evaluation:
- Composite Score `>= 88`: `AWARDED` (Top Festival Accolade: Palme d'Or, Golden Lion, People's Choice, or Grand Jury Prize), 7–14 min standing ovation.
- Composite Score `80–87`: `AWARDED` (Runner-up Grand Prix / Audience Award), 5–8 min standing ovation.
- Composite Score `60–79`: `ACCEPTED` (Official Festival Selection), 2–5 min polite ovation.
- Composite Score `< 60`: `REJECTED`, 0 min ovation.

### 2. Distributor Market Acquisition Wars (`generateDistributorOffers`)
Films scoring `>= 65` attract competitive distributor acquisition offers from prestige film distributors (Neon Prestige, A24 Premier, Searchlight Classics, Criterion Studio Select, Apex Global Releasing):
- **Advance Payment**: Cash in hand paid immediately to the studio upon inking the deal (`advancePayment = budget * (0.6 + scoreFactor * 0.8) * multiplier`).
- **Box Office Royalty Cut**: 10% – 20% distribution cut of future box office returns.
- **P&A Marketing Commitment**: Guaranteed promotional campaign budget (₹8 Lakhs to ₹20 Lakhs).
- **Territories**: Worldwide Theatrical & Streaming or Major Regional rights.

## API Endpoints

- `POST /api/festivals/submit`: Submits a studio film, deducts entry fee from studio treasury, simulates jury deliberation panel, and generates distributor bids.
- `GET /api/festivals/active`: Returns all festival entries with deliberation metrics and bids.
- `POST /api/festivals/withdraw`: Withdraws a submission before screening.
- `POST /api/festivals/accept-distribution`: Inks an acquisition deal, marks submission `ACQUIRED`, and credits advance payment to studio funds.
- `GET /api/festivals/laurels`: Fetches all festival laurels won by the studio for trophy case display.

## Frontend UI Integration
- Accessible at `/studio/festivals` (`FestivalCircuit.jsx`).
- Features real-time ovation timers, consensus quote callouts, 4-pillar progress bars, and distributor bidding war deal signers.
- Integrated into `/awards/trophy-room` (`TrophyRoom.jsx`) with a dedicated "Festival Laurels" showcase.

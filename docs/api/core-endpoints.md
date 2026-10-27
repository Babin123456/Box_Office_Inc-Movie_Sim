# Core Services & Subsystem API Reference

This document outlines the mounted endpoints for game onboarding tutorials, composer lifecycle management, celebrity scandal response systems, awards campaigns, and box office telemetry.

---

## 1. Tutorial & Onboarding (`/api/tutorial`)

### `GET /api/tutorial/state`
- **Auth:** Required (Bearer Token)
- **Description:** Retrieves the player's active onboarding progress, current step index, completed milestones, and dismissed tips.
- **Response `200`:**
  ```json
  {
    "success": true,
    "data": {
      "isActive": true,
      "currentStep": 0,
      "currentStepId": "WELCOME_STUDIO",
      "completedSteps": [],
      "isCompleted": false,
      "isSkipped": false,
      "allSteps": [...]
    }
  }
  ```

### `POST /api/tutorial/advance`
- **Auth:** Required
- **Body:** `{ "stepId": "WELCOME_STUDIO", "nextStepIndex": 1 }`
- **Description:** Progresses to the next onboarding step and grants experience/rewards.

### `POST /api/tutorial/skip`
- **Auth:** Required
- **Description:** Marks the onboarding tutorial as skipped for advanced players.

---

## 2. Composer Lifecycle & Music Score (`/api/composers`)

### `GET /api/composers/market`
- **Auth:** Required
- **Query Params:** `genre` (optional)
- **Description:** Returns hireable freelance composers with genre specialties, salary expectations, versatility, and musical talent scores.

### `GET /api/composers/roster`
- **Auth:** Required
- **Description:** Returns composers currently contracted under the player's studio.

### `POST /api/composers/hire`
- **Auth:** Required
- **Body:** `{ "composerId": "comp_123" }`
- **Description:** Signs an available composer to the studio roster.

---

## 3. Celebrity Scandals & Public Relations (`/api/scandals`)

### `GET /api/scandals/strategies`
- **Auth:** Public
- **Description:** Returns the handbook of available PR response strategies (e.g. `PUBLIC_APOLOGY`, `LEGAL_DENIAL`, `SETTLEMENT`, `CHARITY_DONATION`) including reputation impacts and financial costs.

### `GET /api/scandals`
- **Auth:** Required
- **Description:** Fetches historical and active scandals impacting talent associated with the player's studio.

### `POST /api/scandals/:id/respond`
- **Auth:** Required
- **Body:** `{ "strategyKey": "PUBLIC_APOLOGY" }`
- **Description:** Executes a chosen PR response strategy to mitigate reputational fallout.

---

## 4. Awards & Prestige Ceremonies (`/api/awards`)

### `GET /api/awards/campaigns`
- **Auth:** Required
- **Description:** Lists all active and historical awards lobbying campaigns funded by the studio.

### `POST /api/awards/campaigns`
- **Auth:** Required
- **Body:** `{ "movieId": "mov_123", "tier": "FOR_YOUR_CONSIDERATION_BLITZ", "budget": 500000 }`
- **Description:** Mounts an awards consideration push to increase critic voting probabilities.

---

## 5. Box Office Telemetry (`/api/box-office`)

### `GET /api/box-office/analytics/:movieId`
- **Auth:** Required
- **Description:** Retrieves granular telemetry including regional revenue split, occupancy efficiency, and profit margins.

### `GET /api/box-office/clash-analytics/:movieId`
- **Auth:** Required
- **Description:** Analyzes opening weekend head-to-head collisions with rival releases in matching genres.

### `GET /api/box-office/regional-summary`
- **Auth:** Required
- **Description:** Provides aggregate box office gross across North America, Europe, Asia-Pacific, Latin America, and India.

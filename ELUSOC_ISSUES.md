# ELUSOC 2026 Proposed Contribution Issues

This document outlines meaningful contribution opportunities for CineVerse, categorized by difficulty. These issues are based on a detailed audit of the current codebase.

---

## Newbie Issues

### 1. Implement Centralized Error Handling Middleware
- **Difficulty:** newbie
- **Labels:** `elusoc`, `newbie`, `bug`, `good first issue`
- **Description:**
    - **Problem Statement:** The `backend/src/middleware/errorMiddleware.js` file is currently empty, and the Express app lacks a global error handler.
    - **Current Behavior:** Errors are handled inconsistently within controllers using try-catch blocks that often return generic 500 messages.
    - **Expected Behavior:** A centralized middleware should catch all errors, log them, and return a standardized JSON response.
    - **Suggested Solution:** Implement a middleware function in `errorMiddleware.js` that checks for specific error types (e.g., Mongoose Validation, JWT errors) and sends appropriate status codes and messages.
    - **Acceptance Criteria:**
        - All unhandled errors return a `{ success: false, message: "..." }` response.
        - Development mode returns stack traces, while production mode does not.
        - The middleware is registered as the last item in `backend/src/app.js`.
- **Why It Matters:** Provides a professional API experience and prevents sensitive server details from leaking in production.

### 2. Add Studio Profile Customization (Settings)
- **Difficulty:** newbie
- **Labels:** `elusoc`, `newbie`, `enhancement`, `good first issue`
- **Description:**
    - **Problem Statement:** The Settings page (`frontend/src/pages/settings/Settings.jsx`) currently only features a "Logout" button.
    - **Current Behavior:** Users cannot change their studio name or personal details after registration.
    - **Expected Behavior:** Users should be able to update their Studio Name and potentially their profile description.
    - **Suggested Solution:**
        - Add a text input for Studio Name in the Settings page.
        - Create a `PUT /api/studio` endpoint to handle the update.
        - Connect the frontend form to the backend endpoint.
    - **Acceptance Criteria:**
        - Users can save a new Studio Name.
        - The UI updates immediately to reflect the change.
        - Validation prevents empty or overly long names.
- **Why It Matters:** Personalization is a key element of tycoon games; allowing players to rebrand their studio improves immersion.

### 3. Implement Comprehensive JSDoc Documentation for Simulation Engines
- **Difficulty:** newbie
- **Labels:** `elusoc`, `newbie`, `documentation`, `good first issue`
- **Description:**
    - **Problem Statement:** Core simulation engines in `backend/src/services/simulation/engines/` lack standardized documentation.
    - **Current Behavior:** Most logic is documented only with simple inline comments.
    - **Expected Behavior:** Every engine function should have JSDoc headers describing parameters, return values, and the logic of the calculation.
    - **Suggested Solution:** Go through `boxOfficeEngine.js`, `reviewEngine.js`, `writerEngine.js`, and others to add standard JSDoc blocks.
    - **Acceptance Criteria:**
        - All exported functions in the `engines` directory have full JSDoc coverage.
        - Complex formulas (like ROI calculation) are explained in the docs.
- **Why It Matters:** Lowering the barrier for entry into the simulation logic is crucial for attracting veteran contributors who want to balance the game.

---

## Adventurer Issues

### 4. Implement Robust Input Validation with Joi or Zod
- **Difficulty:** adventurer
- **Labels:** `elusoc`, `adventurer`, `enhancement`
- **Description:**
    - **Problem Statement:** The `backend/src/validators/` directory contains empty files.
    - **Current Behavior:** The API relies on manual checks within controllers, which is error-prone and leads to code duplication.
    - **Expected Behavior:** All incoming request bodies should be validated against schemas before reaching the controller logic.
    - **Suggested Solution:** Use `Joi` or `Zod` to define schemas for Auth, Movie creation, and Script actions. Implement a validation middleware to apply these schemas.
    - **Acceptance Criteria:**
        - `POST /api/movies` validates all required IDs and marketing budgets.
        - `POST /api/auth/register` enforces strong password rules and valid email formats.
        - Errors return clear, user-friendly validation messages.
- **Why It Matters:** Ensures data integrity and hardens the application against malformed or malicious payloads.

### 5. Implement a Global Random Event Engine
- **Difficulty:** adventurer
- **Labels:** `elusoc`, `adventurer`, `enhancement`
- **Description:**
    - **Problem Statement:** `backend/src/services/simulation/engines/eventEngine.js` is an empty placeholder.
    - **Current Behavior:** The game world is static; weekly ticks only process production progress and payroll.
    - **Expected Behavior:** Each week, there should be a small chance of a "Random Event" (e.g., "Scandal increases hype but drops reputation", "Market Boom increases box office potential").
    - **Suggested Solution:**
        - Define an array of event types in a constant file.
        - Implement logic in `eventEngine.js` to roll for an event each tick.
        - Update `GameState` and `Studio` based on the event outcome.
        - Generate a notification for the player.
    - **Acceptance Criteria:**
        - Events correctly modify studio stats or movie hype.
        - Players receive a notification explaining the event.
        - Events are weighted (rare vs. common).
- **Why It Matters:** Dynamic events keep the game loop fresh and force players to adapt their strategies.

### 6. Realistic Box Office Revenue Sharing Logic
- **Difficulty:** adventurer
- **Labels:** `elusoc`, `adventurer`, `enhancement`
- **Description:**
    - **Problem Statement:** The `boxOfficeEngine.js` currently calculates "Profit" as 100% of the worldwide gross minus budget.
    - **Current Behavior:** Studios keep all ticket sales revenue.
    - **Expected Behavior:** In the real film industry, theaters take ~50% of the box office. The studio should only receive the "Rentals" (the studio's share).
    - **Suggested Solution:**
        - Update the formula in `boxOfficeEngine.js` to calculate `studioRevenue` as 50% of `worldwideGross`.
        - Base the studio profit on `studioRevenue - totalBudget`.
        - Update the UI to show both "Total Box Office" and "Studio Revenue".
    - **Acceptance Criteria:**
        - Studio money increases only by the 50% share of the gross.
        - Movie tooltips clearly distinguish between Gross and Net revenue.
- **Why It Matters:** Improves game realism and increases the difficulty, making financial management more strategic.

---

## Veteran Issues

### 7. Implement AI Studio Competition Engine
- **Difficulty:** veteran
- **Labels:** `elusoc`, `veteran`, `enhancement`, `help wanted`
- **Description:**
    - **Problem Statement:** `backend/src/services/simulation/engines/aiEngine.js` is an empty placeholder.
    - **Current Behavior:** The player is the only entity producing movies in the simulation.
    - **Expected Behavior:** Rival AI studios should exist, releasing their own movies and competing for box office market share.
    - **Suggested Solution:**
        - Create an `AIStudio` model or add AI studios to `GameState`.
        - Implement logic in `aiEngine.js` for AI studios to buy scripts and hire talent.
        - Simulate AI movie releases that "soak up" market hype and potential box office from the player.
    - **Acceptance Criteria:**
        - A "Rival Leaderboard" shows AI studio earnings vs. the player.
        - AI movie releases appear in the game's notification feed.
- **Why It Matters:** Competition is the core of a tycoon game. Rivalry provides long-term goals and a benchmark for success.

### 8. Dynamic Market Trends & Genre Saturation
- **Difficulty:** veteran
- **Labels:** `elusoc`, `veteran`, `enhancement`, `help wanted`
- **Description:**
    - **Problem Statement:** `backend/src/services/simulation/engines/trendEngine.js` is an empty placeholder.
    - **Current Behavior:** All genres perform equally well at all times.
    - **Expected Behavior:** Certain genres should trend up or down (e.g., "Superhero fatigue" or "Horror boom"). Releasing too many movies of one genre should saturate the market and drop earnings.
    - **Suggested Solution:**
        - Implement a trend system that rotates genre multipliers every 12-24 game weeks.
        - Track the number of active projects in each genre to calculate saturation.
        - Modify the `boxOfficeEngine` to incorporate these multipliers.
    - **Acceptance Criteria:**
        - Trending genres show a visual indicator in the Script Market.
        - Box office results explicitly list "Trend Bonus" or "Saturation Penalty".
- **Why It Matters:** Adds a deep layer of strategy to project selection and timing, preventing players from spamming the same genre.

### 9. End-to-End Integration Test Suite for Production Loop
- **Difficulty:** veteran
- **Labels:** `elusoc`, `veteran`, `testing`
- **Description:**
    - **Problem Statement:** The repository currently has zero automated tests.
    - **Current Behavior:** All verification is manual, leading to frequent regressions in simulation logic.
    - **Expected Behavior:** A comprehensive test suite should cover the entire "Script -> Production -> Release" flow.
    - **Suggested Solution:**
        - Setup `Supertest` and `Vitest/Jest` in the backend.
        - Create integration tests that simulate a user hiring talent, greenlighting a movie, ticking the simulation, and releasing the film.
        - Verify that money is deducted correctly and talent stats are updated.
    - **Acceptance Criteria:**
        - A single command (`npm test`) runs the entire suite.
        - Tests cover at least 3 distinct movie release verdicts (Hit, Flop, Average).
- **Why It Matters:** As the simulation becomes more complex (AI, Trends, Events), automated testing is the only way to ensure the game remains balanced and bug-free.

# Franchise Ecosystem & Universe Synergy Architecture

## Overview
The Franchise Ecosystem Synergy Engine calculates universe-wide audience multipliers, franchise fatigue decay, lore consistency impacts, and crossover hype bonuses for cinematic universes.

## Key Functions
- `calculateUniverseFatigue(releasesPerYear)`: Returns fatigue score and revenue decay multiplier.
- `evaluateLoreConsistency(currentLore, retainsLeadWriter)`: Updates narrative consistency score based on creative team continuity.
- `calculateCrossoverHype(subFranchiseCount, loreConsistency)`: Calculates crossover event audience multiplier.

## Schema Fields
- `crossMediaMultiplier`: Box office advantage from multi-platform brand awareness.
- `franchiseTier`: Tier classification — STANDALONE, TRILOGY, CINEMATIC_UNIVERSE, MULTI_MEDIA_EMPIRE.

export const processCareerImpact = (gameState, movie, writer, director, leadActor, crewTeam) => {
  const isHit = movie.verdict === "HIT";
  const isBlockbuster = movie.verdict === "BLOCKBUSTER";
  const isLegendary = movie.verdict === "LEGENDARY";
  const isFlop = movie.verdict === "FLOP";
  const isDisaster = movie.verdict === "DISASTER";

  const isSuccess = isHit || isBlockbuster || isLegendary;
  const isFailure = isFlop || isDisaster;

  // Helper to update stats
  const updateTalent = (talent, type) => {
    if (isSuccess) talent.hitMovies = (talent.hitMovies || 0) + 1;
    if (isFailure) talent.flopMovies = (talent.flopMovies || 0) + 1;

    // Reputation/Popularity change
    let repChange = 0;
    if (isLegendary) repChange = 15;
    else if (isBlockbuster) repChange = 10;
    else if (isHit) repChange = 5;
    else if (isFlop) repChange = -5;
    else if (isDisaster) repChange = -15;

    if (type === 'actor') {
      talent.popularity = Math.max(0, Math.min(100, (talent.popularity || 50) + repChange));
      talent.fanbase = Math.max(0, Math.round((talent.fanbase || 0) + (repChange * movie.worldwideGross * 0.001)));
    } else {
      talent.reputation = Math.max(0, Math.min(100, (talent.reputation || 50) + repChange));
    }

    // Salary Rules
    // DISASTER: Salary decreases
    // FLOP: Small decrease
    // AVERAGE: No change
    // HIT: Increase
    // BLOCKBUSTER: Large increase
    // ALL TIME BLOCKBUSTER: Major increase
    let salaryMultiplier = 1.0;
    if (isLegendary) salaryMultiplier = 1.5; // 50%
    else if (isBlockbuster) salaryMultiplier = 1.25; // 25%
    else if (isHit) salaryMultiplier = 1.1; // 10%
    else if (isFlop) salaryMultiplier = 0.9; // -10%
    else if (isDisaster) salaryMultiplier = 0.75; // -25%

    talent.salary = Math.round((talent.salary || 0) * salaryMultiplier);
    talent.careerEarnings = (talent.careerEarnings || 0) + movie.worldwideGross * 0.001; // Mock share

    // History
    if (talent.careerHistory) {
        talent.careerHistory.push({
            movieId: movie._id,
            movieTitle: movie.title,
            releaseWeek: gameState.currentWeek,
            quality: movie.quality,
            boxOffice: movie.worldwideGross,
            verdict: movie.verdict
        });
    }
  };

  if (writer) updateTalent(writer, 'writer');
  if (director) updateTalent(director, 'director');
  if (leadActor) updateTalent(leadActor, 'actor');
  if (crewTeam) updateTalent(crewTeam, 'crew');
};

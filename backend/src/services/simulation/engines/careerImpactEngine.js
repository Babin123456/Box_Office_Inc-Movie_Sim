export const processCareerImpact = (gameState, movie, writer, director, leadActor, crewTeam) => {
  const isHit = ["HIT", "BLOCKBUSTER", "LEGENDARY"].includes(movie.verdict);
  const isFlop = ["FLOP", "DISASTER"].includes(movie.verdict);

  const impactFactor = isHit ? 1 : isFlop ? -1 : 0;

  // Helper to update stats
  const updateTalent = (talent, type) => {
    if (isHit) talent.hitMovies = (talent.hitMovies || 0) + 1;
    if (isFlop) talent.flopMovies = (talent.flopMovies || 0) + 1;

    // Reputation/Popularity change
    const change = impactFactor * (Math.random() * 5 + 2); // 2-7 points
    if (type === 'actor') {
      talent.popularity = Math.max(0, Math.min(100, (talent.popularity || 50) + change));
      talent.fanbase = Math.max(0, Math.round((talent.fanbase || 0) + (impactFactor * movie.worldwideGross * 0.01)));
    } else {
      talent.reputation = Math.max(0, Math.min(100, (talent.reputation || 50) + change));
    }

    // Salary growth
    if (isHit) {
      talent.salary = Math.round((talent.salary || 0) * (1.1 + Math.random() * 0.1)); // 10-20% raise
    } else if (isFlop) {
      talent.salary = Math.round((talent.salary || 0) * (0.9 + Math.random() * 0.05)); // 5-10% cut
    }

    talent.careerEarnings = (talent.careerEarnings || 0) + (talent.salary * 1); // Mock for current week

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

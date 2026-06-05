const getReviewLabel = (score) => {
  if (score <= 20) return "Terrible";
  if (score <= 40) return "Poor";
  if (score <= 60) return "Average";
  if (score <= 80) return "Good";
  return "Excellent";
};

export const generateReviews = (movie, script, director, leadActor, crewTeam) => {
  // Critic Score Formula:
  // Script Quality → 40%
  // Director Creativity → 30%
  // Crew Technical Quality → 20%
  // Lead Actor Skill → 10%
  const criticScore = Math.round(
    (script.quality * 0.4) +
    (director.creativity * 0.3) +
    (crewTeam.technicalQuality * 0.2) +
    (leadActor.actingSkill * 0.1)
  );

  // Audience Score Formula:
  // Lead Actor Popularity → 35%
  // Script Audience Appeal → 25%
  // Director Reputation → 20%
  // Movie Quality → 20%
  const audienceScore = Math.round(
    (leadActor.popularity * 0.35) +
    (script.audienceAppeal * 0.25) +
    (director.reputation * 0.2) +
    (movie.quality * 0.2)
  );

  return {
    criticScore: Math.min(100, criticScore),
    criticLabel: getReviewLabel(criticScore),
    audienceScore: Math.min(100, audienceScore),
    audienceLabel: getReviewLabel(audienceScore)
  };
};

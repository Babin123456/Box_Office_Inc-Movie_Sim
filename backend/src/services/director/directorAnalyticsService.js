const toNumber = (value) => Number(value || 0);

export const calculateDirectorHitRate = (director) => {
  const moviesDirected = toNumber(director.moviesDirected);

  if (moviesDirected === 0) {
    return 0;
  }

  return Number(((toNumber(director.hitMovies) / moviesDirected) * 100).toFixed(2));
};

export const calculateDirectorFlopRate = (director) => {
  const moviesDirected = toNumber(director.moviesDirected);

  if (moviesDirected === 0) {
    return 0;
  }

  return Number(((toNumber(director.flopMovies) / moviesDirected) * 100).toFixed(2));
};

export const calculateAverageRating = (director) => {
  const ratingsFromField = director.ratings || [];
  const ratingsFromHistory = (director.careerHistory || [])
    .map((movie) => movie.movieRating ?? movie.criticScore ?? movie.audienceScore)
    .filter((rating) => rating !== null && rating !== undefined);
  const ratings = [...ratingsFromField, ...ratingsFromHistory].map(toNumber);

  if (ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);

  return Number((totalRating / ratings.length).toFixed(2));
};

export const calculateAverageBoxOffice = (director) => {
  const boxOfficeValues = (director.careerHistory || [])
    .map((movie) => movie.boxOffice)
    .filter((boxOffice) => boxOffice !== null && boxOffice !== undefined)
    .map(toNumber);

  if (boxOfficeValues.length === 0) {
    return 0;
  }

  const totalBoxOffice = boxOfficeValues.reduce((sum, boxOffice) => sum + boxOffice, 0);

  return Math.round(totalBoxOffice / boxOfficeValues.length);
};

export const calculateDirectorCareerLength = (director, currentWeek = 1) => {
  const weeks = (director.careerHistory || [])
    .map((movie) => movie.releaseWeek)
    .filter((releaseWeek) => releaseWeek !== null && releaseWeek !== undefined)
    .map(toNumber);

  if (weeks.length === 0) {
    return 0;
  }

  const firstReleaseWeek = Math.min(...weeks);
  const elapsedWeeks = Math.max(0, currentWeek - firstReleaseWeek);

  return Number((elapsedWeeks / 52).toFixed(1));
};

export const calculateDirectorAnalytics = (director, currentWeek) => ({
  hitRate: calculateDirectorHitRate(director),
  flopRate: calculateDirectorFlopRate(director),
  averageRating: calculateAverageRating(director),
  averageBoxOffice: calculateAverageBoxOffice(director),
  careerLength: calculateDirectorCareerLength(director, currentWeek),
});

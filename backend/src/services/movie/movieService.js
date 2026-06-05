const titlePatterns = [
  "{adj} {noun}",
  "{noun} of {noun2}",
  "The {adj} {noun}",
  "{noun}: {adj} {noun2}",
  "{adj} {adj2} {noun}",
  "{verb} the {noun}",
  "Beyond {noun}",
  "Last {noun}",
  "{adj} {place}"
];

const adjectives = ["Shadow", "Crimson", "Silent", "Golden", "Eternal", "Dark", "Hidden", "Final", "Savage", "Broken", "Direct", "Global", "Stellar", "Infinite"];
const nouns = ["Protocol", "Legacy", "Horizon", "Kingdom", "Empire", "Warrior", "Dawn", "Revenge", "Prophecy", "Night", "Justice", "Storm", "Vision", "Empire"];
const places = ["City", "World", "Galaxy", "Frontier", "Planet", "Station", "Tomb", "Valley"];
const verbs = ["Saving", "Destroying", "Finding", "Seeking", "Hunting", "Escaping"];

export const generateMovieTitle = (genre) => {
  const pattern = titlePatterns[Math.floor(Math.random() * titlePatterns.length)];

  let title = pattern
    .replace("{adj}", adjectives[Math.floor(Math.random() * adjectives.length)])
    .replace("{adj2}", adjectives[Math.floor(Math.random() * adjectives.length)])
    .replace("{noun}", nouns[Math.floor(Math.random() * nouns.length)])
    .replace("{noun2}", nouns[Math.floor(Math.random() * nouns.length)])
    .replace("{place}", places[Math.floor(Math.random() * places.length)])
    .replace("{verb}", verbs[Math.floor(Math.random() * verbs.length)]);

  return title;
};

export const calculateDirectorRarity = ({
  creativity,
  reliability,
  leadership,
}) => {
  const average = creativity * 0.4 + reliability * 0.3 + leadership * 0.3;

  if (average >= 95) return "Legendary";

  if (average >= 88) return "Epic";

  if (average >= 78) return "Rare";

  if (average >= 68) return "Uncommon";

  return "Common";
};

export const calculateDirectorSalary = ({
  creativity,
  reliability,
  leadership,
  reputation,
}) => {
  const score =
    creativity * 0.35 +
    reliability * 0.25 +
    leadership * 0.25 +
    reputation * 0.15;

  return Math.round(score * 3500);
};

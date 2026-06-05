import { addNotification } from "../helpers/notificationHelper.js";

export const processWriterPayroll = (gameState, studio) => {
  const ownedWriters = gameState.ownedWriters || [];
  const ownedDirectors = gameState.ownedDirectors || [];
  const ownedActors = gameState.ownedActors || [];
  const ownedCrewTeams = gameState.ownedCrewTeams || [];

  const allTalent = [...ownedWriters, ...ownedDirectors, ...ownedActors, ...ownedCrewTeams];

  if (allTalent.length === 0) {
    return;
  }

  const totalPayroll = allTalent.reduce(
    (total, talent) => total + Number(talent.salary || 0),
    0
  );

  if (totalPayroll <= 0) {
    return;
  }

  const availableMoney = Number(studio.money || 0);

  if (availableMoney < totalPayroll) {
    addNotification(
      gameState,
      `Studio cannot afford weekly talent salaries. Required ₹${totalPayroll.toLocaleString()}, available ₹${availableMoney.toLocaleString()}.`
    );
  }

  const payrollCoverage = Math.min(1, availableMoney / totalPayroll);

  allTalent.forEach((talent) => {
    const paidSalary = Math.floor(Number(talent.salary || 0) * payrollCoverage);
    if (talent.totalEarnings !== undefined) {
        talent.totalEarnings = Number(talent.totalEarnings || 0) + paidSalary;
    }
  });

  studio.money = Math.max(0, availableMoney - totalPayroll);
};

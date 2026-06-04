const DISCOVERY_REVEAL_THRESHOLD = 50;

const HIDDEN_STAT_VALUE = null;

export const presentWriter = (writer) => {
  const presentedWriter = writer.toObject ? writer.toObject() : { ...writer };

  const discovered = Number(presentedWriter.discovered || 0);
  const statsRevealed = discovered >= DISCOVERY_REVEAL_THRESHOLD;

  presentedWriter.statsRevealed = statsRevealed;

  if (!statsRevealed) {
    presentedWriter.originality = HIDDEN_STAT_VALUE;
    presentedWriter.consistency = HIDDEN_STAT_VALUE;
    presentedWriter.reliability = HIDDEN_STAT_VALUE;
  }

  return presentedWriter;
};

export const presentWriters = (writers = []) => writers.map(presentWriter);

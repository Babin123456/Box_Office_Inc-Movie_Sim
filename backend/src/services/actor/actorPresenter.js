const DISCOVERY_REVEAL_THRESHOLD = 50;
const HIDDEN_STAT_VALUE = null;

export const presentActor = (actor) => {
  const presentedActor = actor?.toObject ? actor.toObject() : { ...(actor || {}) };

  const discovered = Number(presentedActor.discovered || 0);
  const statsRevealed = discovered >= DISCOVERY_REVEAL_THRESHOLD;

  presentedActor.statsRevealed = statsRevealed;

  if (!statsRevealed) {
    presentedActor.actingSkill = HIDDEN_STAT_VALUE;
    presentedActor.reliability = HIDDEN_STAT_VALUE;
    presentedActor.fanbase = HIDDEN_STAT_VALUE;
  }

  return presentedActor;
};

export const presentActors = (actors = []) => actors.map(presentActor);

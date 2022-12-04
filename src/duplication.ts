import IBehavior from "./behavior"

export const initializeDuplicateBehavior =
  <T extends IBehavior>
  (original: T, behavior: T, cb?: (duplicate: T) => void): T => {
  behavior.energy = original.energy;

  if (cb) cb(behavior);

  return behavior;
}

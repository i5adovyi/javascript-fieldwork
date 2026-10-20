export const STATUSES = Object.freeze(["open", "active", "blocked", "done"]);
export function isStatus(value) {
  return STATUSES.includes(value);
}

export function createWorkflow({ createId } = {}) {
  // TODO WK1: Keep instance state private. Choose an ID policy when createId is absent.
  // TODO WK2: Return { add, find, list, transition } with documented error semantics.
  // TODO WK3: Protect state from mutation through records returned to consumers.
  throw new Error("TODO WK1: implement createWorkflow");
}

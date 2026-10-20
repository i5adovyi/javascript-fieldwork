export const INCIDENT_STATUSES = Object.freeze(["open", "active", "resolved"]);
export function createIncident(input, { createId, now } = {}) {
  // TODO SD1: Validate a request and return a new domain record with explicit timestamps.
  throw new Error("TODO SD1: implement createIncident");
}
export function transitionIncident(incident, nextStatus) {
  // TODO SD2: Validate the transition before returning changed state.
  throw new Error("TODO SD2: implement transitionIncident");
}

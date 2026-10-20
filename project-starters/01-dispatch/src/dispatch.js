export const SEVERITIES = Object.freeze(["low", "normal", "critical"]);
export const TIERS = Object.freeze(["standard", "premium"]);

// Implemented utility: strict validation avoids accepting numeric strings and NaN.
export function isValidAgeHours(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function validateRequest(request) {
  // TODO D1: Validate every field and return a normalized record or throw a useful error.
  throw new Error("TODO D1: implement validateRequest");
}

export function routeRequest(request) {
  // TODO D2: Evaluate your written decision table in its documented precedence order.
  // Return { queue, responseTargetHours, explanation } without changing request.
  throw new Error("TODO D2: implement routeRequest");
}

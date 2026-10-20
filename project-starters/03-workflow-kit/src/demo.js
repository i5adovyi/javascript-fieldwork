import { STATUSES, isStatus } from "./workflow.js";
console.log("Proposed state vocabulary:", STATUSES.join(" → "));
console.log("Is 'active' a valid state?", isStatus("active"));
console.log("Next: draw an allowed-transition table, then implement createWorkflow in src/workflow.js.");

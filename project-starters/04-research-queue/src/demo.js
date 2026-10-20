import { fakeLookup } from "./fake-service.js";
console.log(await fakeLookup("language"));
console.log("Next: inspect fixtures/topics.json and implement TODO RQ1 in src/collector.js.");
console.log("The fake service supports delay, failure, malformed data, and AbortSignal cancellation.");

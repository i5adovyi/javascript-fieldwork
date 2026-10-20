import { readFile } from "node:fs/promises";
import { isValidAgeHours } from "./dispatch.js";
const requests = JSON.parse(await readFile(new URL("../fixtures/requests.json", import.meta.url), "utf8"));
console.table(requests.map(request => ({ ...request, validAge: isValidAgeHours(request.ageHours) })));
console.log("Next: write your decision table, then implement TODO D1 and D2 in src/dispatch.js.");

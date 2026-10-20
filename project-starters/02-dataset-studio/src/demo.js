import { readFile } from "node:fs/promises";
import { isRecord } from "./dataset.js";
const records = JSON.parse(await readFile(new URL("../fixtures/participants.json", import.meta.url), "utf8"));
console.log(`Loaded ${records.length} synthetic records; ${records.filter(isRecord).length} have object shape.`);
console.table(records.slice(0, 3));
console.log("The fixture contains intentional invalid fields and duplicates. Begin with fixtures/small.json and TODO DS1.");

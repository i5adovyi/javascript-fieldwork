import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

// Run this file from any directory: node tests/validate-labs.mjs
// Each supplied test gets a lexical scope; all tests share the loaded solution.
const dataPath = new URL("../dist/data/labs.json", import.meta.url);
const { labs } = JSON.parse(await readFile(dataPath, "utf8"));
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const coreLabs = labs.filter(lab => lab.kind !== "incident");
const incidentLabs = labs.filter(lab => lab.kind === "incident");
assert.equal(coreLabs.length, 48, "The curriculum must retain 48 core labs.");
assert.equal(incidentLabs.length, 8, "The curriculum must include eight incident labs.");
assert.equal(labs.length, 56, "The curriculum must include 48 core and eight incident labs.");
assert.equal(new Set(labs.map(lab => lab.id)).size, labs.length, "Lab IDs must be unique.");
for (let stage = 1; stage <= 6; stage++) {
  assert.equal(coreLabs.filter(lab => lab.stage === stage).length, 8, `Stage ${stage} needs eight core labs.`);
}
assert.deepEqual(coreLabs.map(lab => lab.id), Array.from({length: 48}, (_, i) => `lab-${String(i + 1).padStart(2, "0")}`));
assert.deepEqual(incidentLabs.map(lab => lab.id), Array.from({length: 8}, (_, i) => `lab-${i + 49}`));
const {lessons} = JSON.parse(await readFile(new URL("../dist/data/curriculum.json", import.meta.url), "utf8"));
const lessonsById = new Map(lessons.map(lesson => [lesson.id, lesson]));

async function runSuite(source, tests) {
  const blocks = tests.map(test => `
    try {
      await (async () => { ${test.code}\n })();
      __fieldworkValidationResults.push({name: ${JSON.stringify(test.name)}, passed: true});
    } catch (error) {
      __fieldworkValidationResults.push({
        name: ${JSON.stringify(test.name)},
        passed: false,
        message: error?.stack || String(error)
      });
    }
  `).join("\n");
  const execute = new AsyncFunction(
    "assert",
    "assertEqual",
    `"use strict";\n${source}\nconst __fieldworkValidationResults = [];\n${blocks}\nreturn __fieldworkValidationResults;`
  );
  let timer;
  try {
    return await Promise.race([
      execute(
        (condition, message = "Assertion failed") => assert.ok(condition, message),
        (actual, expected) => assert.deepStrictEqual(actual, expected)
      ),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Suite timed out after 5 seconds")), 5000);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

let passedTests = 0;
const failures = [];
for (const lab of labs) {
  try {
    assert.match(lab.id, /^lab-\d{2}$/);
    assert.ok(lab.title && lab.prompt && lab.concept, `${lab.id}: missing instructional content`);
    assert.ok(lab.minutes > 0, `${lab.id}: estimated duration required`);
    assert.equal(lab.hints.length, 3, `${lab.id}: three progressive hints required`);
    assert.ok(lab.examples.length >= 1, `${lab.id}: worked input/output required`);
    assert.ok(lab.tests.length >= 4, `${lab.id}: four test cases required`);
    if (lab.kind === "incident") {
      assert.match(lab.incidentId, /^incident-\d{2}$/, `${lab.id}: incident link required`);
      assert.equal(
        lessonsById.get(lab.afterLesson)?.stage,
        lab.stage,
        `${lab.id}: the prerequisite lesson must belong to the lab's stage`
      );
      assert.ok(lab.tests.length >= 6, `${lab.id}: six incident checks required`);
      assert.ok(!/Not implemented/i.test(lab.starter), `${lab.id}: supply a plausible broken implementation`);
    }
    assert.equal(
      new Set(lab.tests.map(test => test.name)).size,
      lab.tests.length,
      `${lab.id}: test names should be unique`
    );

    const results = await runSuite(lab.solution, lab.tests);
    const rejected = results.filter(result => !result.passed);
    passedTests += results.length - rejected.length;
    for (const result of rejected) {
      failures.push(`${lab.id} / ${result.name}\n${result.message}`);
    }

    // Starters must be syntactically valid and must not accidentally solve the lab.
    const starterResults = await runSuite(lab.starter, lab.tests);
    assert.ok(
      starterResults.some(result => !result.passed),
      `${lab.id}: starter unexpectedly passes every test`
    );
    if (lab.kind === "incident") {
      assert.ok(
        starterResults[0]?.passed,
        `${lab.id}: the broken starter must pass its first ordinary-case test`
      );
    }
  } catch (error) {
    failures.push(`${lab.id}: ${error.stack || error}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  console.error(`\nFAILED: ${failures.length} problem(s); ${passedTests} solution tests passed.`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${coreLabs.length} core + ${incidentLabs.length} incident solutions, ${passedTests} tests, ${labs.length} starters with failing checks.`);
  console.log(`Validated ${fileURLToPath(dataPath)}`);
}

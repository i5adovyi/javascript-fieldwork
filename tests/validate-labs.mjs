import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

// Run this file from any directory: node tests/validate-labs.mjs
// Each supplied test gets a lexical scope; all tests share the loaded solution.
const dataPath = new URL("../dist/data/labs.json", import.meta.url);
const { labs } = JSON.parse(await readFile(dataPath, "utf8"));
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

assert.equal(labs.length, 48, "The curriculum must include 48 labs.");
assert.equal(new Set(labs.map(lab => lab.id)).size, 48, "Lab IDs must be unique.");
for (let stage = 1; stage <= 6; stage++) {
  assert.equal(labs.filter(lab => lab.stage === stage).length, 8, `Stage ${stage} needs eight labs.`);
}

async function runSuite(source, tests) {
  const blocks = tests.map(test => `
    try {
      await (async () => { ${test.code}\n })();
      outcomes.push({name: ${JSON.stringify(test.name)}, passed: true});
    } catch (error) {
      outcomes.push({
        name: ${JSON.stringify(test.name)},
        passed: false,
        message: error?.stack || String(error)
      });
    }
  `).join("\n");
  const execute = new AsyncFunction(
    "assert",
    "assertEqual",
    `"use strict";\n${source}\nconst outcomes = [];\n${blocks}\nreturn outcomes;`
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
  } catch (error) {
    failures.push(`${lab.id}: ${error.stack || error}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  console.error(`\nFAILED: ${failures.length} problem(s); ${passedTests} solution tests passed.`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${labs.length} solutions, ${passedTests} tests, ${labs.length} intentionally unfinished starters.`);
  console.log(`Validated ${fileURLToPath(dataPath)}`);
}

# JavaScript Fieldwork · Incident workbook

Twelve original synthetic cases. Follow the prerequisites and environment in each case.
The [curriculum review](curriculum-review.md) explains coverage and remaining extensions.
Use the [learner handbook](handbook.md) to fit these into your learning plan.

- incident-01: Zero retries turns into three — after lesson-04
- incident-02: Two orders become one — after lesson-06
- incident-03: A rejected edit still changes the profile — after lesson-07
- incident-04: The import that inherited approval — after lesson-12
- incident-05: One failed cleanup leaves the room open — after lesson-17
- incident-06: A price that survives its replacement — after lesson-18
- incident-07: The preview cuts a person in half — after lesson-20
- incident-08: The older search wins last — after lesson-23
- incident-09: The API returned a login page — after lesson-28
- incident-10: Saved on screen, missing after reload — after lesson-30
- incident-11: One rejected write stops the queue — after lesson-32
- incident-12: Yesterday’s tab writes today’s schema — after lesson-36

---

# incident-01 · Zero retries turns into three

Stage 1 · after lesson-04 · approximately 35 minutes

An optional configuration field hides four different states

## Environment

Local Node.js 20.11+; save the starter as incident.mjs and run node incident.mjs. The parser can also be explored in a browser console.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: Dispatch accepts a retry count from a text configuration field. An operator explicitly enters zero to disable retries, yet the preview shows three. Another operator enters "3x" and receives no error. Reproduce both reports, distinguish an absent option from an invalid one, and repair the parser before any request or retry loop is connected to it.

## Evidence

### Observed values

````
undefined → 3; "0" → 3; "  " → 3; "3x" → 3; "1e2" → 1. Several different mistakes collapse into apparently valid configuration.
````

### Boundary agreement

````
Only undefined means absent. A supplied string must contain one complete signed decimal integer after trimming. Blank input is a mistake, not a request for the fallback.
````

## Reproduce

1. Run the unchanged starter and compare each line with the boundary agreement.
2. Add the supplied parser cases, recording returned values or exception classes rather than just whether something threw.
3. Test invalid options separately: reversed bounds, fractional fallback, and a fallback outside the interval.

## Inherited code

````javascript
function readOptionalInteger(raw, {fallback, min, max}) {
  const value = parseInt(raw, 10) || fallback;
  if (value < min || value > max) throw new RangeError('Outside bounds');
  return value;
}
const options = {fallback: 3, min: 0, max: 5};
for (const raw of [undefined, '0', '  ', '3x', '1e2']) {
  try { console.log(JSON.stringify(raw), '=>', readOptionalInteger(raw, options)); }
  catch (error) { console.log(JSON.stringify(raw), '=>', error.name); }
}
````

## Fixtures

### parser-cases.json

````
{"options":{"fallback":3,"min":0,"max":5},"accepted":[[" +2 ",2],["-0",0],["05",5]],"typeErrors":["", "  ", "1.0", "0x10", "3x", null, false, 0],"rangeErrors":["-1","6","9007199254740993"]}
````

## Constraints

- Keep the exact readOptionalInteger(raw, options) API used by lab-49.
- Options must be safe integers with min ≤ fallback ≤ max. Supplied raw values must be strings; absence is exactly undefined.
- Reject blank, partial, hexadecimal, fractional, or exponent spellings instead of coercing them.

## Acceptance evidence

- Undefined returns the fallback; "0" and "-0" return ordinary positive zero; surrounding whitespace is permitted.
- Type or syntax failures throw TypeError; unsafe or out-of-range parsed integers throw RangeError.
- Invalid options fail before a fallback or parsed result is returned.
- Your regression table includes absence, valid zero, blank input, partial input, both bounds, and an unsafe integer.

## Focused repair lab

Open `#/lab/lab-49` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add a separate Boolean configuration parser for exact strings "true" and "false". Explain why Boolean("false") cannot implement that contract.

## References

- [MDN: Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## Clues — open only after your own attempt

1. Trace the value produced by parseInt before the logical OR runs.
2. Validation of spelling and validation of numeric range are different decisions.
3. Recognize the entire trimmed decimal spelling, convert once, then check safe-integer bounds. Handle absence explicitly before parsing.

## Debrief — compare after you have evidence

- The fallback operator treated a valid result as missing. Replacing it with another defaulting operator addresses only one symptom; parseInt still accepts a prefix of invalid input.
- A boundary parser should make states visible: absent, valid, malformed, and out of range. The caller can then show a useful configuration error instead of silently choosing a different operating policy.

---

# incident-02 · Two orders become one

Stage 1 · after lesson-06 · approximately 50 minutes

Identity coercion and a missing cent at the import boundary

## Environment

Local Node.js 20.11+; save starter as incident.mjs and run node incident.mjs. No packages, network, or real customer data.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: a small dispatch importer accepts order IDs and prices from a text export. Two distinct orders appear under one identity, and a 0.29 delivery surcharge becomes 28 cents. The team suspects duplicate source rows. Your assignment is to preserve the original evidence, locate the first lossy conversion, and define a boundary contract that prevents both failures before pricing rules run.

## Evidence

### Source rows

````
IDs 9007199254740992 and 9007199254740993 are distinct text identifiers. Both rows intentionally use amount 0.29; equal amounts do not imply equal orders.
````

### Observed probe

````
same normalized ID: true; normalized cents: 28; original IDs unchanged: true. The source remains correct while its derived representation is wrong.
````

## Reproduce

1. Run the supplied program and record all three observations before changing code.
2. Inspect Number(rows[0].id), Number(rows[1].id), and Number("0.29") * 100 separately; identify which operation first changes meaning.
3. Repair normalization, then add each boundary-cases.json value to your probe. Compare exact strings and exact integer cents.

## Inherited code

````javascript
const rows = [
  {id: '9007199254740992', amount: '0.29'},
  {id: '9007199254740993', amount: '0.29'}
];
function normalizeOrder(row) {
  return {id: Number(row.id), cents: Math.trunc(Number(row.amount) * 100)};
}
const normalized = rows.map(normalizeOrder);
console.log('same normalized ID:', normalized[0].id === normalized[1].id);
console.log('normalized cents:', normalized[0].cents);
console.log('original IDs unchanged:', rows[0].id !== rows[1].id);
````

## Fixtures

### boundary-cases.json

````
{"accepted":[{"id":"0007","amount":"0.00"},{"id":"9007199254740993","amount":"999999.99"}],"rejectedAmounts":["1.005","1e2"," 1.00","-0.01","Infinity",""],"distinctIds":["0007","7"]}
````

## Constraints

- IDs are opaque nonempty strings; preserve leading zeros and every digit.
- Prices use unsigned decimal text with exactly two fractional digits, from 0.00 through 999999.99. Reject other spellings; never silently round them.
- Do not edit the fixtures or compensate by subtracting a guessed epsilon.

## Acceptance evidence

- The two long IDs and the pair "0007"/"7" remain distinct.
- 0.29 becomes 29 cents; 999999.99 becomes 99999999 cents; every rejected amount throws a useful boundary error.
- Normalization leaves inputs unchanged and returns a safe integer cents field.
- Submit a regression probe that fails on the original implementation and a short explanation separating identity from quantity.

## Focused repair lab

This case is a project investigation without an automated repair lab.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add negative refunds and currencies with zero or three fractional digits. Specify their grammar and scale first; do not assume every currency uses two digits.

## References

- [MDN: Number.isSafeInteger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

## Clues — open only after your own attempt

1. Ask whether arithmetic is meaningful for an order ID.
2. Write the accepted price grammar before choosing a conversion function.
3. Once the decimal spelling is validated, combine whole-unit digits and two fractional digits using integer arithmetic within the stated range.

## Debrief — compare after you have evidence

- The visible duplicate was created downstream. Converting an opaque identifier into a Number discarded information before equality was tested; changing the equality operator cannot restore it.
- A decimal price boundary is a representation decision. Exact integer cents work here because the grammar and maximum are bounded. Keep that contract beside the parser so later developers cannot accidentally broaden it with parseFloat.

---

# incident-03 · A rejected edit still changes the profile

Stage 2 · after lesson-07 · approximately 45 minutes

Missing, null, and invalid fields require one atomic decision

## Environment

Local Node.js 20.11+; run the starter as incident.mjs. Treat objects as the model boundary; no form or database is required.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: a profile editor reports that an update failed, but the display name has already changed. Separately, clearing the biography with null has no effect. The application uses the same patch function for autosave and manual edits. Determine which distinctions the patch contract lost and ensure that a rejected update cannot partially modify the current profile.

## Evidence

### First report

````
patch {displayName:"  New name  ",notifications:"yes"} throws TypeError, but the original displayName becomes "New name".
````

### Second report

````
patch {bio:null} keeps the previous biography. An inherited displayName is also currently treated as an instruction.
````

## Reproduce

1. Run the two reported failures, retaining a serialized copy of current before each operation.
2. Exercise inherited, undefined, unknown, symbol, and accessor patches from the supplied module. Check whether the accessor runs.
3. After a successful patch, mutate the returned top-level fields and confirm the old profile remains unchanged.

## Inherited code

````javascript
function patchProfile(current, patch) {
  if (patch.displayName) current.displayName = patch.displayName.trim();
  if (patch.bio) current.bio = patch.bio;
  if ('notifications' in patch) {
    if (typeof patch.notifications !== 'boolean') throw new TypeError('notifications');
    current.notifications = patch.notifications;
  }
  return current;
}
const current = {displayName: 'Mira', bio: 'Original bio', notifications: false};
try { patchProfile(current, {displayName: '  New name  ', notifications: 'yes'}); }
catch (error) { console.log('rejected:', error.name); }
console.log('after rejected patch:', JSON.stringify(current));
console.log('after clear:', JSON.stringify(patchProfile(current, {bio: null})));
````

## Fixtures

### adversarial-patches.mjs

````
export const inherited = Object.create({displayName: 'Inherited'});
export const explicitUndefined = {bio: undefined};
export const unknown = {role: 'administrator'};
export const symbol = {[Symbol('hidden')]: true};
export function accessorProbe() {
  let reads = 0;
  const patch = Object.defineProperty({}, 'bio', {enumerable: true, get() { reads++; return 'side effect'; }});
  return {patch, reads: () => reads};
}
````

## Constraints

- Keep patchProfile(current, patch); current is a valid profile containing displayName, bio, and notifications.
- Inspect only own data properties; inherited fields are ignored. Reject unknown keys, symbols, accessors, and explicit undefined.
- displayName is a trimmed nonblank string, bio is a string or null, and notifications is Boolean.

## Acceptance evidence

- A missing field retains its old value; bio:null clears the biography; notifications:false is applied.
- Any invalid field rejects the whole patch without changing either input.
- Every success returns a fresh object, including an empty patch.
- The accessor probe is rejected without invoking its getter, and inherited values never become edits.

## Focused repair lab

Open `#/lab/lab-50` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add nested contact settings. Define shallow versus recursive patch behavior and test reference ownership before introducing a generic deep-merge helper.

## References

- [MDN: Object.assign and property assignment behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

## Clues — open only after your own attempt

1. Property absence is not the same thing as a falsy value.
2. Find the first write to current and ask what validation can still fail afterward.
3. Inspect property descriptors, validate the complete patch, and construct the replacement only after all checks succeed.

## Debrief — compare after you have evidence

- A patch is a small command language: an absent key says keep, while an allowed explicit null says clear. Truthiness cannot express those instructions.
- Atomicity here is local and synchronous: validate first, publish one replacement afterward. It does not imply a database transaction. Rejecting accessors also keeps validation from accidentally executing caller-supplied behavior while inspecting a patch.

---

# incident-04 · The import that inherited approval

Stage 2 · after lesson-12 · approximately 55 minutes

Untrusted object fields cross a model boundary

## Environment

Local Node.js 20.11+; run the starter as incident.mjs in a fresh process. The fixture changes only a newly created object prototype, never Object.prototype.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: Dataset Studio imports a display profile and unexpectedly enables an approval-only view. The JSON contains no own approved property, yet the application reads approved as true. A support export appears harmless because JSON.stringify omits the inherited value. Investigate the disagreement between the serialized record and the properties the application actually reads; then build an explicit import boundary.

## Evidence

### Application observation

````
approved lookup: true; owns approved: false; exported profile contains displayName only. The prototype of this one imported record differs from Object.prototype.
````

### Scope

````
The supplied fixture is JSON data. No script, getter, network request, or global prototype mutation is needed to trigger the defect.
````

## Reproduce

1. Run the starter in a fresh Node process. Compare direct lookup, Object.hasOwn, JSON output, and the prototype check.
2. Pass each imports.json entry through the importer; record whether rejection happens before a profile is returned.
3. Add a regression that checks Object.prototype and the imported object prototype independently; do not claim the fixture polluted every object.

## Inherited code

````javascript
const text = '{"displayName":"Mira","__proto__":{"approved":true}}';
function importProfile(text) {
  return Object.assign({displayName: ''}, JSON.parse(text));
}
const profile = importProfile(text);
console.log('approved lookup:', profile.approved);
console.log('owns approved:', Object.hasOwn(profile, 'approved'));
console.log('export:', JSON.stringify(profile));
console.log('ordinary prototype:', Object.getPrototypeOf(profile) === Object.prototype);
console.log('global prototype untouched:', Object.prototype.approved === undefined);
````

## Fixtures

### imports.json

````
{"valid":{"displayName":"Mira","bio":null},"unknown":{"displayName":"Mira","approved":true},"dangerous":{"displayName":"Mira","constructor":{"prototype":{"approved":true}}},"invalidShapes":[null,[],42,{"displayName":false}]}
````

## Constraints

- The accepted schema contains displayName, a trimmed nonempty string up to 80 characters, and optional bio, either null or a string up to 500 characters.
- Reject unknown own keys and non-object or array roots. Imported data cannot grant approval.
- Return a fresh ordinary object containing only validated own fields; preserve the source text for a useful error report.

## Acceptance evidence

- The hostile fixture is rejected, including constructor and __proto__ keys.
- Valid nullable bio is preserved; missing bio receives null; empty names and wrong types fail.
- No returned profile gains inherited privileges, and Object.prototype remains unchanged.
- A failed import leaves any current selected profile intact and reports the invalid field without rendering source text as HTML.

## Focused repair lab

This case is a project investigation without an automated repair lab.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Allow a separate custom-metadata dictionary with user-chosen keys. Compare Map and a null-prototype object while keeping privileged model fields outside that dictionary.

## References

- [MDN: JavaScript prototype pollution](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution)
- [MDN: Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

## Clues — open only after your own attempt

1. JSON parsing and assigning parsed keys into another object are separate operations.
2. Compare enumerated own keys with the deliberately small allowed schema.
3. Construct the result from named validated fields. Changing the merge operator alone does not define which data the application should trust.

## Debrief — compare after you have evidence

- This reproduction exercises prototype replacement on a target object through assignment. It does not demonstrate global prototype pollution, and an accurate incident report should preserve that distinction.
- An import boundary needs both shape validation and controlled construction. Even a merge that avoids this particular setter can admit an own approved field unless the schema rejects it. Authorization should not be inferred from arbitrary imported profile data.

---

# incident-05 · One failed cleanup leaves the room open

Stage 3 · after lesson-17 · approximately 50 minutes

Resource ownership needs a dependable closing contract

## Environment

Local Node.js 20.11+; run the starter as incident.mjs. Synchronous cleanup callbacks represent listeners, worker handles, and subscriptions without creating real timers.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: reopening an SDK-backed panel produces duplicate notifications. The close operation reports one error, yet older resources remain registered. A second close repeats some cleanup work. Investigate the supplied execution trace and implement a resource scope whose lifecycle remains understandable even when one collaborator throws during teardown.

## Evidence

### Observed first close

````
Execution starts with bus, then renderer throws. Worker cleanup never runs. Registration order leaks into teardown order.
````

### Observed second close

````
Bus and renderer run again. The API has no completed-close state, so callers cannot safely close during both error recovery and ordinary navigation.
````

## Reproduce

1. Run the starter and compare both traces with the checklist; identify the abandoned resource after the first error.
2. Replace two callbacks with distinct Error objects and check both identity and ordering in the repaired AggregateError.errors array.
3. Add a cleanup that calls scope.close() itself. Verify the trace stays finite without timers or recursion guards in the fixture.

## Inherited code

````javascript
function createResourceScope() {
  const cleanups = [];
  return {
    add(cleanup) { cleanups.push(cleanup); },
    close() { for (const cleanup of cleanups) cleanup(); }
  };
}
const calls = [];
const scope = createResourceScope();
scope.add(() => calls.push('bus'));
scope.add(() => { calls.push('renderer'); throw new Error('renderer failed'); });
scope.add(() => calls.push('worker'));
for (let attempt = 1; attempt <= 2; attempt++) {
  try { scope.close(); } catch (error) { console.log('close error:', error.message); }
  console.log('attempt', attempt, JSON.stringify(calls));
}
````

## Fixtures

### lifecycle-checklist.txt

````
Acquire order: bus, renderer, worker.
Required teardown order: worker, renderer, bus.
A callback may call close() again: no callback may repeat.
Two callbacks may throw: preserve both error objects in teardown order.
Adding a cleanup after close has started must fail.
Registering the same function twice represents two registrations.
````

## Constraints

- Keep createResourceScope() with add(syncCleanup) and close(). Asynchronous cleanup is outside this contract.
- Each successful registration runs exactly once; teardown is last-in, first-out.
- Reject nonfunctions and additions after closing begins. A repeated close is a no-op.

## Acceptance evidence

- The initial close attempts worker, renderer, then bus despite the renderer failure.
- After all callbacks run, failure is reported as AggregateError containing original thrown values in execution order.
- A second or reentrant close performs no extra work and does not replay a previous error.
- Closing an empty scope succeeds, and separate scopes have independent lifetimes.

## Focused repair lab

Open `#/lab/lab-51` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Design an asynchronous closeAsync variant with explicitly sequential cleanup and a returned completion promise. Specify repeated-close behavior before adding concurrency.

## References

- [MDN: AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

## Clues — open only after your own attempt

1. A resource acquired later may depend on one acquired earlier.
2. Decide when the scope becomes closed relative to invoking arbitrary callbacks.
3. Detach the work list, mark the scope closed, drain it in reverse order, and report collected errors only after every registration has been attempted.

## Debrief — compare after you have evidence

- Cleanup failure should not abandon unrelated cleanup. Continuing teardown and preserving its errors gives the caller both better resource hygiene and more complete evidence.
- Idempotence belongs to the scope contract, not to hopeful assumptions about each collaborator. Marking the lifecycle transition before invoking callbacks also prevents reentrant close calls from replaying work.

---

# incident-06 · A price that survives its replacement

Stage 3 · after lesson-18 · approximately 60 minutes

Cache invalidation exposes unclear module ownership

## Environment

Local Node.js 20.11+ with ES modules. Save the starter as incident.mjs and the two supplied .mjs files beside it; run node incident.mjs.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: an SDK returns an old price after a catalog refresh. A caller can also change catalog data without calling any update method. The team proposes clearing every cache whenever a module renders. Identify the actual state owner, make updates observable there, and prove that every public mutation path preserves lookup consistency.

## Evidence

### Deterministic transcript

````
first 100; after replacement 100; after external mutation 100. The catalog refresh contains 175, then a caller writes 999 through the exported rows array.
````

### Design clue

````
The cache key contains an item ID but no catalog revision. Both the catalog container and cached record references escape their modules.
````

## Reproduce

1. Run the three-file reproduction and draw the references held by catalog.rows and the cache after replacement.
2. Add a replacement where pen is removed, then a replacement where pen returns at 220 cents; query after each operation.
3. Attempt to mutate both the caller-owned replacement array and a value returned from your repaired public API.

## Inherited code

````javascript
import {catalog, replaceCatalog} from './catalog.mjs';
import {priceFor} from './prices.mjs';
console.log('first', priceFor('pen'));
replaceCatalog([{id: 'pen', cents: 175}]);
console.log('after replacement', priceFor('pen'));
catalog.rows[0].cents = 999;
console.log('after external mutation', priceFor('pen'));
````

## Fixtures

### catalog.mjs

````
export const catalog = {rows: [{id: 'pen', cents: 100}]};
export function replaceCatalog(rows) { catalog.rows = rows; }
````

### prices.mjs

````
import {catalog} from './catalog.mjs';
const cache = new Map();
export function priceFor(id) {
  if (!cache.has(id)) cache.set(id, catalog.rows.find(row => row.id === id));
  return cache.get(id)?.cents ?? null;
}
````

## Constraints

- Keep catalog state behind a narrow module API; no DOM hook or global refresh bus may be required for correctness.
- Validate all replacement rows before publishing them: unique string IDs and nonnegative safe integer cents.
- Choose either explicit invalidation or revision-aware caching. Explain why retaining the cache is useful at this scale.

## Acceptance evidence

- The initial, replaced, removed, and restored prices are 100, 175, null, and 220.
- Invalid replacement preserves the complete previous catalog and cache behavior.
- Mutation of caller-owned input or a returned snapshot cannot silently rewrite owned catalog state.
- Two independent catalog instances do not share cache entries; tests can construct fresh ownership without reloading the process.

## Focused repair lab

This case is a project investigation without an automated repair lab.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add an asynchronous price loader. Prove that an old revision resolving after replacement cannot repopulate the current cache; distinguish this race from ordinary synchronous invalidation.

## References

- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## Clues — open only after your own attempt

1. An imported binding being live does not make a Map entry automatically recompute.
2. List every way a caller can currently change the data, including shared references.
3. Put the revision or invalidation decision next to the successful catalog update; a factory can isolate state for separate SDK consumers.

## Debrief — compare after you have evidence

- The stale result is evidence of two owners believing they control the same fact. A cache must have a clear relationship to the lifetime or revision of its source.
- A module API is also a reference boundary. Copying the array alone still shares its row objects. Decide what may escape, and test that decision. Removing unnecessary caching can be a sound repair if it satisfies the performance requirements.

---

# incident-07 · The preview cuts a person in half

Stage 4 · after lesson-20 · approximately 40 minutes

Visible characters are not string indexes

## Environment

Local Node.js 20.11+ with Intl.Segmenter, or a modern browser console with that API. Run starter as incident.mjs; report missing capability explicitly.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: Research Queue shortens article titles for its compact view. English titles look fine, but a family emoji becomes an incomplete symbol, a flag splits, and a decomposed accented letter loses its accent. The product requirement is a limit on user-perceived characters. Determine what the current implementation counts and preserve the original text while producing a safe preview.

## Evidence

### Fixture inventory

````
The examples contain a combining accent, a two-indicator flag, a skin-tone modifier, and a multi-person zero-width-joiner sequence. Each first visible unit should remain intact.
````

### Failure signature

````
slice(0,1) operates on UTF-16 code units. Replacing it with [...text].slice(0,1) fixes surrogate splitting but still does not satisfy every fixture.
````

## Reproduce

1. Run the starter and compare the JSON-escaped output with each expected fixture.
2. Try a code-point implementation using spread syntax and record which cases still fail.
3. Check exactly-at-limit, empty input, zero limit, an empty suffix, and a custom multi-character suffix.

## Inherited code

````javascript
function truncateGraphemes(text, limit, suffix = '…') {
  return text.length > limit ? text.slice(0, limit) + suffix : text;
}
for (const text of ['éclair', '🇵🇱 travel', '👍🏽 approved', '👩‍👩‍👧‍👦 notes']) {
  console.log(JSON.stringify(text), '=>', JSON.stringify(truncateGraphemes(text, 1)));
}
console.log('empty:', JSON.stringify(truncateGraphemes('', 0)));
console.log('zero:', JSON.stringify(truncateGraphemes('abc', 0)));
````

## Fixtures

### grapheme-cases.json

````
[{"text":"éclair","limit":1,"expected":"é…"},{"text":"🇵🇱 travel","limit":1,"expected":"🇵🇱…"},{"text":"👍🏽 approved","limit":1,"expected":"👍🏽…"},{"text":"👩‍👩‍👧‍👦 notes","limit":1,"expected":"👩‍👩‍👧‍👦…"},{"text":"👩‍👩‍👧‍👦","limit":1,"expected":"👩‍👩‍👧‍👦"}]
````

## Constraints

- Keep truncateGraphemes(text, limit, suffix="…"). Both text and suffix are strings; limit is a nonnegative safe integer.
- The suffix is outside the grapheme budget and appears only when content was removed.
- Preserve normalization and original code units; do not silently normalize or strip joining characters.

## Acceptance evidence

- All supplied grapheme clusters survive intact and match the fixture strings exactly.
- A zero limit returns the suffix for nonempty text and an empty string for empty text.
- At-limit input receives no suffix; invalid arguments are rejected.
- The implementation uses feature-detected Intl.Segmenter or clearly reports an unsupported host instead of claiming a code-point fallback is equivalent.

## Focused repair lab

Open `#/lab/lab-52` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Investigate a date label across a daylight-saving transition using an explicit IANA time zone. Explain why adding 24 hours and advancing one calendar day are different requirements.

## References

- [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

## Clues — open only after your own attempt

1. Count code units, code points, and grapheme segments for the same family emoji.
2. Intl.Segmenter exposes grapheme segmentation as a host capability.
3. Retain whole segments and detect whether an additional segment exists before deciding to append the suffix.

## Debrief — compare after you have evidence

- A string index is useful for the representation JavaScript exposes, but a product character limit must define its own unit. The fixtures make that choice testable.
- Segmentation preserves a cluster boundary; normalization is a separate transformation. Avoid adding it as an incidental repair because it changes the stored representation and can affect exact comparisons elsewhere.

---

# incident-08 · The older search wins last

Stage 4 · after lesson-23 · approximately 55 minutes

Success and failure race against the current user intent

## Environment

Local Node.js 20.11+; run the starter as incident.mjs. Deferred promises control completion order; no timers, fetch calls, or arbitrary waiting are used.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: a user searches for an old term, immediately corrects it, and sees the correct results briefly. A late response then replaces them. On another attempt, an obsolete request fails and turns the newer successful screen into an error. Trace request ownership independently from completion order and protect the displayed state without hiding either caller’s own result.

## Evidence

### Controlled sequence

````
Start old, start new, resolve new, then settle old. The current implementation ends with OLD success or an obsolete error, depending on the last settlement.
````

### Boundary

````
The supplied loader is an ordinary promise-returning function. It does not promise cancellation, and a late result remains possible even if a separate transport supports abort.
````

## Reproduce

1. Run both controlled probes and compare final screen state with the old caller’s independent outcome.
2. Add the supplied matrix cases using deferred promises, resolving or rejecting only when the scenario says to.
3. Check state immediately after a new run and after each relevant settlement.

## Inherited code

````javascript
function createLatestRequest(load) {
  let state = {status: 'idle', value: undefined, error: undefined};
  return {
    snapshot: () => ({...state}),
    run(input) {
      state = {status: 'pending', value: undefined, error: undefined};
      let result;
      try { result = load(input); } catch (error) { result = Promise.reject(error); }
      return Promise.resolve(result).then(
        value => { state = {status: 'success', value, error: undefined}; return value; },
        error => { state = {status: 'error', value: undefined, error}; throw error; }
      );
    }
  };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return {promise, resolve, reject};
}
async function probe(rejectOld) {
  const gates = {old: deferred(), new: deferred()};
  const request = createLatestRequest(input => gates[input].promise);
  const old = request.run('old');
  const oldOutcome = old.then(value => ({value}), error => ({error: error.message}));
  const latest = request.run('new');
  gates.new.resolve('NEW');
  await latest;
  console.log('new settled:', request.snapshot().status, request.snapshot().value);
  if (rejectOld) gates.old.reject(new Error('obsolete failure'));
  else gates.old.resolve('OLD');
  console.log('old caller:', await oldOutcome);
  const state = request.snapshot();
  console.log('final screen:', state.status, state.value, state.error?.message);
}
await probe(false);
await probe(true);
````

## Fixtures

### request-matrix.txt

````
A starts; B starts; B succeeds; A succeeds -> screen keeps B.
A starts; B starts; B succeeds; A fails -> screen keeps B.
A starts; B starts; A succeeds; B fails -> screen shows B failure.
The loader throws synchronously -> run returns a rejected promise.
A new run starts after success -> pending state clears old value and error.
Mutating a returned snapshot's status does not change the internal status.
````

## Constraints

- Keep createLatestRequest(load), run(input), and snapshot() from lab-53.
- Only the latest-started run may publish success or error; each run still preserves its own result or rejection.
- Do not treat abort support as the proof that obsolete completions cannot arrive.

## Acceptance evidence

- Both probes finish with NEW success while the old caller receives OLD or its original error.
- Latest failures remain visible; stale failures cannot overwrite newer state.
- Starting a run clears value and error; snapshots are fresh objects.
- The loader is invoked synchronously; a synchronous throw becomes an observable rejected run promise without escaping run().

## Focused repair lab

Open `#/lab/lab-53` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add cooperative AbortController support. As a distinct challenge, model a server accepting a write while its acknowledgement is lost; investigate idempotency keys before retrying that side effect.

## References

- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## Clues — open only after your own attempt

1. Assign ownership when a request starts, before calling the loader.
2. Apply the ownership check to both fulfillment and rejection branches.
3. Use a monotonically changing request token; keep publication decisions separate from the promise returned to each caller.

## Debrief — compare after you have evidence

- Completion order is an environmental fact; current intent is an application policy. Keeping those concepts separate prevents old work from taking ownership of the screen.
- Cancellation can reduce wasted work, but stale-result gating remains useful when an adapter ignores cancellation or a completion is already queued. Suppressing publication must not silently convert the caller’s failed request into success.

---

# incident-09 · The API returned a login page

Stage 5 · after lesson-28 · approximately 50 minutes

Separate HTTP status, media type, parsing, and transport evidence

## Environment

Local Node.js 20.11+ with supplied response adapters. The same core runs in the browser Worker lab; no external API, credentials, or CORS configuration is required.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: Field Notes reports “invalid JSON” after a session expires. A captured response has status 200 and a login HTML document, while a different failure has status 503 with valid JSON. Support calls both cases a network outage. Diagnose the evidence at each boundary and return a classification that lets the UI explain what actually failed.

## Evidence

### Login capture

````
Status: 200. Content-Type: text/html; charset=utf-8. Body starts with <!doctype html><title>Sign in</title>. Successful HTTP status does not make this an API JSON response.
````

### Transport distinction

````
A rejected fetch may expose no response at all. A generic TypeError alone does not prove CORS; browser network/console evidence is needed. The core fixture instead models already-received responses.
````

## Reproduce

1. Run the starter. Identify the 503 response incorrectly treated as success and the login page mislabeled as malformed JSON.
2. Add the body-read failure fixture; compare its original error object with the returned error.
3. Count text() calls for every case, including HTTP and media-type rejection.

## Inherited code

````javascript
async function readJSONResponse(response) {
  try { return {ok: true, status: response.status, data: JSON.parse(await response.text())}; }
  catch (error) { return {ok: false, status: response.status, kind: 'json', error}; }
}
const fixtures = [
  {name: 'login', status: 200, contentType: 'text/html', body: '<!doctype html><title>Sign in</title>'},
  {name: 'unavailable', status: 503, contentType: 'application/json', body: '{"retry":true}'},
  {name: 'invalid', status: 200, contentType: 'application/json', body: '{broken'},
  {name: 'vendor', status: 200, contentType: 'Application/Problem+JSON; charset=utf-8', body: '{"detail":"example"}'},
  {name: 'empty', status: 204, contentType: 'application/json', body: ''}
];
for (const fixture of fixtures) {
  let reads = 0;
  const result = await readJSONResponse({...fixture, text: async () => { reads++; return fixture.body; }});
  console.log(fixture.name, result.ok ? 'ok' : result.kind, 'body reads:', reads);
}
````

## Fixtures

### read-failure.mjs

````
export const bodyError = new Error('Synthetic body reader disconnected');
export const response = {status: 200, contentType: 'application/json', text() { throw bodyError; }};
export const transportError = new TypeError('Synthetic fetch rejection: cause intentionally unknown');
````

## Constraints

- Keep the plain {status,contentType,text} adapter and result contract from lab-54.
- Classify non-2xx as http before reading. For 2xx, accept application/json and application/*+json, ignoring case and parameters.
- A malformed adapter throws TypeError; do not insert response bodies into HTML or claim a CORS diagnosis from an error name.

## Acceptance evidence

- Login → content-type; 503 → http; malformed JSON and empty 204 JSON body → json; vendor JSON → success.
- Rejected HTTP status or content type causes zero body reads; accepted responses are read exactly once.
- Body-reader rejection returns kind read with the original error.
- Document a separate transport-error path for a fetch that rejects before supplying any response.

## Focused repair lab

Open `#/lab/lab-54` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add a real same-origin test server with JSON, HTML-login, redirect, and 503 routes. Inspect the final response URL; keep credentials and external services out of the reproduction.

## References

- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: Response.json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)

## Clues — open only after your own attempt

1. Check the response contract before deciding to invoke the body reader.
2. An empty successful response and a successful JSON response are different API promises.
3. Keep status checks, media-type checks, body reading, and JSON parsing as separate decision points.

## Debrief — compare after you have evidence

- The same visible error message concealed different repair owners: authentication routing, service availability, and malformed payloads. A useful classification preserves that distinction.
- The adapter intentionally avoids real network timing. Manual browser integration should add evidence about redirects, final URL, and fetch rejection without guessing that every transport failure is CORS.

---

# incident-10 · Saved on screen, missing after reload

Stage 5 · after lesson-30 · approximately 70 minutes

A failed write reveals the real commit boundary

## Environment

Local Node.js 20.11+ for deterministic storage adapters. Browser continuations use a disposable project origin and synthetic data, never the training portal’s real storage.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: a note appears saved after the browser refuses persistence. Reload restores the old note. A proposed import fix writes three keys, then attempts rollback; its rollback can fail too. Establish the single-key commit contract first, then use the supplied harder fixtures to explain why multiple writes and multiple tabs need additional coordination.

## Evidence

### Visible versus durable

````
commit throws “Synthetic quota failure”, yet snapshot().notes contains new while the stored JSON still contains old.
````

### Harder continuations

````
rollback-failure.mjs leaves notes and tags new but settings old. two-tabs.mjs ends with only tab B’s edit because both tabs began from the same revision.
````

## Reproduce

1. Run incident.mjs and compare the reported failure with both state representations.
2. Use a cyclic next value to trigger serialization failure before a write. Mutate initial and returned snapshots to probe ownership.
3. Run each continuation independently. Record the exact failed write number and the point at which tab B’s stale snapshot became authoritative.

## Inherited code

````javascript
function createPersistentStore(initial, storage, key) {
  let state = initial;
  return {
    snapshot: () => state,
    commit(next) { state = next; storage.setItem(key, JSON.stringify(next)); return state; }
  };
}
const initial = {notes: ['old']};
const storage = {
  raw: JSON.stringify(initial),
  setItem() { throw new Error('Synthetic quota failure'); }
};
const store = createPersistentStore(initial, storage, 'practice');
try { store.commit({notes: ['new']}); } catch (error) { console.log(error.message); }
console.log('screen:', JSON.stringify(store.snapshot()));
console.log('durable:', storage.raw);
````

## Fixtures

### rollback-failure.mjs

````
const values = {notes: 'old', tags: 'old', settings: 'old'};
let writes = 0;
function setItem(key, value) {
  writes++;
  if (writes === 3 || writes === 4) throw new Error(`write ${writes} failed`);
  values[key] = value;
}
const before = {...values};
try { for (const key of Object.keys(values)) setItem(key, 'new'); }
catch (original) {
  try { for (const key of Object.keys(before)) setItem(key, before[key]); }
  catch (rollback) { console.log(original.message, 'then', rollback.message); }
}
console.log('mixed state:', JSON.stringify(values));
````

### two-tabs.mjs

````
let raw = JSON.stringify({revision: 0, notes: []});
const tabA = JSON.parse(raw);
const tabB = JSON.parse(raw);
tabA.notes.push('edit A'); tabA.revision++;
raw = JSON.stringify(tabA);
tabB.notes.push('edit B'); tabB.revision++;
raw = JSON.stringify(tabB);
console.log('last writer:', raw);
console.log('recoverable A draft:', JSON.stringify(tabA));
````

## Constraints

- Keep createPersistentStore(initial, storage, key), commit(next), and snapshot(); initialization performs no write.
- Commit synchronously serializes and parses JSON, writes that serialized candidate, then publishes its independent in-memory copy.
- The core single-key adapter does not promise multi-key transactions, cross-tab isolation, or crash durability.

## Acceptance evidence

- Serialization or setItem failure leaves the current state unchanged and throws to the caller.
- Successful commit and snapshot return independent JSON copies; caller mutations cannot rewrite owned state.
- Explain why rollback failure cannot honestly be reported as “restored”. Preserve the original and rollback errors.
- For the two-tab continuation, preserve both drafts and propose an explicit conflict policy and coordination mechanism.

## Focused repair lab

Open `#/lab/lab-55` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Build the continuation with an IndexedDB transaction and two actual tabs. Detect conflicts without silently erasing either draft; retain a local export path when storage remains unavailable.

## References

- [MDN: Storage.setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [MDN: Window storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

## Clues — open only after your own attempt

1. Locate the first publication of next relative to the operation that can fail.
2. A rollback is another write, so its success must be observed too.
3. A single authoritative envelope simplifies small-state commits; IndexedDB transactions can support larger atomic updates. Cross-tab conflict handling is a separate requirement.

## Debrief — compare after you have evidence

- The screen should reflect the last acknowledged save. The core publishes only after the adapter accepts the same candidate; this establishes its synchronous contract, not a guarantee against every possible device or process failure.
- This does not make localStorage a transactional database. A storage event is a notification, not a lock, and checking a revision before a separate write is not an atomic compare-and-swap.

---

# incident-11 · One rejected write stops the queue

Stage 6 · after lesson-32 · approximately 70 minutes

Preserve each outcome while keeping later work alive

## Environment

Local Node.js 20.11+; run the starter as incident.mjs. The supplied extension uses Node’s built-in streams and an original in-memory NDJSON source.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: Signal Desk serializes writes to keep an export ordered. The first write fails, and every later submission rejects with the same error even though its writer was never called. The shutdown path also rejects while waiting for the queue to drain. Repair scheduling separately from individual outcomes, then investigate what an interrupted streaming source may safely claim to have committed.

## Evidence

### Observed queue trace

````
writer calls: ["first"]; outcomes: ["rejected","rejected","rejected"]; idle rejects. Only the first submission actually reached the writer.
````

### Streaming extension

````
The source yields one complete record and a partial second line, then throws. A finally block reports source closure. The partial tail is not an acknowledged record.
````

## Reproduce

1. Run the starter and distinguish submissions rejected by their own writer from submissions whose writer never ran.
2. Add a synchronous-throwing writer and a deferred writer you settle explicitly to verify FIFO and maximum concurrency one.
3. Run interrupted-source.mjs; then implement a line consumer that records complete committed IDs and reports the failed tail separately.

## Inherited code

````javascript
function createWriteQueue(write) {
  let tail = Promise.resolve();
  return {
    enqueue(value) { tail = tail.then(() => write(value)); return tail; },
    idle() { return tail; }
  };
}
const calls = [];
const queue = createWriteQueue(async value => {
  calls.push(value);
  if (value === 'first') throw new Error('Synthetic first-write failure');
  return `stored:${value}`;
});
const pending = ['first', 'second', 'third'].map(value => queue.enqueue(value));
const outcomes = await Promise.allSettled(pending);
console.log('writer calls:', JSON.stringify(calls));
console.log('outcomes:', JSON.stringify(outcomes.map(result => result.status)));
try { await queue.idle(); console.log('idle resolved'); }
catch { console.log('idle rejected'); }
````

## Fixtures

### interrupted-source.mjs

````
import {Readable} from 'node:stream';
async function* chunks() {
  try {
    yield Buffer.from('{"id":1,"title":"complete"}\n');
    yield Buffer.from('{"id":2,"title":"unfinished');
    throw new Error('Synthetic source interruption');
  } finally { console.log('source closed'); }
}
try {
  for await (const chunk of Readable.from(chunks())) {
    console.log('received bytes:', chunk.length, JSON.stringify(chunk.toString('utf8')));
  }
} catch (error) { console.log('source failure:', error.message); }
````

### queue-contract.txt

````
FIFO starts, at most one active writer.
Each enqueue result preserves that writer's own return value or rejection.
A synchronous writer throw is a rejection of that submission only.
idle() never rejects and waits for submissions present when idle() was called.
A later submission does not extend an already-created idle() barrier.
````

## Constraints

- Keep createWriteQueue(write), enqueue(value), and idle(); preserve the lab-56 snapshot-barrier contract.
- Use promise gates to control ordering; do not depend on sleeps or successful real disk writes.
- For the streaming continuation, bound pending line bytes and await each queued commit to prevent unbounded buffering.

## Acceptance evidence

- The core calls all three writers in order; only first rejects, and idle resolves after the initial submissions settle.
- Each caller observes its own value or original error; a failed scheduling tail cannot poison future work.
- An idle barrier created before a later submission does not wait for that later submission.
- The extension reports the interrupted source, closes resources, and never promotes the incomplete second record to committed state.

## Focused repair lab

Open `#/lab/lab-56` in the portal.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Add UTF-8 splits, CRLF splits, a 64 KiB line limit, and a replayed final acknowledged ID. Design a checkpoint and deduplication policy before claiming safe restart after interruption.

## References

- [MDN: Promise.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
- [Node.js: Streams](https://nodejs.org/api/stream.html)
- [MDN: TextDecoder.decode](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode)

## Clues — open only after your own attempt

1. One promise currently carries both a caller’s outcome and permission to start the next job.
2. The internal scheduling tail may recover while the original result promise still rejects.
3. Capture the current tail when idle is called. For streaming, track parsed, submitted, and successfully committed records separately.

## Debrief — compare after you have evidence

- Recovering the internal tail keeps the queue usable; returning that recovered promise to every caller would instead conceal failed writes. The two responsibilities need separate promises.
- Streaming adds another boundary: a complete parsed record is still not a committed record until its write succeeds. Failure reports and restart checkpoints should reflect that distinction.

---

# incident-12 · Yesterday’s tab writes today’s schema

Stage 6 · after lesson-36 · approximately 90 minutes

Release compatibility, recovery evidence, and honest incident triage

## Environment

Local Node.js 20.11+; the in-memory adapter deterministically represents two browser releases sharing one persistence key. No live deployment or user storage is touched.

All reports, logs, and data in this packet are synthetic. The starter is deliberately broken.
Read the environment and reproduction instructions before running it. Some packets require
assembling a browser or project experiment; they are not all standalone executables.

## Report

Synthetic incident: release 2 migrates notes to an items collection and adds archive state. A tab opened before deployment later saves its old draft. Archive state disappears and the schema number moves backwards. Preserve the supplied snapshots, then distinguish a repair for future clients from containment that can actually protect against already-running old code.

## Evidence

### Release timeline

````
T1 old tab loads schema 1, revision 4. T2 new release writes schema 2, revision 5 with archived:true. T3 old tab saves schema 1, revision 5. Equal revisions now describe incompatible data.
````

### Impact boundary

````
Only the shared local key is modeled. A service worker or refreshed HTML cannot retroactively change JavaScript already executing in the old tab.
````

## Reproduce

1. Run the program and retain all three raw snapshots before attempting recovery. Identify fields that each snapshot can still supply.
2. Modify a future-compatible client to reread and validate schema/revision at commit time; replay the ordered timeline.
3. Replay the original unmodified oldClient against your proposed deployment containment. Record honestly whether it can still overwrite the authoritative new state.

## Inherited code

````javascript
const storage = {raw: JSON.stringify({schema: 1, revision: 4,
  notes: [{id: 'n1', title: 'Read streams'}]})};
function oldClient(store) {
  const draft = JSON.parse(store.raw);
  return {save(title) {
    draft.notes[0].title = title;
    store.raw = JSON.stringify({schema: 1, revision: draft.revision + 1, notes: draft.notes});
  }};
}
const oldTab = oldClient(storage);
const beforeMigration = storage.raw;
storage.raw = JSON.stringify({schema: 2, revision: 5,
  items: [{id: 'n1', title: 'Read streams', archived: true}]});
const afterMigration = storage.raw;
oldTab.save('Read streams carefully');
console.log('before migration:', beforeMigration);
console.log('after migration:', afterMigration);
console.log('after stale save:', storage.raw);
````

## Fixtures

### triage-template.md

````
# Synthetic release incident
Observed trigger:
Confirmed impact and unknown scope:
Evidence preserved (schema, revision, build, original bytes):
Immediate containment for already-running clients:
Recovery choices requiring the user's decision:
Compatibility change for future clients:
Regression evidence:
Rollout and rollback conditions:
````

## Constraints

- Unknown future schemas must remain exportable as original bytes; do not reset them to an empty default.
- Never label a local read-then-write revision check an atomic cross-tab transaction.
- Do not silently choose between conflicting user titles during recovery.

## Acceptance evidence

- The future-compatible client refuses unsupported schema writes and preserves its unsaved draft.
- Provide a rollout strategy that handles unmodified old tabs, such as an earlier compatibility bridge or separate versioned authoritative storage with explicit reconciliation.
- Keep archived:true and the stale tab title available for a deliberate recovery decision.
- Complete the triage template with evidence, uncertainty, containment, migration tests, and rollback conditions; include same-build and mixed-build cases.

## Focused repair lab

This case is a project investigation without an automated repair lab.

A passing focused lab does not complete the wider incident. Keep the original failing
input and event order, explain the cause, and demonstrate a nearby variation.

## Investigation record

Record reproduction, hypotheses and observations, root cause, fix, a test that fails
before and passes after, recovery, and remaining limitations. Portal investigation
notes stay in your browser and are included in My notebook → Export backup.
This public case packet does not include your notes.

## Further variation

Extend to an HTTP service with conditional revision writes. Specify conflicts the server can prevent and offline drafts still requiring reconciliation.

## References

- [MDN: Window storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

## Clues — open only after your own attempt

1. A version label detects incompatibility only if the writer checks it before committing.
2. Decide whether deployment changes the old tab at all. Test the old function unchanged.
3. Separate migration from publication and preserve both source and migrated snapshots until compatibility and recovery have been verified.

## Debrief — compare after you have evidence

- The rollback in this incident is performed by an old writer, not by the migration function. Testing migrations in isolation misses the lifecycle of a real release.
- Compatibility needs a deployment story. A guard added only in release 2 cannot discipline an existing release 1 tab. Versioned storage or a staged bridge changes the containment boundary; neither automatically resolves conflicting user edits.

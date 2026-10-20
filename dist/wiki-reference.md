# JavaScript working wiki

35 practical references distilled from the book, with original examples. Selected essentials across chapters 1–17; specialized graphics, audio, binary data, and tool installation remain in the full book.

Open the site’s **JavaScript wiki** for searchable topics and direct links to lessons, labs, and projects. These Markdown pages are also readable in your editor.

# Language vs. runtime

Know which capabilities come from JavaScript and which come from its host.

## Essential rule

JavaScript defines the language; the browser or Node supplies the surrounding APIs.

Arrays, functions, objects, and promises are language features. The document object belongs to a browser page; filesystem access belongs to Node. A worker can run JavaScript without having access to the page DOM.

Keep calculations and data transformations in functions that receive inputs and return outputs. Put DOM access, files, and network operations at the boundary. This makes the same core behavior easier to reuse and test.

## When to use it

- Diagnosing “document is not defined” in a Node program.
- Sharing validation or transformations between a UI and a script.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function passedCount(results) {
  return results.filter(result => result.passed).length;
}
console.log(passedCount([{passed: true}, {passed: false}]));
```

Expected output:

```text
1
```

This calculation has no dependency on a page or filesystem. A browser or Node can provide its inputs.

## Common pitfalls

- A shared language does not mean every global API exists in every runtime.
- Running a file and typing an expression into a console can display results differently; use console.log for explicit output.
- Code that performs I/O as soon as it is imported is harder to test in isolation.

## Related topics

- Modules & explicit dependencies
- Functions & parameter contracts
- Tests, linting, and formatting

## Linked lessons

- Lesson 1: The JavaScript Workbench
- Lesson 25: The Browser Execution Model
- Lesson 31: Node.js & Command-Line Programs

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §1.1 — PDF page 41 (file page index, not printed numbering).
- §1.3 — PDF page 44 (file page index, not printed numbering).


---

# Syntax, return & line breaks

Avoid invisible behavior changes caused by automatic semicolon insertion.

## Essential rule

Keep the expression returned by a function on the same line as return, or start parentheses there.

Line breaks do not always end JavaScript statements. A following parenthesis or bracket can continue the previous expression. Use a consistent formatting style and explicit statement boundaries.

A newline immediately after return ends that return statement. An object on the next line will not be returned. Arrow functions that return an object expression need parentheses around the object to distinguish it from a function body.

## When to use it

- A function unexpectedly returns undefined.
- Refactoring long expressions across lines.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function broken() {
  return
  { ready: true };
}
const working = () => ({ ready: true });
console.log(broken());
console.log(working().ready);
```

Expected output:

```text
undefined
true
```

The first function returns before the next line. The arrow explicitly returns an object.

## Common pitfalls

- A newline after throw is a syntax error; do not split throw from its expression.
- An arrow body with braces needs an explicit return unless those braces are wrapped as an object expression.
- A formatter helps keep code consistent, but tests verify what it does.

## Related topics

- Functions & parameter contracts
- Conditions & choosing a loop

## Linked lessons

- Lesson 1: The JavaScript Workbench
- Lesson 2: Values, Types & Identity
- Lesson 9: Functions & API Contracts

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §2.6 — PDF page 66 (file page index, not printed numbering).


---

# Values, identity & mutation

Understand why changing one variable can appear to change another.

## Essential rule

Assignment copies a value. For an object, that value is a reference to the same object.

Primitives—undefined, null, booleans, numbers, bigints, strings, and symbols—are immutable. Reassigning a variable changes its binding; it does not mutate the primitive it previously held.

Objects, arrays, and functions have identity. Two separately created objects are not strictly equal even if their properties match. Copying an object with spread creates a new outer object, but nested object references are still shared.

## When to use it

- Updating application state without changing the previous state.
- Explaining why two identical-looking API responses fail an identity comparison.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const original = { settings: { retries: 1 } };
const copy = { ...original };
copy.settings.retries = 3;
console.log(original === copy);
console.log(original.settings.retries);
```

Expected output:

```text
false
3
```

The outer objects differ, but both settings properties refer to one nested object.

## Common pitfalls

- const prevents reassignment, not changes to object properties.
- typeof null is "object"; test null directly. Arrays also report "object"; use Array.isArray.
- A shallow copy is not a recursively independent copy.

## Related topics

- Object properties & safe updates
- Equality & explicit conversion
- Arrays, holes & mutation

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 7: Objects as Models
- Lesson 12: Data Modeling Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.1 — PDF page 71 (file page index, not printed numbering).
- §3.8 — PDF page 105 (file page index, not printed numbering).


---

# Numbers, NaN & precision

Validate numeric inputs and account for floating-point approximation.

## Essential rule

Number uses binary floating point. Check numeric boundaries explicitly instead of assuming conversion means validity.

Number(text) converts the entire string; invalid numeric text produces NaN. Number.isFinite(value) accepts finite numbers without coercing strings. Number.isNaN(value) identifies NaN itself.

Many decimal fractions cannot be represented exactly. Choose an error tolerance appropriate to the scale of a calculation. Integer quantities are exact only within the safe integer range. BigInt supports larger integers, but it is a separate type with integer division.

## When to use it

- Validating a retry count or duration entered as text.
- Comparing calculated measurements or working with large integer identifiers.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function parseRetries(text) {
  if (text.trim() === "") throw new TypeError("Retries required");
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError("Expected a nonnegative safe integer");
  }
  return value;
}
console.log(parseRetries("3"));
console.log(0.1 + 0.2 === 0.3);
console.log(Number.isNaN(Number("invalid")));
```

Expected output:

```text
3
false
true
```

Conversion and domain validation are separate steps. The second line exposes floating-point rounding.

## Common pitfalls

- Number("") and Number("   ") return 0; reject blank input before conversion when blank means missing.
- NaN is not equal to itself, and division of Number values by zero can produce Infinity.
- Do not mix Number and BigInt in arithmetic without an intentional conversion; converting a large BigInt to Number may lose information.

## Related topics

- Equality & explicit conversion
- Errors & cleanup

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 3: Expressions That Tell the Truth
- Lesson 6: Scope, Errors & Small Programs
- Lesson 19: The Standard Library Toolkit

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.2.3 — PDF page 78 (file page index, not printed numbering).
- §3.2.4 — PDF page 82 (file page index, not printed numbering).


---

# Strings & Unicode

Transform text without confusing code units with visible characters.

## Essential rule

String methods return new strings; length and indexes count UTF-16 code units.

Use trim, includes, startsWith, slice, and template literals for straightforward text work. Keep the returned value: calling trim() alone does not change the original string.

A Unicode character can occupy two UTF-16 code units. Iterating a string with for...of or spread handles code points, but even code points are not always complete visual characters: accents and emoji sequences can combine multiple code points.

## When to use it

- Cleaning user input before validation.
- Comparing imported names or debugging unexpected string lengths.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const raw = "  Ready  ";
const cleaned = raw.trim().toLowerCase();
console.log(cleaned);
console.log(raw.length);
console.log("😀".length);
console.log([..."😀"].length);
```

Expected output:

```text
ready
9
2
1
```

The input stays intact. The emoji occupies two code units but one code point.

## Common pitfalls

- Indexing or slicing can split a surrogate pair.
- Visually identical text may have different Unicode representations; normalize when your comparison contract requires it.
- Lowercasing is not a universal substitute for locale-aware text comparison.

## Related topics

- Regular expressions
- Equality & explicit conversion

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.3 — PDF page 86 (file page index, not printed numbering).
- §3.3.3 — PDF page 91 (file page index, not printed numbering).


---

# Equality & explicit conversion

Compare values without hiding type mismatches.

## Essential rule

Use === for routine comparisons, and convert external inputs deliberately at the boundary.

Strict equality compares without type coercion. Loose equality can convert operands, so values such as a numeric string and a number may compare equal even when a type mismatch would be useful to detect.

Equality is a choice of contract: object identity, selected property values, and deep structural equality are different questions. For an ID read from a form, decide whether its representation is a string or a number before comparing it to stored IDs.

## When to use it

- Comparing form input with a numeric value.
- Writing assertions that should detect incorrect result types.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const input = "12";
console.log(input === 12);
console.log(Number(input) === 12);
console.log(Boolean([]));
console.log({ id: 12 } === { id: 12 });
```

Expected output:

```text
false
true
true
false
```

The comparisons make type conversion and object identity visible.

## Common pitfalls

- Two distinct objects are never === merely because their contents match.
- NaN === NaN is false; use Number.isNaN. Object.is distinguishes signed zero and considers NaN equal to itself.
- Truthy does not mean equal to true; empty arrays and empty objects are truthy.

## Related topics

- Values, identity & mutation
- Defaults & optional chaining
- Numbers, NaN & precision

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 3: Expressions That Tell the Truth

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.9.1 — PDF page 110 (file page index, not printed numbering).
- §4.9.1 — PDF page 166 (file page index, not printed numbering).


---

# Scope, const, let & closures

Identify which binding a name refers to and when it becomes usable.

## Essential rule

let and const are block scoped; var is scoped to its function or script rather than a loop block.

A binding declared with let or const cannot be accessed before its declaration is initialized. This interval is called the temporal dead zone. Declaring the same name in a nested block creates a separate binding and shadows the outer one.

A for loop using let gives callbacks a distinct loop binding for each iteration. With var, callbacks share the same function-scoped binding and usually see its final value when called later.

## When to use it

- Creating callbacks inside a loop.
- Reducing accidental changes and debugging shadowed names.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const callbacks = [];
for (let index = 0; index < 3; index++) {
  callbacks.push(() => index);
}
console.log(JSON.stringify(callbacks.map(read => read())));
```

Expected output:

```text
[0,1,2]
```

Each callback closes over its own iteration binding.

## Common pitfalls

- const objects can still be mutated.
- Moving a declaration lower in a block can make earlier reads throw even if an outer variable has the same name.
- A closure retains access to bindings, not a frozen snapshot of all values.

## Related topics

- Closures & private state
- Values, identity & mutation
- Modules & explicit dependencies

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 5: Loops, Collections & Invariants
- Lesson 6: Scope, Errors & Small Programs
- Lesson 10: Closures & Higher-Order Functions
- Lesson 16: Modules & Public Interfaces

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.10 — PDF page 122 (file page index, not printed numbering).


---

# Defaults & optional chaining

Read optional data and apply defaults while preserving valid falsy values.

## Essential rule

Use ?? for null or undefined defaults; use ?. only where a missing value is an expected case.

The operators && and || short-circuit and return an operand, which is not necessarily a boolean. || chooses a fallback for all falsy values, including 0, false, and the empty string. ?? chooses its fallback only for null and undefined.

Optional chaining stops a continuous property-access chain when its guarded receiver is nullish. It does not validate the type of the data, and it does not turn an undeclared identifier into a defined one.

## When to use it

- Applying defaults to an API response or optional settings.
- Reading a nested property that may legitimately be absent.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const options = { retries: 0, user: null };
console.log(options.retries ?? 2);
console.log(options.retries || 2);
console.log(options.user?.name ?? "Guest");
```

Expected output:

```text
0
2
Guest
```

Nullish defaults preserve zero; optional chaining makes the missing user explicit.

## Common pitfalls

- A zero timeout may be deliberate; replacing it with || changes its meaning.
- Place guards at the levels that may be missing: value?.profile?.name.
- Mixing ?? directly with && or || requires parentheses.

## Related topics

- Equality & explicit conversion
- Object properties & safe updates
- Functions & parameter contracts

## Linked lessons

- Lesson 3: Expressions That Tell the Truth
- Lesson 4: Decisions & Defensive Control Flow
- Lesson 7: Objects as Models
- Lesson 11: Parameters, Context & Composition

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §4.4.1 — PDF page 141 (file page index, not printed numbering).
- §4.10 — PDF page 174 (file page index, not printed numbering).
- §4.13.2 — PDF page 188 (file page index, not printed numbering).


---

# Conditions & choosing a loop

Make decisions explicit and select the right iteration behavior.

## Essential rule

Use for...of for iterable values; use Object.entries with for...of for own enumerable string-keyed properties.

Guard clauses let a function reject invalid or irrelevant input early. For branches, if/else chooses one path; switch selects a case by strict equality and continues through later cases unless control exits.

Use a regular loop when you need break, continue, or sequential await. for...in enumerates string property names, including inherited enumerable properties, so it is usually a poor choice for processing array values.

## When to use it

- Finding the first failing check and stopping immediately.
- Processing the entries of a configuration object.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const results = [{name: "login", ok: true}, {name: "checkout", ok: false}];
let failed = "none";
for (const result of results) {
  if (result.ok) continue;
  failed = result.name;
  break;
}
console.log(failed);
```

Expected output:

```text
checkout
```

The loop skips passing checks and exits at the first failure.

## Common pitfalls

- A switch case without break or return can fall through.
- forEach has no ordinary break and does not wait for an async callback.
- An empty array is truthy; use its length to test whether it has elements.

## Related topics

- Choose map, filter, find or reduce
- Iterators and generators
- Async functions and await

## Linked lessons

- Lesson 4: Decisions & Defensive Control Flow
- Lesson 5: Loops, Collections & Invariants
- Lesson 6: Scope, Errors & Small Programs
- Lesson 21: Iterators & Generators

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §5.3 — PDF page 202 (file page index, not printed numbering).
- §5.4.4 — PDF page 215 (file page index, not printed numbering).


---

# Errors & cleanup

Expose failures clearly and put cleanup on every exit path.

## Essential rule

Throw Error objects for exceptional failures; catch where you can recover or add a useful boundary response.

An exception stops normal execution until a matching catch handles it. Use specific error types such as TypeError or RangeError to describe a violated contract. A catch that silently ignores everything can turn an obvious failure into incorrect data.

finally runs when control leaves try/catch, including on return or throw. It is the right place for synchronous resource cleanup. For rejected promises, await inside try or return a chain with catch so the error reaches the intended handler.

## When to use it

- Rejecting an unsupported input before changing state.
- Restoring a loading flag or releasing a resource after success or failure.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
let busy = true;
try {
  throw new TypeError("Expected an array");
} catch (error) {
  console.log(error.name);
} finally {
  busy = false;
}
console.log(busy);
```

Expected output:

```text
TypeError
false
```

Cleanup executes even when the main operation fails.

## Common pitfalls

- A return or throw in finally can replace the original result or error.
- A surrounding synchronous try does not catch a timer callback that throws later.
- Do not convert every failure into an empty success value; callers may need to react.

## Related topics

- Promises and error propagation
- Async functions and await
- Functions & parameter contracts

## Linked lessons

- Lesson 4: Decisions & Defensive Control Flow
- Lesson 6: Scope, Errors & Small Programs
- Lesson 9: Functions & API Contracts
- Lesson 14: Classes with Clear Invariants
- Lesson 22: Promises & Failure Semantics
- Lesson 33: HTTP Services & Trust Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §5.5.6 — PDF page 231 (file page index, not printed numbering).
- §5.5.7 — PDF page 232 (file page index, not printed numbering).


---

# Object properties & safe updates

Distinguish missing properties, inherited properties, and shared nested state.

## Essential rule

Check ownership when it matters, and copy every level you intend to change independently.

Reading a property can find an inherited value through the prototype chain. The in operator includes inherited properties. To test ownership using the book’s APIs, call Object.prototype.hasOwnProperty.call(object, key); this also works when the object has no prototype or shadows that method.

Object spread copies own enumerable properties into a new object. Later properties win. It does not clone the prototype, property descriptors, or nested objects. Use explicit nested copies for a small immutable state update.

## When to use it

- Merging defaults with explicit user settings.
- Updating one nested field while preserving earlier state for comparison.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const before = { profile: { name: "Ada", active: false } };
const after = { ...before, profile: { ...before.profile, active: true } };
console.log(before.profile.active);
console.log(after.profile.active);
console.log(Object.prototype.hasOwnProperty.call(after, "profile"));
```

Expected output:

```text
false
true
true
```

Both the outer record and the changed nested record receive new identities.

## Common pitfalls

- A property whose value is undefined can still exist.
- Object.keys and Object.entries omit inherited, non-enumerable, and symbol-keyed properties.
- Copying only the outer object leaves nested references shared.

## Related topics

- Values, identity & mutation
- Classes, prototypes & composition
- Property descriptors and object behavior

## Linked lessons

- Lesson 7: Objects as Models
- Lesson 12: Data Modeling Studio
- Lesson 13: Prototypes & the Object Model
- Lesson 26: DOM as a Render Target
- Lesson 34: Metaprogramming with Restraint

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §6.5 — PDF page 268 (file page index, not printed numbering).
- §6.10.4 — PDF page 284 (file page index, not printed numbering).


---

# Arrays, holes & mutation

Handle collection length, copies, removals, and sorting deliberately.

## Essential rule

Array length is an index boundary, not a guarantee that every position contains an element.

A hole is an absent property at an array index. Assigning a distant index, constructing new Array(n), or deleting an indexed property can create holes. Several iteration methods skip them, making sparse data easy to misunderstand.

slice and spread create shallow copies. splice changes the input array, as do sort, reverse, push, and pop. To sort while preserving the input with the book’s APIs, first copy it and then pass a numeric comparator when sorting numbers.

## When to use it

- Sorting result durations without rearranging the original results.
- Removing one item while maintaining a dense array.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const durations = [30, 4, 12];
const sorted = [...durations].sort((a, b) => a - b);
console.log(JSON.stringify(sorted));
console.log(JSON.stringify(durations));
const holes = new Array(3);
console.log(holes.length, Object.keys(holes).length);
```

Expected output:

```text
[4,12,30]
[30,4,12]
3 0
```

A copied array protects the original order. The sparse array has a length but no indexed elements.

## Common pitfalls

- delete items[index] leaves a hole and does not reduce length; splice removes and shifts.
- sort() without a comparator compares string representations.
- Array copies still refer to the same contained objects.

## Related topics

- Choose map, filter, find or reduce
- Values, identity & mutation
- Iterators and generators

## Linked lessons

- Lesson 8: Arrays as Data Pipelines
- Lesson 12: Data Modeling Studio
- Lesson 26: DOM as a Render Target

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §7.3 — PDF page 302 (file page index, not printed numbering).
- §7.4 — PDF page 303 (file page index, not printed numbering).
- §7.8.6 — PDF page 326 (file page index, not printed numbering).


---

# Choose map, filter, find or reduce

Choose a collection operation by the result you need.

## Essential rule

map transforms, filter selects, find retrieves one match, some/every answer a question, and reduce combines.

A map callback must return the new element. filter keeps elements whose predicate returns a truthy value. find stops at the first match and returns undefined if none exists. some stops on the first passing element; every stops on the first failure.

Give reduce an initial accumulator so empty input has a defined result. These methods do not automatically protect nested data: a callback that mutates an input object still changes that object. Use for...of when early exit or sequential async work is central.

## When to use it

- Extracting names from failed test results.
- Calculating a total with an explicit empty-input result.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const runs = [{name: "login", ms: 8, passed: true}, {name: "pay", ms: 12, passed: false}];
const failed = runs.filter(run => !run.passed).map(run => run.name);
const total = runs.reduce((sum, run) => sum + run.ms, 0);
console.log(JSON.stringify(failed));
console.log(total);
console.log([].every(Boolean));
```

Expected output:

```text
["pay"]
20
true
```

Each operation expresses a separate question: which failed, how long they took, and whether all empty inputs pass.

## Common pitfalls

- every on an empty array returns true; check length separately if at least one item is required.
- map(parseInt) accidentally passes the array index as the radix; wrap the call.
- map with an async callback returns promises; collect them with Promise.all when appropriate.

## Related topics

- Arrays, holes & mutation
- Functions & parameter contracts
- Running asynchronous tasks concurrently

## Linked lessons

- Lesson 5: Loops, Collections & Invariants
- Lesson 8: Arrays as Data Pipelines
- Lesson 10: Closures & Higher-Order Functions
- Lesson 12: Data Modeling Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §7.8.1 — PDF page 311 (file page index, not printed numbering).


---

# Functions & parameter contracts

Make accepted inputs, defaults, outputs, and side effects easy to see.

## Essential rule

Defaults apply to omitted or undefined arguments; they do not replace null or other falsy values.

Destructured parameter objects make named options readable. A default object allows a call with no argument, but explicitly passing null still needs handling if your contract accepts it. Rest parameters gather remaining arguments into an array.

Choose a return value and keep it consistent across branches. A function declaration can be called before its declaration is evaluated; a function expression assigned to const cannot be used before initialization. Arrow functions are convenient callbacks and inherit this from the surrounding scope.

## When to use it

- Designing a helper with optional settings.
- Separating pure calculations from logging, storage, or other effects.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function describeRun({ name = "untitled", retries = 2 } = {}) {
  return `${name}: ${retries} retries`;
}
console.log(describeRun());
console.log(describeRun({ name: "login", retries: 0 }));
```

Expected output:

```text
untitled: 2 retries
login: 0 retries
```

Defaults cover missing inputs while retaining an explicitly supplied zero.

## Common pitfalls

- Missing return produces undefined.
- Parameter defaults do not validate types or ranges.
- Mutating an object parameter also affects the caller’s object.

## Related topics

- Defaults & optional chaining
- this, methods & bind
- Closures & private state

## Linked lessons

- Lesson 9: Functions & API Contracts
- Lesson 11: Parameters, Context & Composition
- Lesson 12: Data Modeling Studio
- Lesson 15: Inheritance & Composition
- Lesson 17: Dependency Design & Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.1.3 — PDF page 344 (file page index, not printed numbering).
- §8.3.1 — PDF page 357 (file page index, not printed numbering).


---

# Closures & private state

Keep state alive without making it global.

## Essential rule

A function retains access to the lexical bindings where it was created, even after that outer call returns.

Each invocation of a factory can create separate private state. Functions returned from the same invocation share those bindings. This supports counters, configurable predicates, and small services with a controlled interface.

The retained binding is live: later changes are visible to closures that use it. This is why callbacks created in a loop need the right scope, and why an event listener can keep data reachable until it is removed.

## When to use it

- Creating independent counters or configuration-specific validators.
- Injecting dependencies into a function without global variables.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const first = makeCounter();
const second = makeCounter();
console.log(first(), first(), second());
```

Expected output:

```text
1 2 1
```

The first two calls share one binding; the second factory call creates another.

## Common pitfalls

- Capturing a variable does not freeze its value.
- Multiple returned functions can share state and affect each other.
- A long-lived callback can retain objects you no longer intended to keep.

## Related topics

- Scope, const, let & closures
- Functions & parameter contracts
- this, methods & bind

## Linked lessons

- Lesson 6: Scope, Errors & Small Programs
- Lesson 10: Closures & Higher-Order Functions
- Lesson 11: Parameters, Context & Composition
- Lesson 18: Architecture Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.6 — PDF page 376 (file page index, not printed numbering).


---

# this, methods & bind

Keep the intended receiver when passing a method as a callback.

## Essential rule

For an ordinary function, the call form determines this. Arrow functions inherit this from their enclosing context.

Calling object.method() uses object as the receiver. Saving object.method in a variable and calling it as a plain function loses that receiver. In strict mode, a plain call has undefined as this.

bind creates a new function with a fixed receiver and optional leading arguments. call and apply invoke immediately with a chosen receiver. A small arrow wrapper can also preserve access to an object by explicitly making a method call.

## When to use it

- Passing an instance method to a callback API.
- Explaining why a method works directly but fails in an event handler.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const reporter = {
  prefix: "PASS",
  format(name) { return `${this.prefix}: ${name}`; }
};
const report = reporter.format.bind(reporter);
console.log(["login", "cart"].map(report).join(" | "));
```

Expected output:

```text
PASS: login | PASS: cart
```

The bound method keeps its receiver when Array.map invokes it.

## Common pitfalls

- An arrow used as an object-literal method does not acquire that object as this.
- bind cannot replace an arrow function’s lexical this.
- Repeated bind calls create different function objects; retain the bound function if you must remove it as a listener.

## Related topics

- Closures & private state
- Classes, prototypes & composition
- Events: listeners, bubbling, and delegation

## Linked lessons

- Lesson 9: Functions & API Contracts
- Lesson 11: Parameters, Context & Composition
- Lesson 14: Classes with Clear Invariants
- Lesson 27: Events, Forms & Accessibility

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.2.2 — PDF page 350 (file page index, not printed numbering).
- §8.7.5 — PDF page 389 (file page index, not printed numbering).


---

# Classes, prototypes & composition

Group state and behavior without losing sight of prototype lookup.

## Essential rule

Class methods are shared through the prototype; constructor assignments create instance state.

Property lookup checks the instance and then its prototype chain. A class gives this pattern a clear syntax. Static methods belong to the constructor, so call them on the class rather than on an instance.

Use inheritance when a subtype can honor the parent’s contract. If you only need another object’s capability, composition lets your object hold that collaborator and delegate work to it. This avoids tying unrelated features into a rigid hierarchy.

## When to use it

- Creating several independent instances with shared behavior.
- Choosing between extending a class and injecting a collaborator.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
class RunSummary {
  constructor(name) { this.name = name; }
  label() { return `Run: ${this.name}`; }
}
const first = new RunSummary("smoke");
const second = new RunSummary("full");
console.log(first.label());
console.log(first.label === second.label);
```

Expected output:

```text
Run: smoke
true
```

The two instances store different names but resolve label to the same prototype method.

## Common pitfalls

- Methods are not automatically bound to instances.
- A derived constructor must call super before accessing this.
- Freezing an instance is shallow and does not automatically freeze nested state.

## Related topics

- Object properties & safe updates
- this, methods & bind
- Modules & explicit dependencies

## Linked lessons

- Lesson 13: Prototypes & the Object Model
- Lesson 14: Classes with Clear Invariants
- Lesson 15: Inheritance & Composition
- Lesson 18: Architecture Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §9.3 — PDF page 416 (file page index, not printed numbering).
- §9.5.3 — PDF page 437 (file page index, not printed numbering).


---

# Modules & explicit dependencies

Split code into files with small, intentional public interfaces.

## Essential rule

Export the capabilities callers need; import dependencies explicitly in the files that use them.

An ES module has its own top-level scope and runs in strict mode. Named imports match exported names; a default import uses the name chosen by the importing file. Imports refer to live exported bindings and cannot be reassigned by the importer.

Use static imports for regular dependencies and dynamic import() when code should load conditionally; dynamic import returns a promise. In browser HTML, load the entry point with type="module" and serve the files over HTTP. The project already uses ES modules.

## When to use it

- Extracting a pure helper so both UI and tests can use it.
- Loading an optional feature only when it is needed.

## Practical example

Runtime: Two separate ES module files.

```javascript
// summary.mjs
export const total = values => values.reduce((sum, value) => sum + value, 0);

// app.mjs (a separate file)
import { total } from "./summary.mjs";
console.log(total([3, 5, 8]));
```

Expected output:

```text
16
```

Save the two files side by side and run node app.mjs, or load app.mjs as a browser module.

## Common pitfalls

- Named and default imports use different syntax.
- Circular dependencies can access bindings before initialization; simplify the dependency direction.
- Browser module paths need resolvable URLs; a bare package name requires additional resolution support.

## Related topics

- Functions & parameter contracts
- Language vs. runtime
- Classes, prototypes & composition

## Linked lessons

- Lesson 16: Modules & Public Interfaces
- Lesson 17: Dependency Design & Boundaries
- Lesson 18: Architecture Studio
- Lesson 31: Node.js & Command-Line Programs
- Lesson 35: Tooling, Testing & Delivery
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §10.3 — PDF page 458 (file page index, not printed numbering).
- §10.3.1 — PDF page 460 (file page index, not printed numbering).
- §10.3.2 — PDF page 462 (file page index, not printed numbering).


---

# Maps and sets

Deduplicate values with Set and associate arbitrary keys with values using Map.

## Essential rule

Use Set for unique membership and Map for keyed lookup. Both iterate in insertion order.

Set stores each value once. Use add, has, and delete to change or query membership; size reports the count. Map stores one value per key. Calling set again with the same key updates its value. Iterating a Map produces [key, value] pairs, ready for destructuring.

Objects used as keys or members are compared by reference, so two separately created objects remain distinct even if their fields match. Primitive comparison follows SameValueZero: NaN matches itself and positive and negative zero are equivalent. Use has when a Map may legitimately store undefined, because get alone cannot distinguish that value from a missing key.

## When to use it

- Remove duplicate tags or track which record IDs have already been processed.
- Count outcomes, cache results, or associate metadata with object identities.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const outcomes = ["pass", "fail", "pass"];
const unique = new Set(outcomes);
const counts = new Map();
for (const outcome of outcomes) {
  counts.set(outcome, (counts.get(outcome) ?? 0) + 1);
}
console.log(JSON.stringify([...unique]));
console.log(JSON.stringify([...counts]));
console.log(counts.has("skipped"));
```

Expected output:

```text
["pass","fail"]
[["pass",2],["fail",1]]
false
```

The Set removes repeated outcomes while the Map counts them. Both retain the order in which each distinct key first appeared.

## Common pitfalls

- map[key] creates an ordinary object property; use map.set(key, value).
- A fresh object literal cannot retrieve an entry keyed by another object.
- Spreading a Map produces pairs, not just values; use map.values() when needed.

## Related topics

- Object properties & safe updates
- Arrays, holes & mutation
- Iterators and generators
- Equality & explicit conversion

## Linked lessons

- Lesson 19: The Standard Library Toolkit

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.1.1 — PDF page 481 (file page index, not printed numbering).
- §11.1.2 — PDF page 485 (file page index, not printed numbering).

- [ECMAScript: Set objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-objects)

---

# Regular expressions

Validate simple text shapes, extract fields, and replace repeated patterns.

## Essential rule

Choose test for a boolean, matchAll for repeated captures, and replace for a transformation.

A literal such as /QA-\d+/ describes a pattern rather than a fixed string. Character classes select possible characters; quantifiers control repetition; parentheses capture fields. Anchors constrain match positions. Flags modify behavior: i ignores case, g finds repeated matches, and u enables Unicode-aware pattern processing.

matchAll returns an iterator of match arrays. Index 0 contains the full match and subsequent indexes contain captured groups; named groups are available through groups. A regex argument to matchAll must have the g flag. For a replacement, pass a callback when the replacement needs a calculation or conditional logic.

## When to use it

- Extract consistently formatted IDs from logs or issue descriptions.
- Normalize whitespace or validate a small, clearly defined text format.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const log = "QA-42 passed; QA-73 failed";
const ids = [...log.matchAll(/QA-(\d+)/g)]
  .map(match => Number(match[1]));
console.log(JSON.stringify(ids));
const normalized = "  run   tests  ".trim().replace(/\s+/g, " ");
console.log(normalized);
console.log(/^QA-\d+$/.test("QA-42"));
```

Expected output:

```text
[42,73]
run tests
true
```

The capture extracts only each numeric ID. A separate global pattern collapses whitespace without altering the original string.

## Common pitfalls

- test and exec mutate lastIndex on g or y patterns; reuse can change later results.
- RegExp constructor strings require escaped backslashes, such as "\\d+".
- Patterns can match substrings; choose anchors deliberately when validating complete input.

## Related topics

- Values, identity & mutation
- Iterators and generators
- Arrays, holes & mutation

## Linked lessons

- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.3.1 — PDF page 504 (file page index, not printed numbering).
- §11.3.2 — PDF page 523 (file page index, not printed numbering).
- §11.3.3 — PDF page 530 (file page index, not printed numbering).


---

# Dates, timestamps, and UTC

Represent instants consistently and separate elapsed durations from calendar calculations.

## Essential rule

Use explicit time zones for instants, milliseconds for elapsed durations, and UTC output for reproducible examples.

A Date stores an instant as milliseconds relative to the Unix epoch. getTime exposes that number; toISOString formats it in UTC with a trailing Z. The local and UTC getter families interpret the same instant differently. Dates do not retain the original input time-zone name.

Subtract timestamps to measure an elapsed duration. Calendar operations are different: a month has a variable length, and a local day can cross a daylight-saving change. Date setters mutate the object and normalize overflowing fields. Clone with new Date(existing.getTime()) before changing a date that other code still needs.

## When to use it

- Record run start and finish times in logs using a portable UTC representation.
- Calculate elapsed time or compare deadlines represented as explicit instants.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const started = new Date("2026-04-08T10:00:00Z");
const finished = new Date("2026-04-08T10:01:30Z");
const seconds = (finished.getTime() - started.getTime()) / 1000;
const deadline = new Date(finished.getTime());
deadline.setUTCMinutes(deadline.getUTCMinutes() + 5);
console.log(seconds);
console.log(deadline.toISOString());
console.log(finished.toISOString());
```

Expected output:

```text
90
2026-04-08T10:06:30.000Z
2026-04-08T10:01:30.000Z
```

The elapsed duration is 90 seconds. Updating the cloned deadline leaves the original finish time unchanged.

## Common pitfalls

- Numeric constructors and Date.UTC use zero-based months: January is 0.
- getDay returns the weekday; getDate returns the day of the month.
- Ambiguous date strings can parse differently; invalid input produces an invalid Date.

## Related topics

- JSON serialization
- Defaults & optional chaining
- Tests, linting, and formatting

## Linked lessons

- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.4 — PDF page 536 (file page index, not printed numbering).
- §11.4.1 — PDF page 538 (file page index, not printed numbering).
- §11.4.2 — PDF page 539 (file page index, not printed numbering).
- §11.4.3 — PDF page 540 (file page index, not printed numbering).


---

# JSON serialization

Convert portable data to text and reconstruct it without confusing JSON with arbitrary JavaScript objects.

## Essential rule

Use JSON.stringify to encode and JSON.parse to decode; validate the decoded data before using it.

JSON represents strings, finite numbers, booleans, null, arrays, and objects with string keys. Parsing reconstructs data, not class instances or their methods. JSON syntax requires double-quoted keys and strings and excludes comments and trailing commas. A successful parse confirms valid syntax, not the shape your application expects.

A stringify replacer can select or transform values. A parse reviver can transform the resulting values, including reconstructing dates when your schema identifies a date field. Date serialization normally produces a string. Use JSON.stringify(value, null, 2) for readable output, and define explicit conversions for richer types such as Map or Set.

## When to use it

- Save application settings in storage or exchange a small API payload.
- Produce readable test fixtures with an explicit, predictable schema.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const run = { name: "smoke", passed: true, note: undefined };
const text = JSON.stringify(run);
const parsed = JSON.parse(text);
if (typeof parsed.name !== "string" || typeof parsed.passed !== "boolean") {
  throw new TypeError("Invalid run record");
}
console.log(text);
console.log(parsed.name);
console.log(Object.hasOwn(parsed, "note"));
```

Expected output:

```text
{"name":"smoke","passed":true}
smoke
false
```

Serialization omits the undefined property. After parsing, field checks enforce the expected record shape.

## Common pitfalls

- JSON round trips are not general deep cloning: dates, methods, and prototypes change.
- undefined object properties disappear; undefined array elements become null.
- Circular references and unsupported BigInt values throw during serialization.

## Related topics

- Object properties & safe updates
- Dates, timestamps, and UTC
- Fetch: check the response, then read the body
- Browser storage: persist small preferences
- Errors & cleanup

## Linked lessons

- Lesson 19: The Standard Library Toolkit
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 28: Fetch, Storage & State
- Lesson 33: HTTP Services & Trust Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.6 — PDF page 545 (file page index, not printed numbering).
- §11.6.1 — PDF page 548 (file page index, not printed numbering).

Edition note: Object.hasOwn is newer than the 2020 edition; it is supported by the modern browser and Node baseline used here.

- [MDN: Object.hasOwn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

---

# Iterators and generators

Produce and consume values one at a time with the protocol behind for…of and spread.

## Essential rule

An iterable supplies Symbol.iterator; its iterator supplies next(), returning { value, done }.

Arrays, strings, Maps, and Sets implement the iterable protocol. for…of asks for an iterator and repeatedly calls next until done is true. An iterator tracks progress, so consuming it changes what remains. A collection can create a fresh iterator for every traversal.

A function* generator makes this protocol easier to implement. Calling it creates a generator without running its body. Each next resumes execution until yield provides a value or the function finishes. yield* delegates to another iterable. This lets you generate values on demand without allocating the entire sequence first.

## When to use it

- Traverse a custom collection using the same syntax as an array.
- Generate test inputs or process a sequence without building all intermediate arrays.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function* caseNames(prefix, count) {
  for (let number = 1; number <= count; number++) {
    yield `${prefix}-${number}`;
  }
}
const cases = caseNames("login", 3);
console.log(cases.next().value);
console.log(JSON.stringify([...cases]));
console.log(cases.next().done);
```

Expected output:

```text
login-1
["login-2","login-3"]
true
```

The first next consumes one name. Spread consumes only the remaining names, and the final call reports completion.

## Common pitfalls

- An exhausted generator stays exhausted; call the generator function again to restart.
- Spreading an infinite iterable never completes; stop after a bounded number of items.
- for…in enumerates property names and does not use the iterator protocol.

## Related topics

- Arrays, holes & mutation
- Maps and sets
- Functions & parameter contracts
- Conditions & choosing a loop

## Linked lessons

- Lesson 21: Iterators & Generators
- Lesson 23: Async Workflows & Concurrency
- Lesson 32: Files, Streams & Backpressure

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §12.1 — PDF page 580 (file page index, not printed numbering).
- §12.2 — PDF page 582 (file page index, not printed numbering).
- §12.3 — PDF page 588 (file page index, not printed numbering).
- §12.3.2 — PDF page 593 (file page index, not printed numbering).


---

# Promises and error propagation

Compose one eventual result through transformations, failures, and cleanup.

## Essential rule

Return each asynchronous step from then so its result and failure remain part of the chain.

A Promise is pending until it fulfills with a value or rejects with a reason. Once settled, that outcome cannot change. then returns a new Promise: a returned value fulfills it, a thrown error rejects it, and a returned Promise makes it adopt that Promise's outcome.

Promise handlers run asynchronously even if the Promise is already settled. The executor passed to new Promise runs synchronously, so a Promise does not postpone work automatically. catch handles a rejection and can recover by returning a value. finally performs cleanup for either outcome; throwing there or returning a rejected Promise replaces the previous outcome.

## When to use it

- Connect dependent asynchronous steps while keeping one error-handling path.
- Adapt a callback API into a single completion result.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const score = await Promise.resolve(3)
  .then(count => count * 2)
  .then(value => {
    if (value < 10) throw new Error("Below target");
    return value;
  })
  .catch(error => {
    console.log(error.message);
    return 0;
  })
  .finally(() => console.log("Finished"));
console.log(score);
```

Expected output:

```text
Below target
Finished
0
```

The thrown error skips normal fulfillment handling. catch recovers with 0, while finally runs without changing that result.

## Common pitfalls

- A block-bodied then callback needs return to pass its Promise onward.
- A catch that only logs usually turns the chain into a fulfilled undefined result.
- One Promise represents one outcome, so it cannot model a continuing stream of events.

## Related topics

- Async functions and await
- Running asynchronous tasks concurrently
- Errors & cleanup
- Fetch: check the response, then read the body

## Linked lessons

- Lesson 22: Promises & Failure Semantics

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.2.1 — PDF page 613 (file page index, not printed numbering).
- §13.2.2 — PDF page 617 (file page index, not printed numbering).
- §13.2.3 — PDF page 622 (file page index, not printed numbering).
- §13.2.4 — PDF page 626 (file page index, not printed numbering).
- §13.2.6 — PDF page 636 (file page index, not printed numbering).


---

# Async functions and await

Write asynchronous control flow with familiar returns, loops, and try/catch.

## Essential rule

An async function always returns a Promise. await suspends that function until a value is available.

An async function begins running immediately and continues until its first await or completion. Awaiting a fulfilled Promise yields its value; awaiting a rejected Promise throws its reason at that expression. Other work can continue while the function is suspended. await also accepts plain values and resumes asynchronously.

Use try/catch around awaited operations to handle their failures and finally for cleanup. Await belongs inside an async function or at the top level of an ES module. Sequential awaits are appropriate when later work depends on earlier results. For independent operations, call them before waiting and combine their Promises with Promise.all.

## When to use it

- Express a sequence such as load, validate, transform, then save.
- Use ordinary loops and exception handling around asynchronous operations.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
async function runCheck() {
  console.log("started");
  const result = await Promise.resolve("passed");
  console.log(result);
  return result.toUpperCase();
}
const pending = runCheck();
console.log("caller continues");
console.log(await pending);
```

Expected output:

```text
started
caller continues
passed
PASSED
```

Execution starts at the call. await yields control to the caller, and the final returned string fulfills the function's Promise.

## Common pitfalls

- Calling an async function gives you a Promise, even when it returns a plain number.
- Array.forEach does not await async callbacks; choose a loop or Promise.all with map.
- try/catch cannot catch a later rejection from an unawaited, unreturned Promise.

## Related topics

- Promises and error propagation
- Running asynchronous tasks concurrently
- Errors & cleanup
- Modules & explicit dependencies

## Linked lessons

- Lesson 23: Async Workflows & Concurrency
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 25: The Browser Execution Model

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.3.1 — PDF page 647 (file page index, not printed numbering).
- §13.3.2 — PDF page 648 (file page index, not printed numbering).
- §13.3.3 — PDF page 649 (file page index, not printed numbering).


---

# Running asynchronous tasks concurrently

Choose whether a group of independent operations needs every value, every outcome, or the first outcome.

## Essential rule

Calling the task starts its work; Promise combinators observe the resulting Promises and combine their outcomes.

Promise.all fulfills with values in input order when every input fulfills, or rejects when an input rejects. Promise.allSettled waits for every input and returns ordered status records with value or reason. Use it when successful and failed outcomes both belong in the report.

Promise.race adopts the first settlement, whether fulfillment or rejection. It does not mean first success. Neither race nor all cancels other operations after settling. Cancellation must be supported by the underlying operation, such as an abortable fetch. To limit concurrency, control when tasks are called; combining already-started Promises does not impose a limit.

## When to use it

- Load independent resources together and require all results before proceeding.
- Run several checks and produce a report even when some checks fail.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
async function check(name) {
  if (name === "search") throw new Error("No results");
  return `${name}: passed`;
}
const pending = ["login", "search"].map(check);
const results = await Promise.allSettled(pending);
console.log(JSON.stringify(results.map(result => result.status)));
console.log(results[0].value);
console.log(results[1].reason.message);
```

Expected output:

```text
["fulfilled","rejected"]
login: passed
No results
```

map calls both checks before the await. allSettled preserves both outcomes in the same order as the input checks.

## Common pitfalls

- A timeout implemented with race does not itself stop the operation that loses.
- Sequential await calls delay starting later tasks when calls appear after each await.
- race([]) remains pending; all([]) and allSettled([]) fulfill with empty arrays.

## Related topics

- Promises and error propagation
- Async functions and await
- Fetch: check the response, then read the body
- Choose map, filter, find or reduce

## Linked lessons

- Lesson 22: Promises & Failure Semantics
- Lesson 23: Async Workflows & Concurrency
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 29: Browser APIs & Responsive Work

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.2.5 — PDF page 634 (file page index, not printed numbering).
- §13.3.3 — PDF page 649 (file page index, not printed numbering).

- [MDN: Promise.all, ordering and rejection behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

---

# Property descriptors and object behavior

Inspect property rules, constrain object mutation, and understand where Proxy and Reflect fit.

## Essential rule

A property descriptor controls whether a property can change, appear in enumeration, or be reconfigured.

Data descriptors combine value with writable, enumerable, and configurable flags. Accessor descriptors use get and set instead of value and writable. Object.getOwnPropertyDescriptor inspects an own property; Object.defineProperty creates or changes one. When defining a new property, omitted flags default to false.

Object.preventExtensions blocks new own properties; seal additionally prevents deletion and reconfiguration; freeze also makes own data properties non-writable. These operations are shallow. Proxy intercepts operations such as reads and writes through handler methods. Reflect provides corresponding operations and is useful for forwarding behavior from a Proxy handler to its target.

## When to use it

- Expose a stable read-only field while keeping other record properties editable.
- Inspect an unfamiliar object's behavior or implement focused library instrumentation.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const run = { status: "pending" };
Object.defineProperty(run, "id", {
  value: "run-17",
  enumerable: true,
  writable: false,
  configurable: false
});
console.log(Reflect.set(run, "id", "run-18"));
console.log(run.id);
console.log(Reflect.set(run, "status", "passed"));
console.log(run.status);
```

Expected output:

```text
false
run-17
true
passed
```

Reflect.set reports that the read-only ID cannot change. The ordinary status property remains writable.

## Common pitfalls

- A non-enumerable field is still readable; hiding it from Object.keys is not privacy.
- Freezing an object does not recursively freeze nested objects.
- Proxy traps must respect object invariants; interception is not unrestricted rewriting.

## Related topics

- Object properties & safe updates
- Classes, prototypes & composition
- Iterators and generators

## Linked lessons

- Lesson 13: Prototypes & the Object Model
- Lesson 34: Metaprogramming with Restraint

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §14.1 — PDF page 665 (file page index, not printed numbering).
- §14.2 — PDF page 673 (file page index, not printed numbering).
- §14.6 — PDF page 695 (file page index, not printed numbering).
- §14.7 — PDF page 699 (file page index, not printed numbering).


---

# DOM: find, create, and update elements

Turn data into document elements with selectors, text content, and explicit node operations.

## Essential rule

Select the element you need, check that it exists, and use textContent when inserting plain text.

querySelector returns the first match or null. querySelectorAll returns a static NodeList: it is iterable, but it is not an Array and does not gain newly added matches. Use Array.from when you need array methods. Scope queries to a component root to avoid selecting unrelated page elements.

createElement makes a detached node. Set its content and attributes, then insert it with append, prepend, before, or after. Inserting an existing node moves it instead of copying it. textContent preserves text literally; innerHTML parses markup and replaces the existing child tree.

## When to use it

- Render lists, messages, or validation results from application data.
- Update one component without rebuilding the entire document.

## Practical example

Runtime: Browser console on the project page.

```javascript
const list = document.createElement("ul");
for (const title of ["Review <script>", "Ship fix"]) {
  const item = document.createElement("li");
  item.textContent = title;
  list.append(item);
}
console.log(list.querySelectorAll("li").length);
console.log(list.firstElementChild.textContent);
console.log(list.querySelector("script") === null);
```

Expected output:

```text
2
Review <script>
true
```

The list stays detached, so this changes no visible page. The angle brackets remain text; no script element is created. Append the list to a chosen container when rendering a real interface.

## Common pitfalls

- Dereferencing a missing selector result throws; handle null.
- Untrusted strings in innerHTML can inject executable markup.
- Replacing children destroys their identity and their directly attached listeners.

## Related topics

- Events: listeners, bubbling, and delegation
- Arrays, holes & mutation
- Choose map, filter, find or reduce

## Linked lessons

- Lesson 26: DOM as a Render Target
- Lesson 27: Events, Forms & Accessibility
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.3.1 — PDF page 761 (file page index, not printed numbering).
- §15.3.4 — PDF page 776 (file page index, not printed numbering).
- §15.3.5 — PDF page 779 (file page index, not printed numbering).


---

# Events: listeners, bubbling, and delegation

Connect user actions to behavior and handle a whole group of controls through a shared parent.

## Essential rule

Use addEventListener; distinguish the original event target from the element whose listener is running.

An event travels through a capture phase toward its target and, for bubbling events, back through its ancestors. event.target identifies the original target; event.currentTarget identifies the element handling this invocation. A parent listener can use closest to find the relevant control, including when a nested icon was clicked.

preventDefault cancels a cancelable default action, such as form submission. stopPropagation stops further travel through the tree; it does not cancel that default action. Keep a reference to a handler if you will remove it later, or use once for a single invocation.

## When to use it

- Handle rows or buttons that are added after initial rendering.
- Keep form submission and navigation behavior under explicit control.

## Practical example

Runtime: Browser console on the project page.

```javascript
const panel = document.createElement("div");
const button = document.createElement("button");
button.type = "button";
button.dataset.action = "save";
panel.append(button);
panel.addEventListener("click", (event) => {
  const control = event.target.closest("button[data-action]");
  if (!control || !panel.contains(control)) return;
  console.log(control.dataset.action);
  console.log(event.currentTarget === panel);
});
button.click();
```

Expected output:

```text
save
true
```

The detached button dispatches a click that bubbles to its detached parent. One parent listener handles the action without attaching a handler to each button.

## Common pitfalls

- Returning false from an addEventListener callback does not cancel anything.
- Passive listeners cannot use preventDefault to cancel the event.
- A fresh anonymous function is not the same callback when removing a listener.

## Related topics

- DOM: find, create, and update elements
- Functions & parameter contracts
- this, methods & bind

## Linked lessons

- Lesson 25: The Browser Execution Model
- Lesson 27: Events, Forms & Accessibility
- Lesson 29: Browser APIs & Responsive Work
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.2.2 — PDF page 747 (file page index, not printed numbering).
- §15.2.3 — PDF page 753 (file page index, not printed numbering).
- §15.2.4 — PDF page 756 (file page index, not printed numbering).
- §15.2.5 — PDF page 758 (file page index, not printed numbering).


---

# Fetch: check the response, then read the body

Treat an HTTP request, its status, and its parsed response body as separate steps.

## Essential rule

Await fetch, check response.ok, then await the body reader. Handle failures from all three steps.

fetch resolves once status and headers are available. A 404 or 500 response still fulfills the promise, so your code must turn an unsuccessful status into an application error. Reading JSON is another asynchronous operation and can fail independently, for example when a server returns HTML.

Request options configure method, headers, body, and an AbortSignal. For JSON writes, stringify the payload and set Content-Type to application/json. Use URLSearchParams for query values. Aborting a request can reject the fetch or its unfinished body read; clean up any timeout you created.

## When to use it

- Load remote data into a screen or submit an API request.
- Separate networking from parsing so tests can supply controlled responses.

## Practical example

Runtime: Browser console on the project page.

```javascript
async function readJSON(url, request = fetch) {
  const response = await request(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
// Offline mock: no network request is made.
const mockFetch = async () => new Response(
  JSON.stringify({ pending: 3 }),
  { status: 200, headers: { "Content-Type": "application/json" } }
);
await readJSON("/api/tasks", mockFetch)
  .then((data) => console.log(data.pending))
  .catch(console.error);
```

Expected output:

```text
3
```

The injected request function returns a real Response with a fixed body. Omitting mockFetch uses the browser fetch function against your own API.

## Common pitfalls

- HTTP errors do not automatically enter catch.
- A response body is normally consumed once; clone it before reading twice.
- Cross-origin access needs server CORS permission; mode: no-cors does not unlock readable responses.

## Related topics

- Async functions and await
- Promises and error propagation
- Errors & cleanup
- Tests, linting, and formatting

## Linked lessons

- Lesson 28: Fetch, Storage & State
- Lesson 30: Browser Application Studio
- Lesson 33: HTTP Services & Trust Boundaries
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.11.1 — PDF page 897 (file page index, not printed numbering).


---

# Browser storage: persist small preferences

Choose storage by lifetime and data size, and treat persisted data as fallible input.

## Essential rule

Use Web Storage for small string values; serialize objects explicitly and recover from unavailable or invalid data.

localStorage belongs to an origin and normally survives page reloads and browser restarts. sessionStorage also belongs to a particular top-level tab session. Neither is a guaranteed backup. getItem returns a string or null; setItem and removeItem change one key. Namespace application keys to prevent collisions.

Use JSON.stringify and JSON.parse for simple data, then validate the parsed shape before using it. Web Storage operations are synchronous. IndexedDB is the more suitable asynchronous object-store API for larger collections and indexed lookups. A storage event reports changes to other eligible documents, not the document that made the change.

## When to use it

- Remember a theme, dismissed hint, or small draft.
- Restore lightweight interface state after a page reload.

## Practical example

Runtime: Browser console on the project page.

```javascript
const key = "fieldwork:wiki-storage-demo";
const previous = localStorage.getItem(key);
try {
  localStorage.setItem(key, JSON.stringify({ theme: "dark" }));
  const preferences = JSON.parse(localStorage.getItem(key));
  console.log(preferences.theme);
} finally {
  if (previous === null) localStorage.removeItem(key);
  else localStorage.setItem(key, previous);
}
```

Expected output:

```text
dark
```

Run on a project page where storage is available. The demo restores the original value afterward; production preferences would remain stored and need parsing and validation safeguards.

## Common pitfalls

- Blocked storage, quotas, and invalid JSON can throw; provide defaults.
- Do not put passwords or other secrets in script-accessible storage.
- clear removes every key for that storage area; remove your own key instead.

## Related topics

- JSON serialization
- Object properties & safe updates
- Events: listeners, bubbling, and delegation
- Errors & cleanup

## Linked lessons

- Lesson 28: Fetch, Storage & State
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.12.1 — PDF page 927 (file page index, not printed numbering).
- §15.12.3 — PDF page 938 (file page index, not printed numbering).

- [MDN: Storage.removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem)

---

# Workers: move CPU work off the interface thread

Keep the interface responsive while a separate worker performs an expensive calculation.

## Essential rule

Send data to a worker, compute there, and send results back; update the DOM on the main thread.

A dedicated worker has its own global scope and event loop. It can run CPU work while the main thread processes input, but it cannot access document or window. postMessage sends data asynchronously, and a message listener receives it through event.data. Use request IDs when multiple jobs may be in flight.

Messages use structured cloning rather than shared ordinary objects. Functions and DOM nodes cannot be cloned. A transferable ArrayBuffer can move ownership instead of copying bytes; the sender loses access to that buffer. Reuse workers for repeated jobs and terminate them when their work is finished.

## When to use it

- Parse large datasets, process pixels, or run expensive calculations.
- Keep typing and interaction responsive during repeated computation.

## Practical example

Runtime: Browser console on the project page.

```javascript
const source = `
  self.onmessage = ({ data }) => {
    self.postMessage(data.reduce((sum, n) => sum + n, 0));
  };
`;
const url = URL.createObjectURL(
  new Blob([source], { type: "text/javascript" })
);
const worker = new Worker(url);
const cleanup = () => {
  worker.terminate();
  URL.revokeObjectURL(url);
};
worker.onmessage = ({ data }) => {
  console.log(data);
  cleanup();
};
worker.onerror = () => { cleanup(); console.error("Worker failed"); };
worker.postMessage([2, 4, 6]);
```

Expected output:

```text
12
```

The tiny calculation illustrates messaging, not a speed improvement. This self-contained demo needs a page that permits blob workers; a real project can use a separate worker script.

## Common pitfalls

- Wrapping CPU work in a promise does not move it off the main thread.
- Copying a huge message has a cost; worker overhead can outweigh small jobs.
- Worker script loading follows origin and Content Security Policy restrictions.

## Related topics

- Events: listeners, bubbling, and delegation
- Choose map, filter, find or reduce
- Promises and error propagation
- Running asynchronous tasks concurrently

## Linked lessons

- Lesson 29: Browser APIs & Responsive Work

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.13 — PDF page 946 (file page index, not printed numbering).
- §15.13.1 — PDF page 948 (file page index, not printed numbering).
- §15.13.2 — PDF page 949 (file page index, not printed numbering).
- §15.13.5 — PDF page 954 (file page index, not printed numbering).


---

# Node files: await I/O and resolve paths deliberately

Read small files with promise APIs, choose the right path base, and close resources you open.

## Essential rule

Use node:fs/promises for asynchronous file operations; specify an encoding when you want text.

readFile without an encoding returns a Buffer of bytes. With utf8 it returns a decoded string. The operation may reject for missing files, permissions, or other I/O errors; handle the actual operation rather than checking existence first and assuming nothing can change.

Relative string paths resolve from process.cwd(), which can differ from the script directory. In an ES module, new URL("./file.json", import.meta.url) locates a sibling file. readFile manages its own handle. If you open a FileHandle yourself, close it in finally after all awaited work finishes.

## When to use it

- Load a small JSON configuration or text fixture in a Node script.
- Build scripts that must find their assets regardless of the launch directory.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
// Save as inspect-file.mjs and run: node inspect-file.mjs
import { readFile } from "node:fs/promises";

const sourceFile = new URL(import.meta.url);
const sourceText = await readFile(sourceFile, "utf8");
console.log(typeof sourceText);
console.log(sourceText.includes("node:fs/promises"));
```

Expected output:

```text
string
true
```

This Node 20 ES module reads its own saved source without changing any files. Its location comes from import.meta.url, so the current working directory does not affect the read.

## Common pitfalls

- Sync filesystem calls block the event loop while they run.
- readFile loads the whole file into memory; stream large inputs.
- path.normalize cleans up path syntax; it does not resolve filesystem symlinks.

## Related topics

- Async functions and await
- Errors & cleanup
- Modules & explicit dependencies
- Node streams: process chunks with backpressure

## Linked lessons

- Lesson 31: Node.js & Command-Line Programs
- Lesson 32: Files, Streams & Backpressure

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §16.7 — PDF page 1038 (file page index, not printed numbering).
- §16.7.1 — PDF page 1039 (file page index, not printed numbering).
- §16.7.2 — PDF page 1042 (file page index, not printed numbering).

- [Node 20: File system APIs](https://nodejs.org/docs/latest-v20.x/api/fs.html)

---

# Node streams: process chunks with backpressure

Process large or ongoing inputs incrementally instead of buffering the entire dataset.

## Essential rule

Let a pipeline coordinate flow and errors; when writing manually, respect the writable stream’s backpressure.

Readable streams produce chunks; writable streams consume them. Duplex streams do both, and transform streams turn incoming data into outgoing data. Byte streams usually deliver Buffers; decoded streams deliver strings. Chunk boundaries are arbitrary and do not necessarily match lines, characters, or application records.

When write returns false, pause further writes until drain or failure. This prevents a fast producer from filling memory behind a slow consumer. For this project’s Node 20 runtime, await pipeline from node:stream/promises to coordinate backpressure and failures. Use for await for sequential consumption that needs custom per-chunk logic.

## When to use it

- Copy, compress, or transform large files with bounded buffering.
- Consume logs or network responses as data arrives.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

let totalBytes = 0;
const sink = new Writable({
  write(chunk, encoding, done) {
    totalBytes += chunk.length;
    done();
  },
});
await pipeline(
  Readable.from([Buffer.from("QA"), Buffer.from(" ready")]),
  sink
);
console.log(totalBytes);
```

Expected output:

```text
8
```

The in-memory source sends two chunks to a writable destination. Counting bytes avoids retaining the input, and the awaited pipeline finishes only after the destination completes.

## Common pitfalls

- A stream stops being memory efficient if you collect every chunk.
- Plain pipe does not provide pipeline’s complete error coordination.
- Splitting each chunk on newline loses records spanning two chunks.

## Related topics

- Node files: await I/O and resolve paths deliberately
- Iterators and generators
- Async functions and await
- Errors & cleanup

## Linked lessons

- Lesson 32: Files, Streams & Backpressure
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §16.5 — PDF page 1016 (file page index, not printed numbering).
- §16.5.1 — PDF page 1020 (file page index, not printed numbering).
- §16.5.2 — PDF page 1024 (file page index, not printed numbering).
- §16.5.3 — PDF page 1026 (file page index, not printed numbering).

Edition note: The book demonstrates callback-era stream APIs. This example uses the promise-based pipeline available in the project’s Node 20+ baseline.

- [Node: stream.pipeline](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback)

---

# Tests, linting, and formatting

Use behavior checks, static checks, and formatting for the different problems each can detect.

## Essential rule

Assert observable behavior with representative inputs, boundaries, and failures; keep external dependencies controllable.

A unit test supplies inputs and compares the result with an independently chosen expectation. For asynchronous code, return or await the work so failures reach the test. Inject a small fake dependency when networking, clocks, or files would make the test nondeterministic. Add integration coverage where the real boundary matters.

The book uses Jest to demonstrate assertions and mocks. The example below uses Node 20’s built-in assertion module, requiring no package install. ESLint checks configured code rules; Prettier formats source. Keep project tools and scripts in package.json so contributors run consistent checks.

## When to use it

- Protect a meaningful behavior before refactoring it.
- Reproduce a bug with a small deterministic case.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
import assert from "node:assert/strict";

async function cartTotal(loadItems) {
  const items = await loadItems();
  return items.reduce((sum, item) => sum + item.priceCents, 0);
}
assert.equal(await cartTotal(async () => [
  { priceCents: 250 }, { priceCents: 500 },
]), 750);
assert.equal(await cartTotal(async () => []), 0);
await assert.rejects(
  () => cartTotal(async () => { throw new Error("offline"); }),
  /offline/
);
console.log("3 checks passed");
```

Expected output:

```text
3 checks passed
```

Save as an .mjs file and run with Node 20. The checks cover a normal total, an empty cart, and propagation of a dependency failure, without a network request.

## Common pitfalls

- Coverage measures execution, not whether your assertions prove the right behavior.
- A mock can hide a broken real integration; test that boundary separately.
- Passing lint and formatting checks says nothing about business correctness.

## Related topics

- Functions & parameter contracts
- Async functions and await
- Errors & cleanup
- Fetch: check the response, then read the body

## Linked lessons

- Lesson 17: Dependency Design & Boundaries
- Lesson 33: HTTP Services & Trust Boundaries
- Lesson 35: Tooling, Testing & Delivery
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §17.1 — PDF page 1094 (file page index, not printed numbering).
- §17.2 — PDF page 1096 (file page index, not printed numbering).
- §17.3 — PDF page 1098 (file page index, not printed numbering).
- §17.4 — PDF page 1102 (file page index, not printed numbering).

Edition note: The book teaches testing with Jest. This dependency-free example applies the same testing principles with Node assertions.


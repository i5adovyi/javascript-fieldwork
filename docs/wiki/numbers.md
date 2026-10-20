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

- [Equality & explicit conversion](equality-coercion.md)
- [Errors & cleanup](errors.md)

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 3: Expressions That Tell the Truth
- Lesson 6: Scope, Errors & Small Programs
- Lesson 19: The Standard Library Toolkit

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.2.3 — PDF page 78 (file page index, not printed numbering).
- §3.2.4 — PDF page 82 (file page index, not printed numbering).


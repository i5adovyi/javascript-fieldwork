# Approach notes · Dispatch

Start with a table, not branches. The fixture intentionally includes values around 24 hours, a critical request, premium requests, and an invalid negative age. You choose the business policy. Record the expected queue and response target for each valid row before implementing it.

1. Decide what happens when multiple rules match. Write precedence explicitly.
2. Implement `validateRequest`. Reuse `isValidAgeHours`; validate severity, tier, and the boolean flag independently. Do not coerce strings silently.
3. Implement one rule at a time and write an explanatory result. Keep inputs unchanged.
4. Enable the acceptance cases with expectations taken from your own decision table. Add zero, missing fields, unsupported values, and exact thresholds.

Do not use the implementation itself to calculate expected test values. Write those independently. A caller should understand the selected rule from the returned explanation. If your policy changes, update the decision table first and then the implementation and tests.

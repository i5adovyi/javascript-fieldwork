# Maintainer guide

## Content contracts

`curriculum.json` owns stage metadata and lessons. Lesson ids are stable `lesson-01` through `lesson-36`. Preserve IDs when editing: progress uses them as keys. Each lesson has three explanatory sections, objectives, quizzes, three written assignments, pitfalls, and recap.

`labs.json` owns 48 executable challenges. Each starter and solution defines a function or class in the same lexical scope as its tests. Tests run in separate async closures, so test-local declarations cannot collide. Available assertions are `assert(condition, message)` and `assertEqual(actual, expected)`. The latter compares plain structures recursively with cycle handling and has Date, Map, and Set support. Its Set/Map key semantics use identity. It is not a general-purpose testing library.

`library.json` owns linked resources, original articles, and project briefs. HTML is not accepted in content fields. Rendering escapes all text. Resource URLs should be HTTPS and reviewed before merging.

## Add a lab

Write a precise contract covering argument types, mutation, return shape, errors, and ordering. Add normal, boundary, and failure assertions. Include three hints with progressively greater help. Reference solutions must pass both the standalone validator and the actual runner validator. Keep automated labs platform-independent; browser DOM and Node IO belong in downloadable projects.

## Accessibility and interaction

Keep semantic links for navigation, buttons for actions, labels for inputs, and visible focus indicators. Do not remove Escape-to-close behavior from native dialogs. Use reduced-motion styles for motion effects. Inspect the page at desktop and phone widths after layout changes. The editor uses Tab to insert two spaces; Shift+Tab leaves the editor for keyboard navigation. Ctrl/Command+Enter runs tests; Ctrl/Command+K opens search.

## Persistence

The localStorage key is `fieldwork.progress.v1`. Keep versioned backups compatible. Import validates data types, bounds quiz indexes, filters lesson/lab IDs, and excludes prototype keys. Never silently discard an imported backup because a future version differs: tell the user to keep their file.

## Offline and updates

The service worker uses network-first responses with cached fallback. Update its cache name when changing the app shell or content substantially. The first successful visit needs every precached file available. External resources are never cached by the app. Private host access may affect offline behavior in a browser-specific way; verify it in the target deployment if offline access is business-critical.

## Deployment

The application is static and can be copied to any HTTPS host. Sites deployment uses the tracked identity in `.openai/hosting.json`, source synchronization, and a verified deployment archive. Never put source credentials, private books, learner backups, or secrets in `dist/` or Git.

## Commercialization boundary

The UI and original content provide a foundation. Commercial claims need evidence; project completion is not accredited certification. Source solutions are deliberately inspectable. For multi-user use, design authenticated persistence, authorization, privacy/deletion flows, billing, backups, monitoring, and editorial review explicitly. Do not treat browser storage as a customer database.

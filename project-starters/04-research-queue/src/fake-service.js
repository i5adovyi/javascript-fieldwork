import { setTimeout as delay } from "node:timers/promises";

// Predictable local service: no network, secrets, or randomness.
export async function fakeLookup(topic, { signal } = {}) {
  const delayMs = topic === "language" ? 20 : 5;
  await delay(delayMs, undefined, { signal });
  if (topic === "missing") throw new Error("Synthetic service failure: missing");
  if (topic === "malformed") return { unexpected: true };
  return { id: topic, title: `Research: ${topic}`, tags: ["javascript"] };
}

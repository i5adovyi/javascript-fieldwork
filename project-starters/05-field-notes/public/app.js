import { validateWebUrl } from "./domain.js";
const list = document.querySelector("#notes");
const feedback = document.querySelector("#feedback");
function renderSample(note) {
  const article = document.createElement("article");
  const heading = document.createElement("h3"); heading.textContent = note.title;
  const body = document.createElement("p"); body.textContent = note.body;
  const tags = document.createElement("small"); tags.textContent = note.tags.join(" · ");
  article.append(heading, body, tags); list.append(article);
}
try {
  const response = await fetch("seed.json");
  if (!response.ok) throw new Error("Unable to load bundled sample notes");
  const data = await response.json(); data.notes.forEach(renderSample);
} catch (error) { feedback.textContent = error.message; }
document.querySelector("#note-form").addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  try {
    const url = String(fields.get("url") || "").trim();
    if (url) validateWebUrl(url);
    feedback.textContent = "URL check passed. Nothing has been saved: connect this form to TODO FN1 and FN4 next.";
  } catch (error) { feedback.textContent = error.message; }
});
// TODO FN5: Render application state, support CRUD, and keep focus useful after changes.
// TODO FN6: Add search, filters, export/import, and visible storage-failure recovery.

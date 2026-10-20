const status = document.querySelector("#health");
async function checkHealth() {
  status.textContent = "Checking local API…";
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error(`Health check failed (${response.status})`);
    const data = await response.json();
    status.textContent = data.ok ? "Local API is reachable. Incident features are not implemented yet." : "The service did not report a healthy state.";
  } catch (error) { status.textContent = error.message; }
}
document.querySelector("#refresh").addEventListener("click", checkHealth);
await checkHealth();
// TODO SD6: Add incident creation, list/filter, transitions, and a summary using the API contract.

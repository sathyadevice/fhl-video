/**
 * Lists all model deployments on your Azure OpenAI resource.
 * Run: node scripts/list-deployments.mjs
 */

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY  = process.env.AZURE_OPENAI_API_KEY;

if (!ENDPOINT || !API_KEY) {
  console.error("Set $env:AZURE_OPENAI_ENDPOINT and $env:AZURE_OPENAI_API_KEY first.");
  process.exit(1);
}

const url = `${ENDPOINT.replace(/\/$/, "")}/openai/deployments?api-version=2024-02-01`;

const res = await fetch(url, {
  headers: { "api-key": API_KEY },
});

if (!res.ok) {
  console.error(`Error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();

console.log("\nAvailable deployments:\n");
for (const d of data.data ?? []) {
  console.log(`  name: "${d.id}"   model: ${d.model}`);
}
console.log();

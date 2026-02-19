/**
 * Verifies your Azure OpenAI endpoint is reachable and lists deployments.
 * Run: node scripts/check-connection.mjs
 */

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
const API_KEY  = process.env.AZURE_OPENAI_API_KEY;

if (!ENDPOINT || !API_KEY) {
  console.error("Set $env:AZURE_OPENAI_ENDPOINT and $env:AZURE_OPENAI_API_KEY first.");
  process.exit(1);
}

console.log(`\n🔌  Connecting to: ${ENDPOINT}\n`);

// Try multiple API versions — Azure regions don't all support the same versions
const VERSIONS = ["2024-06-01", "2024-05-01-preview", "2024-02-15-preview", "2023-12-01-preview"];

for (const version of VERSIONS) {
  const url = `${ENDPOINT}/openai/deployments?api-version=${version}`;
  process.stdout.write(`   Trying api-version=${version} ... `);

  try {
    const res = await fetch(url, { headers: { "api-key": API_KEY } });
    const body = await res.json();

    if (res.ok) {
      console.log(`✅  Connected!\n`);
      console.log(`   Deployments found:\n`);

      const deployments = body.data ?? [];
      if (deployments.length === 0) {
        console.log("   (none — deploy a model in ai.azure.com first)");
      } else {
        for (const d of deployments) {
          console.log(`   • name: "${d.id}"   model: ${d.model}   status: ${d.status}`);
        }
      }
      console.log(`\n   Use api-version="${version}" in your scripts.\n`);
      process.exit(0);
    } else {
      console.log(`❌  ${res.status} — ${body?.error?.message ?? JSON.stringify(body)}`);
    }
  } catch (e) {
    console.log(`❌  Network error — ${e.message}`);
  }
}

console.log("\n❌  Could not connect on any API version.");
console.log("   Check your AZURE_OPENAI_ENDPOINT — it should look like:");
console.log("   https://YOUR-RESOURCE-NAME.openai.azure.com\n");

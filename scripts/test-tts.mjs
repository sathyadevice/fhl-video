/**
 * Diagnostic: tests Azure OpenAI TTS directly with raw fetch.
 * Run: node scripts/test-tts.mjs
 */

const ENDPOINT   = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
const API_KEY    = process.env.AZURE_OPENAI_API_KEY;
const DEPLOYMENT = process.env.AZURE_TTS_DEPLOYMENT ?? "tts-hd";

if (!ENDPOINT || !API_KEY) {
  console.error("Set $env:AZURE_OPENAI_ENDPOINT and $env:AZURE_OPENAI_API_KEY first.");
  process.exit(1);
}

// Azure OpenAI TTS — try these API versions in order
const VERSIONS = [
  "2025-04-01-preview",
  "2025-03-01-preview",
  "2025-01-01-preview",
  "2024-12-01-preview",
  "2024-10-01-preview",
  "2024-05-01-preview",
  "2024-02-15-preview",
];

console.log(`\nEndpoint:   ${ENDPOINT}`);
console.log(`Deployment: ${DEPLOYMENT}\n`);

for (const version of VERSIONS) {
  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/audio/speech?api-version=${version}`;
  console.log(`Testing api-version=${version}`);
  console.log(`  URL: ${url}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "api-key":     API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEPLOYMENT,
        input: "Hello, this is a test.",
        voice: "onyx",
      }),
    });

    const region = res.headers.get("x-ms-region") ?? "(none)";
    console.log(`  Status: ${res.status}   x-ms-region: ${region}`);

    if (res.ok) {
      console.log(`  ✅  SUCCESS — TTS works with api-version=${version}\n`);
      console.log(`  Set AZURE_TTS_DEPLOYMENT=${DEPLOYMENT} and update apiVersion in generate-audio.mjs.\n`);
      process.exit(0);
    } else {
      const ct   = res.headers.get("content-type") ?? "";
      const body = ct.includes("json") ? await res.json() : await res.text();
      const msg  = body?.error?.message ?? body?.error?.code ?? JSON.stringify(body).slice(0, 200);
      console.log(`  ❌  ${msg}\n`);
    }
  } catch (e) {
    console.log(`  ❌  Network error: ${e.message}\n`);
  }
}

console.log("❌  TTS failed on all API versions.");
console.log("   Verify that the deployment status is 'Succeeded' in Azure AI Studio.");

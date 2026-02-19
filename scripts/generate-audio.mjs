/**
 * Voiceover pipeline using Azure OpenAI only — one key, one endpoint.
 *
 *  Step 1: Azure OpenAI TTS  → generates MP3 per scene
 *  Step 2: Azure OpenAI Whisper → word-level timestamps
 *  Step 3: Rewrites src/narration.ts with frame-accurate caption timings
 *
 * ─── Setup ────────────────────────────────────────────────────────────────────
 * In Azure AI Studio (ai.azure.com) you need two deployments:
 *   • A TTS model      → e.g. deployment name "tts"    (model: tts-hd)
 *   • A Whisper model  → e.g. deployment name "whisper" (model: whisper)
 *
 * Set these environment variables before running:
 *   set AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE.openai.azure.com
 *   set AZURE_OPENAI_API_KEY=your-key
 *   set AZURE_TTS_DEPLOYMENT=tts          (default: tts)
 *   set AZURE_WHISPER_DEPLOYMENT=whisper  (default: whisper)
 *
 * Run:
 *   node scripts/generate-audio.mjs
 */

import { AzureOpenAI } from "openai";
import { writeFileSync, mkdirSync, createReadStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { toFile } from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const AUDIO_DIR = join(ROOT, "public", "audio");
const FPS       = 30;
const WORDS_PER_SEGMENT = 8;

// ─── Config ───────────────────────────────────────────────────────────────────
const ENDPOINT         = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY          = process.env.AZURE_OPENAI_API_KEY;
const TTS_DEPLOYMENT   = process.env.AZURE_TTS_DEPLOYMENT   ?? "tts-hd";
const WHISPER_DEPLOY   = process.env.AZURE_WHISPER_DEPLOYMENT ?? "whisper";

if (!ENDPOINT || !API_KEY) {
  console.error("\n❌  Missing Azure OpenAI credentials.\n");
  console.error("    set AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE.openai.azure.com");
  console.error("    set AZURE_OPENAI_API_KEY=your-key\n");
  console.error("    Get both from: portal.azure.com → your Azure OpenAI resource → Keys and Endpoint\n");
  process.exit(1);
}

// TTS requires a preview API version — not available in the GA 2024-06-01 release
const ttsClient = new AzureOpenAI({
  endpoint: ENDPOINT,
  apiKey: API_KEY,
  apiVersion: "2025-04-01-preview",
  deployment: TTS_DEPLOYMENT,
});

// Whisper works on the stable GA version
const whisperClient = new AzureOpenAI({
  endpoint: ENDPOINT,
  apiKey: API_KEY,
  apiVersion: "2025-04-01-preview",
  deployment: WHISPER_DEPLOY,
});

mkdirSync(AUDIO_DIR, { recursive: true });

// ─── Scenes ───────────────────────────────────────────────────────────────────
const SCENES = [
  {
    key: "title",
    file: "title",
    text: "Meet ContextWeaver. The Microsoft Copilot agent giving your entire codebase institutional memory.",
  },
  {
    key: "hackIdea",
    file: "hack-idea",
    text: "Copilot knows your syntax — but not your team's intent. ContextWeaver fuses Git, ADO, and Teams into one queryable knowledge graph. Grounded answers in seconds.",
  },
  {
    key: "architecture",
    file: "architecture",
    text: "Four layers working in concert. Azure Functions capture every commit, ticket, and meeting. Cosmos DB and Azure AI Search store the knowledge graph. GPT-4o and Semantic Kernel orchestrate reasoning, surfaced natively through Copilot Chat.",
  },
  {
    key: "codeWalkthrough",
    file: "code-walkthrough",
    text: "The action handler runs hybrid retrieval — combining vector search with graph traversal. GPT-4o generates a grounded, cited answer. The ingestion pipeline extracts intent from every pull request and writes causal relationships into the graph.",
  },
  {
    key: "demo",
    file: "demo",
    // Narrate over your PoC video — keep it short, one or two sentences
    text: "Here it is in action. Watch as Copilot Chat surfaces the exact context behind a pull request in seconds.",
  },
  {
    key: "benefits",
    file: "benefits",
    text: "Four wins: institutional memory that outlasts team turnover, ten-times faster onboarding, cross-signal correlation no other tool offers, and zero UI tax — it all lives inside Copilot Chat.",
  },
  {
    key: "futureScope",
    file: "future-scope",
    text: "Next: proactive context push, architecture drift detection, multi-repo federation, and a Copilot Studio connector for every team. The journey has just begun.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildCaptions(words) {
  const segments = [];
  for (let i = 0; i < words.length; i += WORDS_PER_SEGMENT) {
    const chunk      = words.slice(i, i + WORDS_PER_SEGMENT);
    const startFrame = Math.max(0, Math.round(chunk[0].start * FPS) - 1);
    const endFrame   = Math.round(chunk[chunk.length - 1].end * FPS) + 6;
    const text       = chunk.map((w) => w.word).join(" ");
    segments.push({ start: startFrame, end: endFrame, text });
  }
  return segments;
}

function renderCaptionLines(segs) {
  return segs
    .map((s) => `    { start: ${s.start}, end: ${s.end}, text: ${JSON.stringify(s.text)} },`)
    .join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log("\n🎙  Azure OpenAI voiceover pipeline\n");
console.log(`   TTS deployment:     ${TTS_DEPLOYMENT}`);
console.log(`   Whisper deployment: ${WHISPER_DEPLOY}\n`);

const results = {};

for (const scene of SCENES) {
  process.stdout.write(`  [${scene.file}]  TTS... `);

  // 1. Generate audio with Azure OpenAI TTS
  const speech = await ttsClient.audio.speech.create({
    model: TTS_DEPLOYMENT,
    voice: "onyx",       // onyx = deep/authoritative; try: alloy echo fable nova shimmer
    input: scene.text,
    speed: 0.95,
  });
  const audioBuffer = Buffer.from(await speech.arrayBuffer());
  const audioPath   = join(AUDIO_DIR, `${scene.file}.mp3`);
  writeFileSync(audioPath, audioBuffer);
  process.stdout.write(`✓   Whisper... `);

  // 2. Transcribe with Azure OpenAI Whisper for word timestamps
  const audioFile = await toFile(createReadStream(audioPath), `${scene.file}.mp3`, { type: "audio/mpeg" });
  const transcript = await whisperClient.audio.transcriptions.create({
    model: WHISPER_DEPLOY,
    file: audioFile,
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const words    = transcript.words ?? [];
  const captions = words.length > 0
    ? buildCaptions(words)
    : [{ start: 10, end: 140, text: scene.text }]; // fallback if Whisper omits words

  results[scene.key] = { text: scene.text, captions };
  console.log(`✓   (${captions.length} caption segments)`);
}

// ─── Rewrite narration.ts with accurate timings ───────────────────────────────
const narrationTs = `/**
 * AUTO-GENERATED by scripts/generate-audio.mjs
 * Azure OpenAI TTS audio + Whisper word-accurate caption timings.
 * Re-run the script after changing narration text.
 */

export interface CaptionEntry {
  start: number;
  end: number;
  text: string;
}

export interface SceneNarration {
  text: string;
  captions: CaptionEntry[];
}

const title: SceneNarration = {
  text: ${JSON.stringify(results.title.text)},
  captions: [
${renderCaptionLines(results.title.captions)}
  ],
};

const hackIdea: SceneNarration = {
  text: ${JSON.stringify(results.hackIdea.text)},
  captions: [
${renderCaptionLines(results.hackIdea.captions)}
  ],
};

const architecture: SceneNarration = {
  text: ${JSON.stringify(results.architecture.text)},
  captions: [
${renderCaptionLines(results.architecture.captions)}
  ],
};

const codeWalkthrough: SceneNarration = {
  text: ${JSON.stringify(results.codeWalkthrough.text)},
  captions: [
${renderCaptionLines(results.codeWalkthrough.captions)}
  ],
};

const demo: SceneNarration = {
  text: ${JSON.stringify(results.demo.text)},
  captions: [
${renderCaptionLines(results.demo.captions)}
  ],
};

const benefits: SceneNarration = {
  text: ${JSON.stringify(results.benefits.text)},
  captions: [
${renderCaptionLines(results.benefits.captions)}
  ],
};

const futureScope: SceneNarration = {
  text: ${JSON.stringify(results.futureScope.text)},
  captions: [
${renderCaptionLines(results.futureScope.captions)}
  ],
};

export const NARRATION = {
  title,
  hackIdea,
  architecture,
  codeWalkthrough,
  demo,
  benefits,
  futureScope,
} as const;
`;

writeFileSync(join(ROOT, "src", "narration.ts"), narrationTs);

// ─── Patch constants.ts with audio-accurate scene durations ──────────────────
const DURATION_BUFFER = 45; // frames of silence after last word

function lastFrame(captions) {
  return Math.max(...captions.map((c) => c.end));
}

const durations = {
  TITLE_DURATION:            lastFrame(results.title.captions)         + DURATION_BUFFER,
  HACK_IDEA_DURATION:        lastFrame(results.hackIdea.captions)      + DURATION_BUFFER,
  ARCHITECTURE_DURATION:     lastFrame(results.architecture.captions)  + DURATION_BUFFER,
  CODE_WALKTHROUGH_DURATION: lastFrame(results.codeWalkthrough.captions) + DURATION_BUFFER,
  BENEFITS_DURATION:         lastFrame(results.benefits.captions)      + DURATION_BUFFER,
  FUTURE_SCOPE_DURATION:     lastFrame(results.futureScope.captions)   + DURATION_BUFFER,
};

const { readFileSync } = await import("fs");
let constantsTs = readFileSync(join(ROOT, "src", "constants.ts"), "utf8");

for (const [key, value] of Object.entries(durations)) {
  constantsTs = constantsTs.replace(
    new RegExp(`(export const ${key} =)[^;]+;`),
    `$1 ${value};`
  );
}

writeFileSync(join(ROOT, "src", "constants.ts"), constantsTs);
console.log("   Durations →  src/constants.ts  (auto-sized to audio length)");

console.log("\n✅  Done!\n");
console.log("   Audio    →  public/audio/*.mp3");
console.log("   Captions →  src/narration.ts  (Whisper word-accurate timings)");
console.log("\n   Restart Remotion Studio to hear the voiceover.\n");

// ─── Video config ────────────────────────────────────────────────────────────
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

// ─── Scene durations — sized to actual TTS audio (Whisper last-word frame + 45 buffer) ─────
export const TITLE_DURATION = 230;            // audio ~6.3s
export const HACK_IDEA_DURATION = 350;        // audio ~10.2s
export const ARCHITECTURE_DURATION = 515;     // audio ~15.7s
export const CODE_WALKTHROUGH_DURATION = 525; // audio ~15.9s
// ── Demo scene: set to match your PoC video length (frames = seconds × 30) ──
// e.g. a 20-second video → 600. Set to 0 to skip the demo scene entirely.
export const DEMO_DURATION = 300;             // default 10s — update to match your poc.mp4
export const BENEFITS_DURATION = 415;         // audio ~12.3s
export const FUTURE_SCOPE_DURATION = 335;     // audio ~9.6s

// Each transition overlaps adjacent sequences, reducing total duration
export const TRANSITION_DURATION = 25; // frames (~0.83s per transition)
// NUM_TRANSITIONS is 6 when demo scene is active, 5 when skipped (DEMO_DURATION = 0)
export const NUM_TRANSITIONS = DEMO_DURATION > 0 ? 6 : 5;

export const TOTAL_DURATION =
  TITLE_DURATION +
  HACK_IDEA_DURATION +
  ARCHITECTURE_DURATION +
  CODE_WALKTHROUGH_DURATION +
  DEMO_DURATION +          // 0 when skipped, so this is a no-op
  BENEFITS_DURATION +
  FUTURE_SCOPE_DURATION -
  NUM_TRANSITIONS * TRANSITION_DURATION; // subtract overlap from TransitionSeries

// ─── Theme ────────────────────────────────────────────────────────────────────
// Change ACTIVE_THEME to switch the entire colour palette.
// Options: "midnight" | "ocean" | "ember" | "forest" | "monochrome"
export const ACTIVE_THEME = "midnight";

const THEMES = {
  midnight: {
    bg: "#0a0a0f",
    bgCard: "#13131f",
    bgCode: "#1e1e2e",
    accent: "#7c3aed",
    accentLight: "#a78bfa",
    accentGlow: "rgba(124, 58, 237, 0.3)",
    text: "#ffffff",
    textMuted: "#94a3b8",
    textDim: "#4b5563",
    success: "#10b981",
    warning: "#f59e0b",
    border: "rgba(124, 58, 237, 0.25)",
  },
  ocean: {
    bg: "#050d1a",
    bgCard: "#0a1628",
    bgCode: "#0d1f38",
    accent: "#06b6d4",
    accentLight: "#67e8f9",
    accentGlow: "rgba(6, 182, 212, 0.3)",
    text: "#ffffff",
    textMuted: "#94a3b8",
    textDim: "#334155",
    success: "#10b981",
    warning: "#f59e0b",
    border: "rgba(6, 182, 212, 0.25)",
  },
  ember: {
    bg: "#0f0a05",
    bgCard: "#1c1208",
    bgCode: "#231708",
    accent: "#f97316",
    accentLight: "#fdba74",
    accentGlow: "rgba(249, 115, 22, 0.3)",
    text: "#ffffff",
    textMuted: "#a8a29e",
    textDim: "#57534e",
    success: "#84cc16",
    warning: "#eab308",
    border: "rgba(249, 115, 22, 0.25)",
  },
  forest: {
    bg: "#030a05",
    bgCard: "#071510",
    bgCode: "#0a1f12",
    accent: "#10b981",
    accentLight: "#6ee7b7",
    accentGlow: "rgba(16, 185, 129, 0.3)",
    text: "#ffffff",
    textMuted: "#94a3b8",
    textDim: "#374151",
    success: "#34d399",
    warning: "#f59e0b",
    border: "rgba(16, 185, 129, 0.25)",
  },
  monochrome: {
    bg: "#080808",
    bgCard: "#111111",
    bgCode: "#1a1a1a",
    accent: "#e2e8f0",
    accentLight: "#f8fafc",
    accentGlow: "rgba(226, 232, 240, 0.2)",
    text: "#ffffff",
    textMuted: "#94a3b8",
    textDim: "#475569",
    success: "#94a3b8",
    warning: "#94a3b8",
    border: "rgba(226, 232, 240, 0.15)",
  },
};

export const COLORS = THEMES[ACTIVE_THEME as keyof typeof THEMES];

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONTS = {
  display: "'Inter', 'Segoe UI', sans-serif",
  mono: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
};

// ─── Content — ContextWeaver hack ────────────────────────────────────────────
export const CONTENT = {
  title: {
    hackName: "ContextWeaver",
    tagline: "Your codebase has a memory. Now your team does too.",
    team: "Team Name",
    event: "Copilot Hackathon 2026",
  },
  hackIdea: {
    problem:
      "Developers lose hours reconstructing why code exists — which decisions were made, which tickets drove them, and which conversations shaped them. GitHub Copilot knows your syntax but not your team's intent.",
    solution:
      "ContextWeaver is a Microsoft Copilot agent that builds a living knowledge graph from Git, PRs, ADO tickets, and Teams threads — so you can ask Copilot Chat 'why does this exist?' and get a cited answer in seconds.",
    bullets: [
      "Intent over content — links commits to decisions, not just diffs",
      "Graph-augmented RAG across Cosmos DB + Azure AI Search",
      "Zero new UI — lives natively in GitHub Copilot Chat & Teams",
    ],
  },
  architecture: {
    title: "Architecture Overview",
    layers: [
      { label: "Copilot Surface", tech: "GitHub Copilot Chat · Teams Agent · VS Code", color: "#0078d4" },
      { label: "Orchestration", tech: "Azure OpenAI GPT-4o · Semantic Kernel", color: "#7c3aed" },
      { label: "Knowledge", tech: "Azure AI Search · Cosmos DB Gremlin", color: "#10b981" },
      { label: "Ingestion", tech: "GitHub Webhooks · ADO API · Teams Export", color: "#f59e0b" },
    ],
    flow: [
      "PR Merged",
      "Azure Function",
      "Intent Extraction",
      "Graph Write",
      "Copilot Chat",
    ],
  },
  code: {
    title: "Core Implementation",
    language: "typescript",
    snippets: [
      {
        label: "Copilot Agent Action Handler",
        code: `// Hybrid graph + vector retrieval
const vectors = await AISearch.query(query, { filter: repo });
const graph   = await Gremlin.traverse(
  \`g.V().has('file','${"{fileCtx}"}')
     .in('DECISION_AFFECTED')
     .out('LINKED_TICKET').limit(5)\`
);
// Grounded answer via GPT-4o
const answer = await openai.chat([
  { role: "system", content: GROUNDED_SYSTEM_PROMPT },
  { role: "user",   content: buildContext(vectors, graph) }
]);
return { answer, citations: vectors.map(v => v.sourceUrl) };`,
      },
      {
        label: "PR Intent Extraction & Graph Write",
        code: `// Extract structured intent from PR payload
const intent = await sk.invokePrompt<IntentSchema>(\`
  Extract: rationale, affected_components[],
           linked_tickets[], risk_areas[]
  From PR: {{title}} | {{body}} | {{files}}
\`, prPayload);

// Write causal edges into Cosmos Gremlin
await Gremlin.batchUpsert([
  addDecisionVertex(prPayload.id, intent.rationale),
  ...intent.affected_components.map(c =>
    linkEdge(\`pr-\${prPayload.id}\`, c, 'DECISION_AFFECTED')
  ),
]);`,
      },
    ],
  },
  benefits: [
    { icon: "🧠", title: "Institutional Memory", description: "Decisions survive team turnover — permanently linked to code" },
    { icon: "⚡", title: "10x Faster Onboarding", description: "New devs get grounded answers with citations in < 3 seconds" },
    { icon: "🔗", title: "Cross-Signal Graph", description: "First tool unifying Git, ADO, Teams & meetings into causal reasoning" },
    { icon: "🛡️", title: "Zero UI Tax", description: "Lives inside Copilot Chat — no new tools, no context switching" },
  ],
  futureScope: [
    "Proactive context push when you open a file",
    "Architecture drift detection in CI pipelines",
    "Multi-repo federation across org boundaries",
    "Temporal rollback — 'what did the team know at the outage?'",
    "Copilot Studio connector for product & QA teams",
  ],
};

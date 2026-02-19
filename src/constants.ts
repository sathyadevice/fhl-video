// ─── Video config ────────────────────────────────────────────────────────────
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

// ─── Scene durations — sized to actual TTS audio (Whisper last-word frame + 45 buffer) ─────
export const TITLE_DURATION = 230;            // audio ~6.3s
export const HACK_IDEA_DURATION = 350;        // audio ~10.2s
export const ARCHITECTURE_DURATION = 515;     // audio ~15.7s
export const CODE_WALKTHROUGH_DURATION = 525; // audio ~15.9s
export const BENEFITS_DURATION = 415;         // audio ~12.3s
export const FUTURE_SCOPE_DURATION = 335;     // audio ~9.6s

// Each transition overlaps adjacent sequences, reducing total duration
export const TRANSITION_DURATION = 25; // frames (~0.83s per transition)
export const NUM_TRANSITIONS = 5;      // 5 transitions between 6 scenes

export const TOTAL_DURATION =
  TITLE_DURATION +
  HACK_IDEA_DURATION +
  ARCHITECTURE_DURATION +
  CODE_WALKTHROUGH_DURATION +
  BENEFITS_DURATION +
  FUTURE_SCOPE_DURATION -
  NUM_TRANSITIONS * TRANSITION_DURATION; // subtract overlap from TransitionSeries

// ─── Color palette ────────────────────────────────────────────────────────────
export const COLORS = {
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
};

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
    event: "Microsoft Copilot Hackathon 2026",
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

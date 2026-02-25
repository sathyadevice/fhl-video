import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedCaptions } from "../components/AnimatedCaptions";
import { SceneHeading } from "../components/SceneHeading";
import { SafeAudio } from "../components/SafeAudio";
import {
  COLORS,
  CONTENT,
  FONTS,
  CODE_WALKTHROUGH_DURATION,
  TRANSITION_DURATION,
} from "../constants";
import { NARRATION } from "../narration";

// ─── Walkthrough steps ────────────────────────────────────────────────────────
// Each step maps to a snippet, a range of lines (0-based, exclusive end),
// a start frame, and a short label shown in the sidebar.
const STEPS = [
  {
    snippetIdx: 0, lineStart: 0,  lineEnd: 2,
    startFrame: 15,
    title: "Hybrid Retrieval",
    desc: "Vectors + graph queried in parallel",
  },
  {
    snippetIdx: 0, lineStart: 2,  lineEnd: 7,
    startFrame: 115,
    title: "Graph Traversal",
    desc: "Causal edges: file → decision → ticket",
  },
  {
    snippetIdx: 0, lineStart: 7,  lineEnd: 13,
    startFrame: 215,
    title: "Grounded Answer",
    desc: "GPT-4o synthesizes with citations",
  },
  {
    snippetIdx: 1, lineStart: 0,  lineEnd: 6,
    startFrame: 295,
    title: "Intent Extraction",
    desc: "SK extracts PR rationale & impact",
  },
  {
    snippetIdx: 1, lineStart: 7,  lineEnd: 14,
    startFrame: 400,
    title: "Graph Write",
    desc: "Causal edges persisted to Gremlin",
  },
];

// Frame at which snippet 0 fades out and snippet 1 fades in
const SNIPPET_SWITCH = 268;

// Pixel height of each code line
const LINE_H = 40;

// Top offset inside code window before first line:
// top-padding(20) + dot-height(12) + dot-margin-bottom(18) = 50
const CODE_TOP_OFFSET = 50;

function getStepIdx(frame: number): number {
  let idx = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (frame >= STEPS[i].startFrame) idx = i;
  }
  return idx;
}

export const CodeWalkthroughScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepIdx = getStepIdx(frame);
  const step = STEPS[stepIdx];
  const prevStep = stepIdx > 0 ? STEPS[stepIdx - 1] : null;

  // Spring driving both spotlight movement and line fade transitions
  const stepSpring = Math.max(
    0,
    Math.min(
      1,
      spring({ frame: frame - step.startFrame, fps, config: { damping: 200, stiffness: 65 } })
    )
  );

  // Snippet cross-fade: fade out → blank → fade in
  const snippetOpacity =
    frame < SNIPPET_SWITCH
      ? 1
      : frame < SNIPPET_SWITCH + 14
      ? interpolate(frame, [SNIPPET_SWITCH, SNIPPET_SWITCH + 14], [1, 0])
      : frame < SNIPPET_SWITCH + 28
      ? 0
      : frame < SNIPPET_SWITCH + 44
      ? interpolate(frame, [SNIPPET_SWITCH + 28, SNIPPET_SWITCH + 44], [0, 1])
      : 1;

  const snippet = CONTENT.code.snippets[step.snippetIdx];
  const lines = snippet.code.split("\n");

  // Animate spotlight from previous step's line position to current
  const fromLine =
    prevStep && prevStep.snippetIdx === step.snippetIdx
      ? prevStep.lineStart
      : step.lineStart;
  const spotlightTop = interpolate(
    stepSpring,
    [0, 1],
    [fromLine * LINE_H, step.lineStart * LINE_H]
  );
  const spotlightH = (step.lineEnd - step.lineStart) * LINE_H;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        padding: "72px 100px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <SafeAudio
        src={staticFile("audio/code-walkthrough.mp3")}
        volume={(f) => {
          const fadeIn = Math.min(1, f / 8);
          const fadeOut =
            f > CODE_WALKTHROUGH_DURATION - TRANSITION_DURATION - 8
              ? Math.max(0, (CODE_WALKTHROUGH_DURATION - TRANSITION_DURATION - f) / 8)
              : 1;
          return fadeIn * fadeOut;
        }}
      />
      <AnimatedCaptions captions={NARRATION.codeWalkthrough.captions} />
      <SceneHeading label="Core Implementation" />

      {/* Main layout: step sidebar + code window */}
      <div style={{ display: "flex", gap: 28, flex: 1, minHeight: 0 }}>

        {/* ── Step sidebar ── */}
        <div
          style={{
            width: 228,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 4,
          }}
        >
          {STEPS.map((s, i) => {
            const isActive = i === stepIdx;
            const isPast = i < stepIdx;
            const appeared = Math.max(0, Math.min(1, (frame - s.startFrame + 8) / 18));

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  opacity: appeared,
                  transform: `translateX(${interpolate(appeared, [0, 1], [-18, 0])}px)`,
                }}
              >
                {/* Step number badge */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive
                      ? COLORS.accent
                      : isPast
                      ? `${COLORS.accent}30`
                      : COLORS.bgCard,
                    border: `2px solid ${
                      isActive ? COLORS.accent : isPast ? `${COLORS.accent}55` : COLORS.border
                    }`,
                    boxShadow: isActive ? `0 0 12px ${COLORS.accentGlow}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: isActive ? "#fff" : COLORS.textMuted,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Step text */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 3 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? COLORS.accentLight
                        : isPast
                        ? COLORS.textMuted
                        : COLORS.textDim,
                      lineHeight: 1.3,
                    }}
                  >
                    {s.title}
                  </span>
                  {isActive && (
                    <span
                      style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }}
                    >
                      {s.desc}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Code panel ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: snippetOpacity,
            minHeight: 0,
          }}
        >
          {/* Snippet file label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: COLORS.accent,
                boxShadow: `0 0 8px ${COLORS.accent}`,
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: COLORS.accentLight,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {snippet.label}
            </span>
          </div>

          {/* Code window */}
          <div
            style={{
              flex: 1,
              background: COLORS.bgCode,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* macOS window chrome */}
            <div style={{ padding: "20px 32px 0 32px" }}>
              <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div
                    key={i}
                    style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Animated spotlight highlight bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: CODE_TOP_OFFSET + spotlightTop,
                height: spotlightH,
                background: `linear-gradient(90deg, ${COLORS.accent}2a 0%, ${COLORS.accent}0e 60%, transparent 100%)`,
                borderLeft: `3px solid ${COLORS.accent}`,
                boxShadow: `0 0 28px ${COLORS.accentGlow}`,
                pointerEvents: "none",
              }}
            />

            {/* Code lines */}
            <div style={{ paddingBottom: 20 }}>
              {lines.map((line, i) => {
                const isActive = i >= step.lineStart && i < step.lineEnd;
                const wasPrev =
                  prevStep &&
                  prevStep.snippetIdx === step.snippetIdx &&
                  i >= prevStep.lineStart &&
                  i < prevStep.lineEnd;

                const lineOpacity = isActive
                  ? interpolate(stepSpring, [0, 1], [wasPrev ? 1 : 0.18, 1])
                  : wasPrev
                  ? interpolate(stepSpring, [0, 1], [1, 0.18])
                  : 0.18;

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: LINE_H,
                      opacity: lineOpacity,
                      paddingLeft: 12,
                    }}
                  >
                    {/* Line number */}
                    <span
                      style={{
                        fontSize: 13,
                        color: COLORS.textDim,
                        fontFamily: FONTS.mono,
                        width: 28,
                        textAlign: "right",
                        flexShrink: 0,
                        marginRight: 20,
                        userSelect: "none",
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Syntax-highlighted code */}
                    <pre
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 20,
                        color: COLORS.text,
                        margin: 0,
                        lineHeight: `${LINE_H}px`,
                        whiteSpace: "pre",
                      }}
                    >
                      <SyntaxHighlight code={line} />
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Syntax highlighting ──────────────────────────────────────────────────────
const SyntaxHighlight: React.FC<{ code: string }> = ({ code }) => {
  const tokens: { start: number; end: number; color: string }[] = [];

  const addTokens = (re: RegExp, color: string) => {
    const r = new RegExp(re.source, "g");
    let m: RegExpExecArray | null;
    while ((m = r.exec(code)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, color });
    }
  };

  addTokens(/(\/\/[^\n]*)/, "#6b7280");
  addTokens(/(["'`][^"'`\n]*["'`])/, "#86efac");
  addTokens(/\b(async|function|const|let|var|return|await|import|from|export|default|new)\b/, "#c084fc");
  addTokens(/\b(string|number|boolean|void|Promise|Record)\b/, "#67e8f9");

  tokens.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const token of tokens) {
    if (token.start < last) continue;
    if (token.start > last) parts.push(code.slice(last, token.start));
    parts.push(
      <span key={token.start} style={{ color: token.color }}>
        {code.slice(token.start, token.end)}
      </span>
    );
    last = token.end;
  }
  if (last < code.length) parts.push(code.slice(last));

  return <>{parts}</>;
};

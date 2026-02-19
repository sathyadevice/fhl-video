import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionOverlay } from "../components/CaptionOverlay";
import { SafeAudio } from "../components/SafeAudio";
import { COLORS, CONTENT, FONTS, CODE_WALKTHROUGH_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const CodeWalkthroughScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Show second snippet after halfway through the scene
  const showSecond = frame > 120;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        padding: "80px 120px",
        overflow: "hidden",
      }}
    >
      <SafeAudio
        src={staticFile("audio/code-walkthrough.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > CODE_WALKTHROUGH_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (CODE_WALKTHROUGH_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />
      <CaptionOverlay captions={NARRATION.codeWalkthrough.captions} />
      <SectionLabel label="Code Walkthrough" frame={frame} fps={fps} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          marginTop: 48,
          flex: 1,
        }}
      >
        {CONTENT.code.snippets.map((snippet, i) => {
          const delay = i === 0 ? 10 : 130;
          const prog = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 70 } });

          return (
            <CodeBlock
              key={i}
              label={snippet.label}
              code={snippet.code}
              progress={clamp(prog)}
              frame={frame}
              delay={delay}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CodeBlock: React.FC<{
  label: string;
  code: string;
  progress: number;
  frame: number;
  delay: number;
}> = ({ label, code, progress, frame, delay }) => {
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Animate characters appearing
  const charProg = spring({ frame: frame - delay - 5, fps, config: { damping: 30, stiffness: 60 } });
  const visibleChars = Math.floor(interpolate(clamp(charProg), [0, 1], [0, code.length]));

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.accent,
            boxShadow: `0 0 10px ${COLORS.accent}`,
          }}
        />
        <span style={{ color: COLORS.accentLight, fontSize: 20, fontWeight: 600 }}>{label}</span>
      </div>

      {/* Code panel */}
      <div
        style={{
          background: COLORS.bgCode,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "28px 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
          ))}
        </div>

        {/* Code text */}
        <pre
          style={{
            fontFamily: FONTS.mono,
            fontSize: 26,
            color: COLORS.text,
            margin: 0,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          <SyntaxHighlight code={code.slice(0, visibleChars)} />
          {/* Blinking cursor */}
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: "1.1em",
              background: COLORS.accent,
              verticalAlign: "text-bottom",
              marginLeft: 2,
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            }}
          />
        </pre>
      </div>
    </div>
  );
};

// Basic syntax highlighting via span coloring
const SyntaxHighlight: React.FC<{ code: string }> = ({ code }) => {
  const keywords = /\b(async|function|const|let|var|return|await|import|from|export|default)\b/g;
  const strings = /(["'`][^"'`]*["'`])/g;
  const comments = /(\/\/[^\n]*)/g;
  const types = /\b(string|number|boolean|void|Promise|Record)\b/g;

  // Simple tokenizer — render as plain text with colored spans
  const parts: React.ReactNode[] = [];
  let last = 0;
  const tokens: { start: number; end: number; color: string }[] = [];

  const addTokens = (re: RegExp, color: string) => {
    let m: RegExpExecArray | null;
    const r = new RegExp(re.source, "g");
    while ((m = r.exec(code)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, color });
    }
  };

  addTokens(comments, "#6b7280");
  addTokens(strings, "#86efac");
  addTokens(keywords, "#c084fc");
  addTokens(types, "#67e8f9");

  tokens.sort((a, b) => a.start - b.start);

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

const SectionLabel: React.FC<{ label: string; frame: number; fps: number }> = ({ label, frame, fps }) => {
  const prog = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: clamp(prog) }}>
      <div style={{ width: 6, height: 48, background: COLORS.accent, borderRadius: 3 }} />
      <span style={{ fontSize: 48, fontWeight: 700, color: COLORS.text, letterSpacing: "-1px" }}>{label}</span>
    </div>
  );
};

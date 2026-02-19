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
import { ParticleField } from "../components/ParticleField";
import { SafeAudio } from "../components/SafeAudio";
import { COLORS, CONTENT, FONTS, HACK_IDEA_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const HackIdeaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const problemIn  = spring({ frame: frame - 8,  fps, config: { damping: 18, stiffness: 70 } });
  const arrowIn    = spring({ frame: frame - 30, fps, config: { damping: 200, stiffness: 80 } });
  const solutionIn = spring({ frame: frame - 38, fps, config: { damping: 18, stiffness: 70 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        padding: "72px 100px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SafeAudio
        src={staticFile("audio/hack-idea.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > HACK_IDEA_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (HACK_IDEA_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />
      <ParticleField count={18} opacity={0.10} />
      <CaptionOverlay captions={NARRATION.hackIdea.captions} />

      <SectionLabel label="The Hack" frame={frame} fps={fps} />

      {/* ── Problem → Solution split cards ── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          marginTop: 44,
        }}
      >
        {/* Problem card */}
        <div
          style={{
            flex: 1,
            background: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.28)",
            borderRight: "none",
            borderRadius: "20px 0 0 20px",
            padding: "40px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: clamp(problemIn),
            transform: `translateX(${interpolate(clamp(problemIn), [0, 1], [-70, 0])}px)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top-left corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 4,
              height: "100%",
              background: "linear-gradient(180deg, #f59e0b, transparent)",
              borderRadius: "20px 0 0 20px",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 36 }}>⚡</span>
            <span
              style={{
                fontSize: 12,
                color: COLORS.warning,
                fontWeight: 700,
                letterSpacing: 3.5,
                textTransform: "uppercase",
              }}
            >
              The Problem
            </span>
          </div>

          <p
            style={{
              fontSize: 26,
              color: COLORS.text,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {CONTENT.hackIdea.problem}
          </p>
        </div>

        {/* Arrow connector */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
            flexShrink: 0,
            zIndex: 1,
            gap: 0,
          }}
        >
          {/* Line */}
          <div
            style={{
              width: interpolate(clamp(arrowIn), [0, 1], [0, 48]),
              height: 2,
              background: `linear-gradient(90deg, ${COLORS.warning}, ${COLORS.accent})`,
              boxShadow: `0 0 10px ${COLORS.accentGlow}`,
            }}
          />
          {/* Arrowhead */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "9px solid transparent",
              borderBottom: "9px solid transparent",
              borderLeft: `14px solid ${COLORS.accent}`,
              opacity: clamp(arrowIn) > 0.6 ? interpolate(clamp(arrowIn), [0.6, 1], [0, 1]) : 0,
              marginLeft: 2,
              marginTop: -2,
              filter: `drop-shadow(0 0 6px ${COLORS.accent})`,
            }}
          />
        </div>

        {/* Solution card */}
        <div
          style={{
            flex: 1,
            background: "rgba(124,58,237,0.07)",
            border: "1px solid rgba(124,58,237,0.35)",
            borderLeft: "none",
            borderRadius: "0 20px 20px 0",
            padding: "40px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: clamp(solutionIn),
            transform: `translateX(${interpolate(clamp(solutionIn), [0, 1], [70, 0])}px)`,
            boxShadow: `0 0 60px rgba(124,58,237,0.08)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Right-edge accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 4,
              height: "100%",
              background: `linear-gradient(180deg, ${COLORS.accent}, transparent)`,
              borderRadius: "0 20px 20px 0",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 36 }}>✨</span>
            <span
              style={{
                fontSize: 12,
                color: COLORS.accentLight,
                fontWeight: 700,
                letterSpacing: 3.5,
                textTransform: "uppercase",
              }}
            >
              The Solution
            </span>
          </div>

          <p
            style={{
              fontSize: 26,
              color: COLORS.text,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {CONTENT.hackIdea.solution}
          </p>
        </div>
      </div>

      {/* ── Key insights — horizontal pill chips ── */}
      <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
        {CONTENT.hackIdea.bullets.map((bullet, i) => {
          const prog = spring({
            frame: frame - 52 - i * 10,
            fps,
            config: { damping: 18, stiffness: 80 },
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.22)",
                borderRadius: 14,
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: clamp(prog),
                transform: `translateY(${interpolate(clamp(prog), [0, 1], [24, 0])}px)`,
              }}
            >
              {/* Glowing dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  boxShadow: `0 0 12px ${COLORS.accent}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 24,
                  color: COLORS.textMuted,
                  lineHeight: 1.4,
                }}
              >
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SectionLabel: React.FC<{ label: string; frame: number; fps: number }> = ({
  label,
  frame,
  fps,
}) => {
  const prog = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: clamp(prog),
        transform: `translateY(${interpolate(clamp(prog), [0, 1], [-20, 0])}px)`,
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: 6,
          height: 52,
          background: `linear-gradient(180deg, ${COLORS.accentLight}, ${COLORS.accent})`,
          borderRadius: 3,
          boxShadow: `0 0 16px ${COLORS.accentGlow}`,
        }}
      />
      <span
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.text,
          letterSpacing: "-1px",
        }}
      >
        {label}
      </span>
    </div>
  );
};

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
import { COLORS, CONTENT, FONTS, ARCHITECTURE_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

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
        src={staticFile("audio/architecture.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > ARCHITECTURE_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (ARCHITECTURE_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />
      <CaptionOverlay captions={NARRATION.architecture.captions} />
      <SectionLabel label="Architecture" frame={frame} fps={fps} />

      {/* Flow diagram */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          marginTop: 60,
        }}
      >
        {CONTENT.architecture.flow.map((step, i) => {
          const prog = spring({
            frame: frame - 10 - i * 14,
            fps,
            config: { damping: 18, stiffness: 80 },
          });
          const isLast = i === CONTENT.architecture.flow.length - 1;

          return (
            <React.Fragment key={i}>
              {/* Node */}
              <div
                style={{
                  opacity: clamp(prog),
                  transform: `scale(${interpolate(clamp(prog), [0, 1], [0.7, 1])})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 160,
                    height: 80,
                    borderRadius: 16,
                    background: COLORS.bgCard,
                    border: `2px solid ${COLORS.accent}`,
                    boxShadow: `0 0 24px ${COLORS.accentGlow}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: COLORS.text, fontWeight: 600, fontSize: 20, textAlign: "center" }}>
                    {step}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              {!isLast && (
                <Arrow
                  frame={frame}
                  fps={fps}
                  delay={16 + i * 14}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Layer cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CONTENT.architecture.layers.length}, 1fr)`,
          gap: 20,
          marginTop: 40,
        }}
      >
        {CONTENT.architecture.layers.map((layer, i) => {
          const prog = spring({
            frame: frame - 40 - i * 10,
            fps,
            config: { damping: 18, stiffness: 70 },
          });
          return (
            <div
              key={i}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${layer.color}44`,
                borderRadius: 16,
                padding: "24px 28px",
                opacity: clamp(prog),
                transform: `translateY(${interpolate(clamp(prog), [0, 1], [30, 0])}px)`,
                borderTop: `3px solid ${layer.color}`,
              }}
            >
              <div style={{ fontSize: 14, color: layer.color, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {layer.label}
              </div>
              <div style={{ fontSize: 22, color: COLORS.text, fontWeight: 500, marginTop: 8 }}>
                {layer.tech}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{ frame: number; fps: number; delay: number }> = ({ frame, fps, delay }) => {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const prog = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        opacity: clamp(prog),
        width: 60,
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1, height: 2, background: COLORS.accent }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "8px solid transparent",
          borderBottom: "8px solid transparent",
          borderLeft: `12px solid ${COLORS.accent}`,
        }}
      />
    </div>
  );
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

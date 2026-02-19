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
import { COLORS, CONTENT, FONTS, BENEFITS_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const BenefitsScene: React.FC = () => {
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
        src={staticFile("audio/benefits.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > BENEFITS_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (BENEFITS_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />
      <ParticleField count={18} opacity={0.10} />
      <CaptionOverlay captions={NARRATION.benefits.captions} />
      <SectionLabel label="Why It Matters" frame={frame} fps={fps} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          marginTop: 60,
          flex: 1,
        }}
      >
        {CONTENT.benefits.map((benefit, i) => {
          const prog = spring({
            frame: frame - 8 - i * 14,
            fps,
            config: { damping: 18, stiffness: 70 },
          });

          return (
            <div
              key={i}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "40px 44px",
                opacity: clamp(prog),
                transform: `translateY(${interpolate(clamp(prog), [0, 1], [40, 0])}px) scale(${interpolate(clamp(prog), [0, 1], [0.95, 1])})`,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow corner */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: COLORS.accentGlow,
                  filter: "blur(30px)",
                  opacity: 0.5,
                }}
              />

              <span style={{ fontSize: 52 }}>{benefit.icon}</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: COLORS.text }}>{benefit.title}</span>
              <span style={{ fontSize: 22, color: COLORS.textMuted, lineHeight: 1.5 }}>{benefit.description}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
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

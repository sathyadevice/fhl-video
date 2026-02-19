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
import { COLORS, CONTENT, FONTS, TITLE_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Slow breathe for orb
  const breathe = Math.sin(frame * 0.025) * 0.5 + 0.5;

  // Staggered entrances
  const eyebrowIn = spring({ frame: frame - 0,  fps, config: { damping: 18, stiffness: 60 } });
  const titleIn   = spring({ frame: frame - 12, fps, config: { damping: 200, stiffness: 90 } }); // high damping = no bounce = clean reveal
  const lineIn    = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 80 } });
  const tagIn     = spring({ frame: frame - 32, fps, config: { damping: 18, stiffness: 60 } });
  const metaIn    = spring({ frame: frame - 46, fps, config: { damping: 18, stiffness: 60 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        overflow: "hidden",
      }}
    >
      {/* Dark solid base — ensures nothing bleeds through */}
      <div style={{ position: "absolute", inset: 0, background: COLORS.bg }} />

      {/* Subtle grid — very low opacity so it doesn't compete */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow — pushed to BOTTOM so it stays away from text */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(124,58,237,${0.22 + breathe * 0.08}) 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      {/* Corner accent glows */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Voiceover */}
      <SafeAudio
        src={staticFile("audio/title.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > TITLE_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (TITLE_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />

      {/* Floating particles */}
      <ParticleField count={24} opacity={0.14} />

      {/* Captions */}
      <CaptionOverlay captions={NARRATION.title.captions} />

      {/* ── Text content — stacked in a flex column ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          padding: "0 120px",
        }}
      >
        {/* Eyebrow label */}
        <div
          style={{
            fontSize: 14,
            letterSpacing: 6,
            color: COLORS.accentLight,
            textTransform: "uppercase",
            marginBottom: 32,
            opacity: clamp(eyebrowIn),
            transform: `translateY(${interpolate(clamp(eyebrowIn), [0, 1], [-16, 0])}px)`,
            // Dark shadow so it's readable on any bg
            textShadow: "0 2px 8px rgba(0,0,0,1)",
          }}
        >
          {CONTENT.title.event}
        </div>

        {/* Main title — clip-path reveal left-to-right */}
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-3px",
            lineHeight: 1,
            textAlign: "center",
            // Reveal sweeps in from left
            clipPath: `inset(0 ${interpolate(clamp(titleIn), [0, 1], [100, 0])}% 0 0)`,
            // Strong dark drop-shadow — the key contrast fix
            textShadow:
              "0 2px 0 rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.95), 0 0 60px rgba(124,58,237,0.4)",
          }}
        >
          {CONTENT.title.hackName}
        </div>

        {/* Animated underline */}
        <div
          style={{
            height: 4,
            width: interpolate(clamp(lineIn), [0, 1], [0, 380]),
            margin: "28px 0",
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight}, ${COLORS.accent})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${COLORS.accent}, 0 0 40px ${COLORS.accentGlow}`,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: COLORS.accentLight,
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 860,
            lineHeight: 1.55,
            opacity: clamp(tagIn),
            transform: `translateY(${interpolate(clamp(tagIn), [0, 1], [20, 0])}px)`,
            // Crucial: dark text shadow so light text pops against any bg
            textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.8)",
          }}
        >
          {CONTENT.title.tagline}
        </div>
      </div>

      {/* Team / event — anchored to bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          zIndex: 2,
          opacity: clamp(metaIn),
          transform: `translateY(${interpolate(clamp(metaIn), [0, 1], [20, 0])}px)`,
        }}
      >
        <MetaChip label="Team" value={CONTENT.title.team} />
        <div
          style={{
            width: 1,
            height: 36,
            background: `rgba(124,58,237,0.5)`,
          }}
        />
        <MetaChip label="Event" value={CONTENT.title.event} />
      </div>
    </AbsoluteFill>
  );
};

const MetaChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <span
      style={{
        fontSize: 12,
        color: COLORS.textMuted,
        textTransform: "uppercase",
        letterSpacing: 3,
        textShadow: "0 2px 8px rgba(0,0,0,1)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 22,
        color: "#ffffff",
        fontWeight: 600,
        textShadow: "0 2px 12px rgba(0,0,0,0.95)",
      }}
    >
      {value}
    </span>
  </div>
);

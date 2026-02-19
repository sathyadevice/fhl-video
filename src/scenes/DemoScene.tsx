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
import { SafeVideo } from "../components/SafeVideo";
import { COLORS, DEMO_DURATION, FONTS, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const barIn = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>

      {/* PoC video — fullscreen, cropped to fill */}
      <SafeVideo src={staticFile("poc.mp4")} />

      {/* Subtle vignette to give the video some cinematic depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Voiceover */}
      <SafeAudio
        src={staticFile("audio/demo.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > DEMO_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (DEMO_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />

      {/* Captions */}
      <CaptionOverlay captions={NARRATION.demo?.captions ?? []} />

      {/* Bottom caption bar — slides up on entry */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "48px 80px 40px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.82))",
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: clamp(barIn),
          transform: `translateY(${interpolate(clamp(barIn), [0, 1], [32, 0])}px)`,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 5,
            height: 48,
            background: `linear-gradient(180deg, ${COLORS.accentLight}, ${COLORS.accent})`,
            borderRadius: 3,
            boxShadow: `0 0 16px ${COLORS.accentGlow}`,
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 13,
              letterSpacing: 4,
              color: COLORS.accentLight,
              textTransform: "uppercase",
              fontFamily: FONTS.display,
              textShadow: "0 2px 8px rgba(0,0,0,1)",
            }}
          >
            Live Demo
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: FONTS.display,
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}
          >
            See It In Action
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

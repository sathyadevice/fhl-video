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
import { COLORS, CONTENT, FONTS, FUTURE_SCOPE_DURATION, TRANSITION_DURATION } from "../constants";
import { NARRATION } from "../narration";

export const FutureScopeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const breathe = Math.sin(frame * 0.02) * 0.5 + 0.5;

  const closingIn = Math.max(0, Math.min(1, (frame - 120) / 25));

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        overflow: "hidden",
      }}
    >
      {/* Dark solid base */}
      <div style={{ position: "absolute", inset: 0, background: COLORS.bg }} />

      {/* Glow pushed to very bottom — stays BELOW all content */}
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(124,58,237,${0.18 + breathe * 0.07}) 0%, transparent 65%)`,
          filter: "blur(120px)",
        }}
      />

      <SafeAudio
        src={staticFile("audio/future-scope.mp3")}
        volume={(f) => {
          const fadeIn  = Math.min(1, f / 8);
          const fadeOut = f > FUTURE_SCOPE_DURATION - TRANSITION_DURATION - 8
            ? Math.max(0, (FUTURE_SCOPE_DURATION - TRANSITION_DURATION - f) / 8)
            : 1;
          return fadeIn * fadeOut;
        }}
      />
      <CaptionOverlay captions={NARRATION.futureScope.captions} />

      {/* Subtle grid */}
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

      {/* Left-edge accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 3,
          height: interpolate(clamp(spring({ frame: frame - 5, fps, config: { damping: 50, stiffness: 40 } })), [0, 1], [0, 1080]),
          background: `linear-gradient(180deg, transparent, ${COLORS.accent}, transparent)`,
        }}
      />

      <ParticleField count={20} opacity={0.12} />

      {/* All text content in a dark z-layer above glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "80px 120px",
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
        }}
      >
        <SectionLabel label="What's Next" frame={frame} fps={fps} />

        {/* Roadmap items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 52 }}>
          {CONTENT.futureScope.map((item, i) => {
            const prog = spring({
              frame: frame - 8 - i * 12,
              fps,
              config: { damping: 18, stiffness: 80 },
            });

            return (
              <RoadmapItem
                key={i}
                index={i}
                text={item}
                progress={clamp(prog)}
                frame={frame}
              />
            );
          })}
        </div>

        {/* Closing line — fades in at the end with strong text shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: closingIn,
            transform: `translateY(${interpolate(closingIn, [0, 1], [12, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: COLORS.accentLight,
              fontWeight: 400,
              fontStyle: "italic",
              // Dark shadow so this light-colored text stays readable over any bg
              textShadow:
                "0 2px 16px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.9)",
            }}
          >
            The journey has just begun...
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RoadmapItem: React.FC<{
  index: number;
  text: string;
  progress: number;
  frame: number;
}> = ({ index, text, progress }) => {
  const pulse = Math.sin(Date.now() * 0.001 + index) * 0.5 + 0.5; // not frame-based, but subtle

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [-60, 0])}px)`,
      }}
    >
      {/* Number badge */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `rgba(124,58,237,0.15)`,
          border: `2px solid ${COLORS.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 20px rgba(124,58,237,0.35)`,
        }}
      >
        <span
          style={{
            color: COLORS.accentLight,
            fontWeight: 800,
            fontSize: 20,
            fontFamily: FONTS.display,
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* Connector dash */}
      <div
        style={{
          width: 32,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.accent}88, transparent)`,
          flexShrink: 0,
        }}
      />

      {/* Text — with dark shadow for contrast */}
      <span
        style={{
          fontSize: 29,
          color: "#ffffff",
          fontWeight: 500,
          lineHeight: 1.4,
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        {text}
      </span>
    </div>
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
          color: "#ffffff",
          letterSpacing: "-1px",
          textShadow: "0 2px 16px rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

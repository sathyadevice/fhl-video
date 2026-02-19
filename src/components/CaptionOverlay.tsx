import React from "react";
import { useCurrentFrame } from "remotion";
import type { CaptionEntry } from "../narration";
import { FONTS } from "../constants";

interface Props {
  captions: CaptionEntry[];
  /** Skip rendering for this many frames at scene start (covers transition-in) */
  transitionGuard?: number;
}

export const CaptionOverlay: React.FC<Props> = ({
  captions,
  transitionGuard = 14,
}) => {
  const frame = useCurrentFrame();

  // Don't render during the incoming transition overlap
  if (frame < transitionGuard) return null;

  const active = captions.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const FADE_FRAMES = 7;
  const fadeIn  = Math.min(1, (frame - active.start) / FADE_FRAMES);
  const fadeOut = Math.min(1, (active.end - frame)   / FADE_FRAMES);
  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = (1 - opacity) * 8;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.78)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 10,
          padding: "12px 36px",
          maxWidth: "74%",
          textAlign: "center",
          opacity,
          transform: `translateY(${translateY}px)`,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            fontSize: 30,
            color: "#ffffff",
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          {active.text}
        </span>
      </div>
    </div>
  );
};

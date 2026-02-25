import React from "react";
import { useCurrentFrame } from "remotion";
import type { CaptionEntry } from "../narration";
import { COLORS, FONTS } from "../constants";

interface Props {
  captions: CaptionEntry[];
  /** Skip rendering for this many frames at scene start (covers transition-in) */
  transitionGuard?: number;
}

/**
 * Word-accurate caption renderer with active-word highlight.
 *
 * Each CaptionEntry covers a phrase (~8 words) with Whisper-derived frame
 * timestamps. Word timing is distributed proportionally across the phrase
 * window to determine which word is currently being spoken.
 *
 * Active word: accent colour + subtle glow. Everything else: white.
 * No CSS transitions — all state is a pure function of frame.
 */
export const AnimatedCaptions: React.FC<Props> = ({
  captions,
  transitionGuard = 14,
}) => {
  const frame = useCurrentFrame();

  if (frame < transitionGuard) return null;

  const active = captions.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  // Phrase-level fade in/out
  const FADE_FRAMES = 7;
  const fadeIn = Math.min(1, (frame - active.start) / FADE_FRAMES);
  const fadeOut = Math.min(1, (active.end - frame) / FADE_FRAMES);
  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = (1 - opacity) * 8;

  // Distribute word timing proportionally across the phrase frame window
  const words = active.text.trim().split(/\s+/);
  const duration = Math.max(1, active.end - active.start);
  const elapsed = frame - active.start;
  const wordProgress = Math.max(0, Math.min(words.length - 0.001, (elapsed / duration) * words.length));
  const activeWordIndex = Math.floor(wordProgress);

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
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          {words.map((word, i) => {
            const isActive = i === activeWordIndex;
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    color: isActive ? COLORS.accentLight : "#ffffff",
                    textShadow: isActive
                      ? `0 0 20px ${COLORS.accentGlow}, 0 1px 6px rgba(0,0,0,0.6)`
                      : "0 1px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  {word}
                </span>
                {i < words.length - 1 && " "}
              </React.Fragment>
            );
          })}
        </span>
      </div>
    </div>
  );
};

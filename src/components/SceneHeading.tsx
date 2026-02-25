import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";
import { KineticText } from "./KineticText";

interface SceneHeadingProps {
  label: string;
  /** Frame delay before the entrance animation starts (default: 0) */
  delay?: number;
}

/**
 * Unified scene heading — replaces the local SectionLabel component
 * that was duplicated across all 6 scenes.
 *
 * Renders: accent bar (scales up from top) + label text (KineticText spring).
 * Both animations use the same no-bounce spring config (damping:200).
 */
export const SceneHeading: React.FC<SceneHeadingProps> = ({
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bar grows vertically from the top edge
  const barProg = Math.max(
    0,
    Math.min(1, spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 90 } }))
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        zIndex: 1,
      }}
    >
      {/* Accent bar — scaleY from 0 → 1 */}
      <div
        style={{
          width: 6,
          height: 52,
          background: `linear-gradient(180deg, ${COLORS.accentLight}, ${COLORS.accent})`,
          borderRadius: 3,
          boxShadow: `0 0 16px ${COLORS.accentGlow}`,
          transform: `scaleY(${barProg})`,
          transformOrigin: "top center",
          opacity: barProg,
        }}
      />

      {/* Heading text — kinetic spring entrance, starts 4 frames after bar */}
      <KineticText
        frame={frame - delay - 4}
        fps={fps}
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.text,
          letterSpacing: "-1px",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </KineticText>
    </div>
  );
};

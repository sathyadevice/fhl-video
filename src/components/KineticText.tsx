import React from "react";
import { interpolate, spring } from "remotion";

interface KineticTextProps {
  /** Text or React nodes to animate */
  children: React.ReactNode;
  /**
   * Frame value driving the animation — apply your delay before passing.
   * e.g. `frame - 12` to start 12 frames in.
   */
  frame: number;
  fps: number;
  /** Base styles merged onto the wrapper span */
  style?: React.CSSProperties;
  /**
   * Spring config. Defaults to damping:200, stiffness:90 (LT-style, no bounce).
   */
  config?: { damping?: number; stiffness?: number; mass?: number };
  /** Pixels to slide up from on entrance (default 20) */
  slideDistance?: number;
}

/**
 * Pure-frame kinetic typography primitive.
 *
 * Animates:  opacity 0→1 | translateY slideDistance→0 | scale 0.97→1.0
 * All motion is driven by a high-damping spring — no CSS transitions.
 * Compose this inside any heading or callout element.
 */
export const KineticText: React.FC<KineticTextProps> = ({
  children,
  frame,
  fps,
  style,
  config = {},
  slideDistance = 20,
}) => {
  const { damping = 200, stiffness = 90, mass = 1 } = config;

  const raw = spring({ frame, fps, config: { damping, stiffness, mass } });
  const progress = Math.max(0, Math.min(1, raw));

  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [slideDistance, 0]);
  const scale = interpolate(progress, [0, 1], [0.97, 1.0]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

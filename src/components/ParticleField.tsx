import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}

export const ParticleField: React.FC<Props> = ({
  count = 28,
  color = COLORS.accent,
  opacity = 0.18,
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        // Golden-ratio distribution so particles spread evenly
        const baseX = (i * 137.508) % 100;
        const baseY = (i * 97.3) % 100;
        const size = 1.5 + (i % 4);
        const spd = (0.3 + (i % 7) * 0.1) * speed;
        const phase = i * 0.72;

        const x = baseX + Math.sin(frame * spd * 0.012 + phase) * 3.5;
        const y = baseY + Math.cos(frame * spd * 0.009 + phase) * 3.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              boxShadow: `0 0 ${size * 4}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

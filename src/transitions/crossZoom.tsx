import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type CrossZoomProps = Record<string, never>;

/**
 * crossZoom — crossfade + zoom-in + rack-focus blur.
 *
 * Entering:  fades in (0→1), settles from 1.04→1.0 scale, clears from blur.
 * Exiting:   fades out slightly and blurs — like a rack-focus shift.
 *
 * Result: a premium "focus pull" crossfade that feels purposeful, not mechanical.
 */
const CrossZoomPresentation: React.FC<
  TransitionPresentationComponentProps<CrossZoomProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const style = useMemo(() => {
    if (presentationDirection === "entering") {
      const scale = interpolate(presentationProgress, [0, 1], [1.04, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // Blur clears as scene comes into focus
      const blur = interpolate(presentationProgress, [0, 0.5, 1], [7, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {
        opacity: presentationProgress,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      };
    }

    // Exiting scene: blurs out + fades slightly while being covered
    const blur = interpolate(presentationProgress, [0, 1], [0, 7], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(presentationProgress, [0, 1], [1, 0.6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity, filter: `blur(${blur}px)` };
  }, [presentationDirection, presentationProgress]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const crossZoom = (): TransitionPresentation<CrossZoomProps> => ({
  component: CrossZoomPresentation,
  props: {},
});

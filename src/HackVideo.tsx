import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import {
  ARCHITECTURE_DURATION,
  BENEFITS_DURATION,
  CODE_WALKTHROUGH_DURATION,
  DEMO_DURATION,
  FUTURE_SCOPE_DURATION,
  HACK_IDEA_DURATION,
  TITLE_DURATION,
  TRANSITION_DURATION,
} from "./constants";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { BenefitsScene } from "./scenes/BenefitsScene";
import { CodeWalkthroughScene } from "./scenes/CodeWalkthroughScene";
import { DemoScene } from "./scenes/DemoScene";
import { FutureScopeScene } from "./scenes/FutureScopeScene";
import { HackIdeaScene } from "./scenes/HackIdeaScene";
import { TitleScene } from "./scenes/TitleScene";

export const HackVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>

        {/* ── 1. Title ─────────────────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={TITLE_DURATION}>
          <TitleScene />
        </TransitionSeries.Sequence>

        {/* Slide in from right — feels like "opening a chapter" */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            durationInFrames: TRANSITION_DURATION,
            config: { damping: 200, stiffness: 80 },
          })}
        />

        {/* ── 2. Hack Idea ─────────────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={HACK_IDEA_DURATION}>
          <HackIdeaScene />
        </TransitionSeries.Sequence>

        {/* Wipe up from bottom — energetic, "reveal from below" */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* ── 3. Architecture ──────────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={ARCHITECTURE_DURATION}>
          <ArchitectureScene />
        </TransitionSeries.Sequence>

        {/* Flip — dramatic 3D effect going into the code zone */}
        <TransitionSeries.Transition
          presentation={flip({ direction: "from-right" })}
          timing={springTiming({
            durationInFrames: TRANSITION_DURATION,
            config: { damping: 200, stiffness: 60 },
          })}
        />

        {/* ── 4. Code Walkthrough ──────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={CODE_WALKTHROUGH_DURATION}>
          <CodeWalkthroughScene />
        </TransitionSeries.Sequence>

        {/* Slide from left — into demo (or directly into benefits if no demo) */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={springTiming({
            durationInFrames: TRANSITION_DURATION,
            config: { damping: 200, stiffness: 80 },
          })}
        />

        {/* ── 5. Demo — optional, skipped when DEMO_DURATION = 0 ───── */}
        {DEMO_DURATION > 0 && (
          <>
            <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
              <DemoScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
            />
          </>
        )}

        {/* ── 6. Benefits ──────────────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={BENEFITS_DURATION}>
          <BenefitsScene />
        </TransitionSeries.Sequence>

        {/* Fade — gentle dissolve into the closing scene */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* ── 7. Future Scope ──────────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={FUTURE_SCOPE_DURATION}>
          <FutureScopeScene />
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};

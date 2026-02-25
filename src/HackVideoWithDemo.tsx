import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
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
import { crossZoom } from "./transitions/crossZoom";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { BenefitsScene } from "./scenes/BenefitsScene";
import { CodeWalkthroughScene } from "./scenes/CodeWalkthroughScene";
import { DemoScene } from "./scenes/DemoScene";
import { FutureScopeScene } from "./scenes/FutureScopeScene";
import { HackIdeaScene } from "./scenes/HackIdeaScene";
import { TitleScene } from "./scenes/TitleScene";

// 7-scene version — includes the Demo scene. Used when DEMO_DURATION > 0.
export const HackVideoWithDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>

        <TransitionSeries.Sequence durationInFrames={TITLE_DURATION}>
          <TitleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={HACK_IDEA_DURATION}>
          <HackIdeaScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={ARCHITECTURE_DURATION}>
          <ArchitectureScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={CODE_WALKTHROUGH_DURATION}>
          <CodeWalkthroughScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
          <DemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={BENEFITS_DURATION}>
          <BenefitsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={crossZoom()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={FUTURE_SCOPE_DURATION}>
          <FutureScopeScene />
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};

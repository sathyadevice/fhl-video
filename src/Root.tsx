import React from "react";
import { Composition } from "remotion";
import { HackVideo } from "./HackVideo";
import { TOTAL_DURATION, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants";

export const Root: React.FC = () => {
  return (
    <Composition
      id="HackVideo"
      component={HackVideo}
      durationInFrames={TOTAL_DURATION}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};

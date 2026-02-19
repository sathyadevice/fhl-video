import React from "react";
import { AbsoluteFill, Video } from "remotion";

interface SafeVideoProps {
  src: string;
  style?: React.CSSProperties;
}

interface State { hasError: boolean }

export class SafeVideo extends React.Component<SafeVideoProps, State> {
  constructor(props: SafeVideoProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <AbsoluteFill
          style={{
            background: "#0a0a0f",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 64 }}>🎬</span>
          <span style={{ color: "#94a3b8", fontSize: 24, fontFamily: "sans-serif" }}>
            Drop your PoC video at public/poc.mp4
          </span>
        </AbsoluteFill>
      );
    }

    return (
      <Video
        src={this.props.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...this.props.style,
        }}
      />
    );
  }
}

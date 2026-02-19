import React from "react";
import { Audio } from "remotion";

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches the NotSupportedError Remotion throws when
 * an audio file doesn't exist yet (before running `npm run generate:audio`).
 * Once files are present it behaves exactly like <Audio>.
 */
class AudioErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const SafeAudio: React.FC<React.ComponentProps<typeof Audio>> = (props) => (
  <AudioErrorBoundary>
    <Audio {...props} />
  </AudioErrorBoundary>
);

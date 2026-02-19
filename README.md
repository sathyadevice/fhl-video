# FHL Video Template

A Remotion-based video template for creating polished hackathon presentation videos — complete with voiceover, live captions, and animated scenes. Powered by Azure OpenAI TTS + Whisper.

![Remotion](https://img.shields.io/badge/Remotion-4.0-purple) ![Azure OpenAI](https://img.shields.io/badge/Azure-OpenAI-blue) ![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green)

---

## What you get

A 6-scene animated video with:
- **Title** — hack name, tagline, team
- **Hack Idea** — problem vs solution split layout
- **Architecture** — 4-layer tech stack diagram
- **Code Walkthrough** — annotated code snippets
- **Benefits** — icon cards
- **Future Scope** — roadmap items

Each scene has AI-generated voiceover and word-accurate live captions synced to the audio.

---

## Quickstart

### Prerequisites
- Node.js 20 LTS — https://nodejs.org
- Claude Code — `npm install -g @anthropic/claude-code`
- Azure OpenAI resource with `tts-hd` and `whisper` deployments

### Setup

```bash
git clone https://github.com/sathyadevice/fhl-video.git
cd fhl-video
npm install
```

Set your Azure credentials in PowerShell:

```powershell
$env:AZURE_OPENAI_ENDPOINT = "https://your-resource.cognitiveservices.azure.com"
$env:AZURE_OPENAI_API_KEY  = "your-key"
```

### Generate your video

Start Claude Code in the project folder:

```bash
claude
```

Then run the guided skill:

```
/fhl-video
```

Claude will ask you about your hack, write the narration, update all the scene files, generate voiceover audio, and guide you to a preview.

### Preview

```bash
npm start
# Open http://localhost:3001
```

### Render

```bash
npm run build
# Output: out/video.mp4
```

---

## Running a workshop?

See **[WORKSHOP.md](./WORKSHOP.md)** for the full hands-on session guide — prerequisites to send beforehand, exact commands, and a troubleshooting table.

---

## Project structure

```
fhl-video/
├── .claude/
│   └── commands/
│       └── fhl-video.md       ← Claude Code skill (/fhl-video)
├── public/
│   └── audio/                 ← generated MP3s (git-ignored)
├── scripts/
│   ├── generate-audio.mjs     ← Azure OpenAI TTS + Whisper pipeline
│   └── test-tts.mjs           ← verify Azure connection
├── src/
│   ├── scenes/                ← one TSX file per scene
│   ├── components/            ← CaptionOverlay, ParticleField, SafeAudio
│   ├── constants.ts           ← all content + colours (edit this for your hack)
│   └── narration.ts           ← auto-generated caption timings
├── WORKSHOP.md                ← hands-on session guide
└── package.json
```

---

## How the voiceover pipeline works

1. `generate-audio.mjs` calls **Azure OpenAI TTS** (`tts-hd`) to produce an MP3 per scene
2. It then sends each MP3 to **Azure OpenAI Whisper** for word-level transcription
3. Whisper timestamps are converted to frame-accurate caption segments
4. `src/narration.ts` and scene durations in `src/constants.ts` are auto-updated

Re-run `node scripts/generate-audio.mjs` any time you change the narration text.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Video framework | [Remotion](https://remotion.dev) 4.0 |
| Voiceover | Azure OpenAI TTS (`tts-hd`) |
| Captions | Azure OpenAI Whisper (word timestamps) |
| AI assistant | Claude Code + `/fhl-video` skill |
| Language | TypeScript + React |

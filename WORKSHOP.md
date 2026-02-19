# FHL Video Workshop

**Duration:** ~60 minutes
**Output:** A rendered MP4 presentation video with voiceover and live captions — for your FHL hack

---

## Before the session — complete these prerequisites

You need to do these **before** you arrive. Each step has a verification command so you can confirm it's working.

### 1. Install Node.js 20 LTS

Download from https://nodejs.org — choose the **LTS** version.

Verify:
```bash
node --version
# Should print v20.x.x or v18.x.x
```

### 2. Install Claude Code

```bash
npm install -g @anthropic/claude-code
```

Verify:
```bash
claude --version
```

Log in when prompted — use your Anthropic account (claude.ai).

### 3. Set up Azure OpenAI

You need an Azure subscription. If your team has a shared one, ask for access.

**In portal.azure.com:**
1. Search for **Azure OpenAI** → Create a new resource (or use an existing one)
2. Choose a region — **Sweden Central** or **East US** recommended
3. Once deployed, note down:
   - **Endpoint URL** (e.g. `https://your-resource.cognitiveservices.azure.com`)
   - **API Key** (Keys and Endpoint → Key 1)

**In ai.azure.com (Azure AI Foundry):**
1. Open your Azure OpenAI resource
2. Go to **Deployments** → **Deploy model**
3. Deploy **`tts-hd`** — set the deployment name to exactly `tts-hd`
4. Deploy **`whisper`** — set the deployment name to exactly `whisper`
5. Wait for both to show status **Succeeded**

Verify (run this in PowerShell after setting env vars in step below):
```powershell
$env:AZURE_OPENAI_ENDPOINT = "https://your-resource.cognitiveservices.azure.com"
$env:AZURE_OPENAI_API_KEY  = "your-key"
node scripts/test-tts.mjs
# Should print: ✅  SUCCESS
```

### 4. Have your hack details ready

Before the session, prepare answers to:
- Hack name and one-line tagline
- Team name
- The problem you're solving (1–2 sentences)
- Your solution (1–2 sentences)
- 3 key benefits (title + one-liner each)
- Your tech stack in layers (up to 4 layers)
- 3–5 future scope items

The clearer these are, the faster the session goes.

---

## Session walkthrough

### Step 1 — Clone and install (5 min)

```bash
git clone https://github.com/YOUR-ORG/fhl-video-template.git
cd fhl-video-template
npm install
```

Verify:
```bash
ls public/audio
# Folder exists (may be empty — that's fine)
```

---

### Step 2 — Set your Azure credentials (2 min)

Open PowerShell in the project folder:

```powershell
$env:AZURE_OPENAI_ENDPOINT = "https://your-resource.cognitiveservices.azure.com"
$env:AZURE_OPENAI_API_KEY  = "your-key-here"
```

> **Note:** These are session-only. You'll need to set them again each time you open a new PowerShell window. To make them permanent, add them to your PowerShell profile or Windows environment variables.

---

### Step 3 — Start Claude Code (1 min)

```bash
claude
```

You should see the Claude Code prompt inside the `fhl-video-template` folder.

---

### Step 4 — Run the FHL skill (20–30 min)

Type this command inside Claude Code:

```
/fhl-video
```

Claude will ask you questions about your hack — answer them all in one go. It will then:
- Write narration text for your 6 scenes
- Show you a preview of the narration for approval
- Update `src/constants.ts` and `scripts/generate-audio.mjs` with your content
- Generate voiceover audio and captions via Azure OpenAI

**You can ask Claude to change anything at any point:**
- "Make the accent colour blue"
- "The problem description sounds too technical, simplify it"
- "Add a fifth benefit card"

---

### Step 5 — Preview in Remotion Studio (5 min)

Open a second terminal window (keep Claude Code running) and run:

```bash
npm start
```

Open your browser to:
**http://localhost:3001**

You'll see the full video. Use the timeline at the bottom to scrub through scenes and check that:
- Captions are readable
- Audio plays to the end of each scene before it transitions
- Your content looks right

---

### Step 6 — Iterate (10 min)

Back in Claude Code, ask for any tweaks. Examples:
- "The architecture scene text is too small"
- "Can we make the transitions slower?"
- "Change the tagline to: ..."

Remotion Studio hot-reloads every change instantly.

---

### Step 7 — Render the final video (5 min)

When you're happy:

```bash
npm run build
```

Your video will be saved to the `out/` folder as an MP4. It renders at **1920×1080** and can be uploaded directly to SharePoint, Teams, or YouTube.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `DeploymentNotFound` error | Your `$env:AZURE_OPENAI_ENDPOINT` is pointing to the wrong resource. Get the exact Target URI from the deployment detail page in ai.azure.com |
| `AuthenticationError` | Re-copy your API key — no extra spaces |
| Audio plays but scene cuts early | Re-run `node scripts/generate-audio.mjs` — it auto-fixes scene durations |
| Remotion Studio shows blank | Check the terminal for TypeScript errors and paste them into Claude |
| Port 3001 already in use | Run `npm start` — Remotion will try 3002, 3003, etc. |
| `claude` command not found | Run `npm install -g @anthropic/claude-code` again in a fresh terminal |

---

## What you'll have at the end

```
fhl-video-template/
├── public/audio/          ← 6 MP3 voiceover files
├── src/
│   ├── constants.ts       ← your hack content
│   └── narration.ts       ← Whisper-accurate caption timings
└── out/
    └── video.mp4          ← final rendered video
```

---

## Quick reference — key commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install dependencies (once) |
| `claude` | Start Claude Code |
| `/fhl-video` | Run the FHL skill inside Claude Code |
| `npm start` | Open Remotion Studio (live preview) |
| `node scripts/generate-audio.mjs` | Regenerate voiceover + captions |
| `node scripts/test-tts.mjs` | Verify Azure TTS connection |
| `npm run build` | Render final MP4 to `out/` |

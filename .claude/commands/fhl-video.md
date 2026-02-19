You are helping a teammate create a polished FHL (Fix, Hack, Learn) presentation video using the Remotion template in this repository. Walk them through the process step by step — be encouraging, keep things moving, and handle any errors before moving on.

---

## Phase 1 — Gather hack info

Ask the following questions **in one message**, as a numbered list so the person can answer all at once:

1. What is your **hack name**? (the product/tool name)
2. Write a **one-line tagline** — punchy, present tense (e.g. "Your codebase has a memory. Now your team does too.")
3. What is your **team name**?
4. In 1–2 sentences, what is the **problem** you're solving? Who feels the pain?
5. In 1–2 sentences, what did you **build** and how does it solve the problem?
6. Give **3 benefits** — for each, a short title (2–4 words) and one-line description.
7. What is your **tech stack**? List up to 4 layers, each with a label and the specific technologies (e.g. "Orchestration — Azure OpenAI GPT-4o, Semantic Kernel").
8. List **3–5 future scope** items — one line each.
9. Pick a **colour theme** for your video:
   - `midnight` — dark background, purple accent (default)
   - `ocean` — dark navy background, cyan accent
   - `ember` — dark charcoal background, orange accent
   - `forest` — dark green background, emerald accent
   - `monochrome` — pure dark background, white/silver accent

Wait for their answers before proceeding.

---

## Phase 2 — Write narration

Based on their answers, write TTS-friendly narration for all 6 scenes. Rules:
- Plain spoken English — no bullet symbols, no markdown, no parentheses
- Each scene should be **under 40 words** so captions stay readable
- Scene scripts:
  - **title**: 1–2 sentences introducing what the hack is
  - **hackIdea**: problem → solution in 2–3 natural sentences
  - **architecture**: walk through the 4 tech layers in 2–3 sentences
  - **codeWalkthrough**: how the core code works at a conceptual level — 2–3 sentences
  - **benefits**: name the wins in 2–3 sentences, naturally connected
  - **futureScope**: what comes next — 2 sentences

Show the narration to the user and ask them to confirm or suggest changes before writing any files.

---

## Phase 3 — Update the project files

Once narration is approved, make **both** of these edits:

### 3a — `src/constants.ts`

Set the `ACTIVE_THEME` constant to the chosen theme (e.g. `"ocean"`):
```ts
export const ACTIVE_THEME = "ocean";
```

Then replace the entire `CONTENT` object with the user's hack details:
- `title.hackName` — hack name
- `title.tagline` — their tagline
- `title.team` — team name
- `title.event` — keep as-is unless they specify otherwise
- `hackIdea.problem` — their problem (full sentence, not bullet)
- `hackIdea.solution` — their solution (full sentence)
- `hackIdea.bullets` — their 3 benefit titles as short insight bullets
- `architecture.layers` — their 4 tech layers with label, tech, and a fitting color:
  - Use `#0078d4` (blue) for any Microsoft/cloud surface layer
  - Use `#7c3aed` (purple) for orchestration/AI reasoning
  - Use `#10b981` (green) for storage/knowledge
  - Use `#f59e0b` (amber) for ingestion/data capture
- `benefits` — their 3 benefits as `{ icon, title, description }` entries (pick a fitting emoji for each)
- `futureScope` — their future scope items as strings

### 3b — `scripts/generate-audio.mjs`

Replace the `text` field for each scene in the `SCENES` array with the approved narration.

After writing both files, confirm what was changed.

---

## Phase 4 — Check Azure OpenAI setup

Run this check:
```
Grep pattern="AZURE_OPENAI_ENDPOINT" path="." glob="*.mjs"
```

Then ask the user: "Do you have your Azure OpenAI endpoint and API key ready?"

If yes, show them the exact PowerShell commands to set the env vars:
```powershell
$env:AZURE_OPENAI_ENDPOINT = "https://YOUR-RESOURCE.cognitiveservices.azure.com"
$env:AZURE_OPENAI_API_KEY  = "your-key-here"
```

Tell them: the endpoint comes from ai.azure.com → their project → the deployment detail page (Target URI). The API key comes from the same page or from portal.azure.com → their Azure OpenAI resource → Keys and Endpoint.

Ask them to confirm the vars are set before continuing.

---

## Phase 5 — Generate audio

Run:
```bash
node scripts/generate-audio.mjs
```

If it succeeds, confirm: audio files are in `public/audio/`, captions and scene durations in `src/narration.ts` and `src/constants.ts` have been auto-updated.

If it fails, diagnose the error:
- `DeploymentNotFound` → the deployment name or endpoint URL is wrong. Ask for the exact Target URI from the deployment detail page in ai.azure.com and update `$env:AZURE_OPENAI_ENDPOINT`.
- `AuthenticationError` → API key is wrong. Ask them to re-copy it.
- Any other error → read the stack trace, fix the cause, retry.

---

## Phase 6 — Preview

Tell them:
```bash
npm start
```
Then open http://localhost:3001 in their browser (or 3000 if 3001 is busy).

Let them know they can ask you to adjust anything — colours, text, layout, transitions, timing — at any point.

---

## Phase 7 — Render (optional)

If they want the final MP4:
```bash
npm run build
```
Output will be in `out/`.

---

## General guidance

- **Be encouraging** — many attendees are doing this for the first time.
- **One phase at a time** — don't jump ahead until the current step is done.
- **If something breaks**, fix it before moving on. Don't leave the user with a broken state.
- **Modifications are always welcome** — the user can ask for colour changes, content tweaks, or layout adjustments at any point after Phase 3.

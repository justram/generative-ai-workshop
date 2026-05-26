# Local Generative AI Workshop

This is a local clone of the Generative AI Workshop site with the live GPT demos routed through [`@earendil-works/pi-ai`](https://github.com/earendil-works/pi).

## Run Locally

```bash
npm install
npm start
```

Open <http://127.0.0.1:4174/>. Click the red/green ChatGPT status light in the upper-right controls and finish the ChatGPT browser login.

## Run as a Desktop App

```bash
npm install
npm run electron
```

The Electron app starts the local workshop backend internally and opens the workshop window.

## Build for Windows

On a Windows machine or a GitHub Actions Windows runner:

```bash
npm ci
npm run dist:win
npm run smoke:packaged
```

Build artifacts are written to `dist-electron/`. The build config produces both an NSIS installer and a portable `.exe`.

Expected Windows artifacts:

- `dist-electron/Generative AI Workshop-1.0.0-win-x64-installer.exe`
- `dist-electron/Generative AI Workshop-1.0.0-win-x64-portable.exe`

These builds are not code-signed yet, so Windows SmartScreen may warn users before first launch.

## Release Checks

Use three levels of checks before sharing a build:

```bash
npm run audit:localization
npm run verify:upload
```

- `npm run audit:localization` catches broken pages, wrong-language UI, bad placeholders, and console errors in the rendered Electron pages.
- `npm run smoke:packaged` must run on the target platform after packaging. On Windows it launches the real portable `.exe`, waits for the local backend and first page to render, writes a smoke result, then exits.
- `npm run verify:upload` checks that `dist-electron/google-drive-upload/` contains only the two upload zips, `README.md`, and `LICENSE`.

The GitHub Actions workflow `.github/workflows/windows-release-smoke.yml` runs the Windows build and packaged `.exe` smoke test on a real Windows runner.

## Mini-Lit Migration Completion Goal

The migration is complete only when the mini-lit source is the canonical UI layer and rendered pages behave correctly in both zh-TW and EN. Do not patch rendered DOM text to hide language bugs; fix the shared translation map or page-local source strings.

Before calling the migration done:

```bash
npm run build:ui
npm run audit:localization
npm run check
```

When comparing against a pre-migration worktree, create an old checkout and run:

```bash
git worktree add /tmp/genai-workshop-old HEAD~1
npm run compare:mini-lit -- /tmp/genai-workshop-old
```

`compare:mini-lit` renders critical pages in both languages from the old and current build roots, then fails on blank pages, console errors, or changed titles/headings.

## How Auth Works

- No API key is bundled or required.
- No shared backend is required.
- In plain Node mode, ChatGPT OAuth credentials are stored only on the local computer in `.local-auth/openai-codex.json`.
- In the Electron app, ChatGPT OAuth credentials are stored in the app user-data directory, for example `%APPDATA%/Generative AI Workshop/auth/` on Windows.
- `.local-auth/` is ignored by git and should not be shared.
- The model picker exposes GPT/Codex-family models from the ChatGPT subscription path only.

The OAuth callback uses `127.0.0.1:1455`, which is started temporarily by `pi-ai` during login.

## Notes

The workshop’s `/api/stream` endpoint is implemented by `server.mjs` and forwards local requests to the ChatGPT-backed OpenAI Codex provider through `pi-ai`.

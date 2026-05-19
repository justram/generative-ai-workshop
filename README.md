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
```

Build artifacts are written to `dist-electron/`. The build config produces both an NSIS installer and a portable `.exe`.

Expected Windows artifacts:

- `dist-electron/Generative AI Workshop-1.0.0-win-x64-installer.exe`
- `dist-electron/Generative AI Workshop-1.0.0-win-x64-portable.exe`

These builds are not code-signed yet, so Windows SmartScreen may warn users before first launch.

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

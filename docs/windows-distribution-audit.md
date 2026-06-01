# Windows Distribution Audit

The hosted Windows smoke test is still the strongest proof because it launches the packaged app on `windows-latest`. It is also the most expensive gate, so it should be used as a release gate instead of a brute-force check on every push.

Use three tiers:

1. **Source checks, every change**
   ```bash
   npm run build:ui
   npm run check
   npm run audit:localization
   ```
   This catches source, route, formatting, type, localization, and interaction-regression issues before packaging.

2. **Cheap Windows distribution audit, local/macOS friendly**
   ```bash
   npm run audit:win-dist:quick
   ```
   This builds the Windows `win-unpacked` directory and inspects the actual packaged payload without executing Windows code. It checks:
   - Windows x64 PE executable header.
   - `resources/app.asar` exists.
   - Electron entry files are present.
   - all workshop route shells and mini-lit bundles are present.
   - Pi backend files and app CSS are present.
   - package metadata and Apache-2.0 license are present.
   - forbidden directories such as `vendor/`, `dist-electron/`, `.local-auth/`, `.git/`, and `test-results/` did not leak into the package.

   This is the default audit to run before making Google Drive builds because it is fast and does not spend GitHub-hosted Windows minutes.

3. **Full release package audit**
   ```bash
   npm run audit:win-dist:release
   ```
   This creates installer and portable builds, then runs the same payload audit with `--require-installer --require-portable`. It still does not prove Windows runtime behavior; it proves the shipped Windows artifacts contain the right app.

4. **Hosted Windows smoke, manual release proof**

   Run the GitHub workflow **Windows release smoke** manually from Actions when a Windows runtime proof is needed. It builds the Windows installer/portable artifacts, audits the distribution, launches the packaged app on Windows, visits every route in both languages, and uploads `test-results`.

   The workflow is intentionally `workflow_dispatch` only. Do not re-enable push/PR triggers unless we decide the Actions budget is worth spending.

## What each tier proves

| Tier | Proves | Does not prove |
| --- | --- | --- |
| `npm run check` | Source health, route shells, lint/format/types, agent-session regression | Windows package contents |
| `npm run audit:win-dist:quick` | Windows payload has the expected app, routes, bundles, backend files, license, and PE executable | App launches on Windows |
| `npm run audit:win-dist:release` | Installer/portable artifacts exist and contain an auditable packaged app | App launches on Windows |
| Manual GitHub smoke | Packaged app launches and renders on hosted Windows | Real user hardware/GPU quirks |

## Practical release flow

Before uploading to Google Drive:

```bash
npm run build:ui
npm run check
npm run audit:localization
npm run audit:win-dist:quick
npm run dist
npm run dist:win
npm run audit:win-dist -- --require-installer --require-portable
npm run verify:upload
```

Before announcing a release broadly, run the manual GitHub Windows smoke once and keep the uploaded `test-results` as evidence.

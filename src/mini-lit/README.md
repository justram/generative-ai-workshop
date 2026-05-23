# mini-lit app layer

This directory is the source of truth for shared UI primitives used by the
workshop app.

The previous app was edited directly in bundled `build/js/*.js` chunks. That
made every UI fix fragile because the app carried a copied Lit/component stack
inside hashed files. The current app builds page entries from `src/pages/` and
uses this directory as the compatibility layer around `@mariozechner/mini-lit`.

Build output goes to `build/js/pages/` and `build/js/chunks/` via:

```sh
npm run build:ui
```

Rules for future work:

- Prefer `@mariozechner/mini-lit` components over local copies.
- Keep app-specific behavior in app modules, not in the generic UI layer.
- Do not edit generated `build/js/**/*.js` by hand.
- Page entrypoints live in `src/pages/`.
- Shared workshop runtime modules live in `src/workshop-runtime/`.

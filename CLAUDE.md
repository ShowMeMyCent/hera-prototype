# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh Vite + React 19 + TypeScript scaffold (`npm create vite`). `src/App.tsx` still contains the default Vite starter content — no application-specific functionality has been built yet.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check via project references (`tsc -b`) then production-build with Vite
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build locally

There is no test runner configured yet.

## Architecture

- Entry point: [src/main.tsx](src/main.tsx) mounts `<App />` into `#root` (defined in [index.html](index.html)) under `StrictMode`.
- `tsconfig.json` is a solution file with no files of its own; it references `tsconfig.app.json` (app source, bundler module resolution, strict mode, no emit) and `tsconfig.node.json` (build tooling, e.g. `vite.config.ts`). Run type-checking through `tsc -b`, not `tsc` directly.
- Linting uses Oxlint (not ESLint). Config is in [.oxlintrc.json](.oxlintrc.json) with `react`, `typescript`, and `oxc` plugins. Type-aware lint rules are not yet enabled — see [README.md](README.md) for how to turn them on via `oxlint-tsgolint` if needed.
- Vite config ([vite.config.ts](vite.config.ts)) only wires up `@vitejs/plugin-react`; no path aliases, proxy, or env-based config exist yet.

## Notes

- Not currently a git repository.

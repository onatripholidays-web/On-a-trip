# On A Trip Holidays — FINAL TypeScript Baseline

This package is the clean starting point for the next CRM development phase.

## Baseline
- Next.js App Router + TypeScript
- React
- Supabase client dependency
- Team OAT shell
- CRM, AI Itinerary, Invoice Maker and Admin Panel routes
- Static assets in `public/`
- Server API adapters in `app/api/`
- No standalone `.html`, `.js`, or `.py` source files

## TypeScript fix
`TeamOATShell.tsx` uses explicit state typing and direct numeric state updates. The previous state-updater typing problem at line 47 has been removed.

## Clean workspace rule
Open only the project directory containing `package.json`. Do not open both a parent folder and an older/duplicate copy in the same VS Code workspace.

## Validation
Run:

```bash
npm install
npm run clean
npm run typecheck
npm run verify
npm run build
npm run dev
```

A successful `typecheck`, `verify`, and `build` is the release gate before CRM feature development begins.

## Architecture note
The legacy business modules are retained behind a compatibility layer where necessary so functionality can be preserved while the CRM is progressively converted into native typed React components. The compatibility layer is not a substitute for the eventual full component rewrite.

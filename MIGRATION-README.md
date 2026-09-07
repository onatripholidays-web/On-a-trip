# On A Trip Holidays — TypeScript Migration

This build migrates the site's HTML page surface into Next.js/TypeScript route components while preserving page content and browser-side legacy scripts.

- All HTML pages are represented by `.tsx` route files.
- All production JavaScript API handlers are represented by `.ts` route handlers.
- CSS/assets/PDFs/content files remain as assets; CSS is not a TypeScript language and should remain CSS.
- Exact duplicate files were removed. Versioned README/changelog clutter and the bundled source ZIP were removed from the production tree.
- Supabase/OpenAI secrets must remain server-side environment variables.
- Legacy browser scripts are executed by the TypeScript `LegacyHtmlPage` compatibility component so existing UI behavior can be validated before deeper component-by-component refactoring.

Next phase after validation: replace the compatibility renderer page-by-page with native React components and typed data access for CRM, Admin, AI Itinerary, and Invoice Maker.

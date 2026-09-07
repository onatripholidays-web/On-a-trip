# On A Trip Holidays — Secure TypeScript Website

Migrated from the cleaned public site to Next.js + TypeScript.

- No `.html` source pages
- 114 public routes converted to `.tsx`
- CRM removed
- AI Itinerary Maker removed
- Invoice Maker removed
- Admin panel removed
- Darjeeling/North-East page removed
- Server-side Supabase enquiry API
- Zod validation
- Origin checking
- Honeypot anti-bot field
- Basic IP throttling
- Security headers + HSTS
- Supabase secret is server-only

## Server environment variables
`SUPABASE_URL`
`SUPABASE_SECRET_KEY`

Never expose the secret with a `NEXT_PUBLIC_` prefix.

## Run
`npm install`
`npm run dev`

## Production
`npm run build`
`npm start`


## Build Fix
This build-ready version normalizes SVG attribute names for React/TypeScript (for example `viewbox` to `viewBox`) across the TS/TSX source files.
No CRM, AI itinerary maker, invoice maker, or admin panel is included.

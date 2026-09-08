# On A Trip Holidays

TypeScript-first Next.js website for On A Trip Holidays.

## Rules
- Next.js App Router + React + TypeScript
- No generated `.html` pages
- Current collections: Char Dham, Do Dham, Kedarnath, Manali, Kashmir, Ladakh, Spiti, Kerala, Thailand, Bali, Dubai, Vietnam and Nepal
- This repository contains only the public travel website; back-office tools are separate.
- Responsive/adaptive layout is designed around viewport size, orientation and input width rather than OS-only detection

## Local development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run start
```

## Environment

For enquiry persistence, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the server environment. Never place service-role keys in the browser or commit secrets.
